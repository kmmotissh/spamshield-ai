import re
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from models import ScamNumber
from risk_scoring import calculate_risk_level, get_standard_safety_tips, get_helpline_info


# Common Indian telecom circle prefix heuristics
INDIAN_CIRCLE_PREFIXES = {
    "9811": ("Delhi NCR", "Airtel"),
    "9810": ("Delhi NCR", "Airtel"),
    "9820": ("Mumbai", "Vodafone Idea"),
    "9821": ("Mumbai", "Airtel"),
    "9845": ("Karnataka", "Airtel"),
    "9880": ("Karnataka", "Airtel"),
    "9840": ("Tamil Nadu", "Airtel"),
    "9830": ("Kolkata", "Vodafone Idea"),
    "9818": ("Delhi NCR", "Airtel"),
    "9823": ("Maharashtra & Goa", "Vodafone Idea"),
    "9910": ("Delhi NCR", "Airtel"),
    "9920": ("Mumbai", "Vodafone Idea"),
    "9945": ("Karnataka", "Airtel"),
    "9980": ("Karnataka", "Airtel"),
    "7021": ("Maharashtra", "Jio"),
    "7982": ("Delhi NCR", "Jio"),
    "9123": ("Kolkata", "Jio"),
    "9321": ("Mumbai", "Reliance / Jio"),
    "9443": ("Tamil Nadu", "BSNL"),
    "9425": ("Madhya Pradesh", "BSNL"),
    "9415": ("Uttar Pradesh", "BSNL")
}


def normalize_indian_phone(raw: str) -> Dict[str, Any]:
    """
    Cleans raw input and extracts country code and 10-digit number.
    """
    cleaned = re.sub(r"[^\d+]", "", raw.strip())
    
    # Handle leading double zero or plus
    if cleaned.startswith("00"):
        cleaned = "+" + cleaned[2:]
        
    is_international = False
    country = "India (+91)"
    digits = cleaned
    
    if cleaned.startswith("+91"):
        digits = cleaned[3:]
    elif cleaned.startswith("91") and len(cleaned) == 12:
        digits = cleaned[2:]
    elif cleaned.startswith("0") and len(cleaned) == 11:
        digits = cleaned[1:]
    elif cleaned.startswith("+"):
        is_international = True
        digits = cleaned[1:]
        if cleaned.startswith("+92"):
            country = "Pakistan (+92) [High Alert for Spoofing]"
        elif cleaned.startswith("+880"):
            country = "Bangladesh (+880)"
        elif cleaned.startswith("+234"):
            country = "Nigeria (+234) [High Alert for Advance Fee Fraud]"
        elif cleaned.startswith("+1"):
            country = "USA / Canada (+1)"
        elif cleaned.startswith("+44"):
            country = "United Kingdom (+44)"
        else:
            country = f"International ({cleaned[:3]})"
            
    # Check valid Indian mobile format: 10 digits starting with 6, 7, 8, 9
    is_valid_indian_mobile = (not is_international) and bool(re.match(r"^[6-9]\d{9}$", digits))
    
    formatted_e164 = f"+91{digits}" if (not is_international and len(digits) == 10) else cleaned

    return {
        "raw": raw,
        "cleaned": cleaned,
        "digits": digits,
        "e164": formatted_e164,
        "is_international": is_international,
        "country": country,
        "is_valid_indian_mobile": is_valid_indian_mobile
    }


def analyze_phone_number(raw_phone: str, db: Session) -> Dict[str, Any]:
    norm = normalize_indian_phone(raw_phone)
    digits = norm["digits"]
    is_intl = norm["is_international"]
    
    risk_factors: List[Dict[str, Any]] = []
    base_score = 0.0
    
    # 1. Telemarketing / TRAI prefix check
    telecom_type = "Standard Mobile"
    if digits.startswith("140") or digits.startswith("160"):
        telecom_type = "TRAI Registered Telemarketing / Promo (140/160 series)"
        risk_factors.append({
            "rule": "Commercial Telemarketing Prefix",
            "impact": "Medium",
            "score_change": 25.0,
            "description": "Number uses the 140/160 series designated by TRAI for promotional or telemarketing calls."
        })
        base_score += 25.0

    # 2. International spoofing targeting India check
    if is_intl:
        telecom_type = "International Gateway"
        if norm["cleaned"].startswith("+92") or norm["cleaned"].startswith("+234"):
            risk_factors.append({
                "rule": "High-Risk International Origin / Spoofing",
                "impact": "Critical",
                "score_change": 70.0,
                "description": "International calls from this country code are heavily associated with fake 'Mumbai Police', 'Digital Arrest', and drug courier extortion scams targeting Indian citizens."
            })
            base_score += 70.0
        else:
            risk_factors.append({
                "rule": "Unsolicited International Call",
                "impact": "High",
                "score_change": 45.0,
                "description": "Incoming international call. Indian telecom authorities advise caution as spoofed VOIP numbers frequently mimic domestic callers."
            })
            base_score += 45.0

    # 3. Circle & Carrier Guess
    circle_state_guess = "Pan-India / Unknown"
    carrier_guess = "Unknown Operator"
    if len(digits) >= 4:
        pref4 = digits[:4]
        if pref4 in INDIAN_CIRCLE_PREFIXES:
            circle_state_guess, carrier_guess = INDIAN_CIRCLE_PREFIXES[pref4]
        else:
            first_digit = digits[0]
            if first_digit == "9":
                carrier_guess = "Airtel / Jio / Vi"
            elif first_digit == "8":
                carrier_guess = "Airtel / Jio"
            elif first_digit == "7":
                carrier_guess = "Jio / Vi"
            elif first_digit == "6":
                carrier_guess = "Jio / New Allocations"

    # 4. Pattern checks (suspicious repeating or sequential digits)
    if re.search(r"(\d)\1{4,}", digits):  # 5 same consecutive digits
        risk_factors.append({
            "rule": "Suspicious Repetitive Pattern",
            "impact": "Medium",
            "score_change": 20.0,
            "description": "Phone number exhibits artificial repeated digit sequence frequently used in VOIP test lines."
        })
        base_score += 20.0

    # 5. Database lookup for known scam reports
    db_match = db.query(ScamNumber).filter(
        (ScamNumber.normalized_number == digits) |
        (ScamNumber.phone_number == norm["e164"]) |
        (ScamNumber.phone_number == raw_phone)
    ).first()

    is_known_scam = False
    reports_count = 0
    category = None
    caller_name = None
    description = None
    fraud_type = None

    if db_match:
        is_known_scam = True
        reports_count = db_match.reports_count
        category = db_match.category
        caller_name = db_match.caller_name
        description = db_match.description
        fraud_type = db_match.fraud_type
        circle_state_guess = db_match.location_state or circle_state_guess
        carrier_guess = db_match.carrier or carrier_guess

        # Score boost from verified database report
        match_level = (db_match.risk_level or "HIGH").upper()
        if match_level == "CRITICAL":
            base_score = max(base_score, 95.0)
            score_delta = 95.0
        elif match_level == "HIGH":
            base_score = max(base_score, 80.0)
            score_delta = 80.0
        else:
            base_score = max(base_score, 55.0)
            score_delta = 55.0

        risk_factors.insert(0, {
            "rule": f"Confirmed Scam Match: {category}",
            "impact": "Critical",
            "score_change": score_delta,
            "description": f"This number is flagged in the National SpamShield Registry for '{fraud_type}' with {reports_count} reports. Reported behavior: {description}"
        })
    elif not is_intl and not norm["is_valid_indian_mobile"]:
        risk_factors.append({
            "rule": "Malformed Indian Number Format",
            "impact": "Medium",
            "score_change": 25.0,
            "description": "Number length or starting digit does not adhere to standard 10-digit Indian National Numbering Plan."
        })
        base_score += 25.0

    # Cap score at 100
    final_score = min(100.0, max(0.0, base_score))
    risk_level, verdict, _ = calculate_risk_level(final_score)

    return {
        "phone_number": raw_phone,
        "normalized_number": norm["e164"],
        "is_valid_format": norm["is_valid_indian_mobile"] or is_intl,
        "country": norm["country"],
        "carrier_guess": carrier_guess,
        "circle_state_guess": circle_state_guess,
        "telecom_type": telecom_type,
        "is_known_scam": is_known_scam,
        "risk_score": round(final_score, 1),
        "risk_level": risk_level,
        "verdict": verdict,
        "reports_count": reports_count,
        "category": category,
        "caller_name": caller_name,
        "description": description,
        "fraud_type": fraud_type,
        "risk_factors": risk_factors,
        "safety_recommendations": get_standard_safety_tips(risk_level),
        "helpline_info": get_helpline_info()
    }
