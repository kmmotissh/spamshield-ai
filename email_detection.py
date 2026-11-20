import re
from typing import Dict, Any, List, Optional
from urllib.parse import urlparse
from risk_scoring import calculate_risk_level, get_standard_safety_tips


# Comprehensive threat trigger dictionary covering both Indian cyber vectors and global email spam/phishing
THREAT_TRIGGERS = {
    "Digital Arrest & Law Enforcement": [
        r"\bdigital\s+arrest\b",
        r"\bmumbai\s+crime\s+branch\b",
        r"\bcbi\b",
        r"\benforcement\s+directorate\b",
        r"\bmoney\s+laundering\b",
        r"\bnarcotics\b",
        r"\bseized\s+(courier|parcel|passport)\b",
        r"\barrest\s+warrant\b",
        r"\bskype\s+(video\s+call|call|interrogation)\b",
        r"\bdo\s+not\s+disconnect\b",
        r"\bpolice\s+summons\b",
        r"\bcyber\s+crime\s+police\b"
    ],
    "Electricity & Utility Cutoff Scam": [
        r"\belectricity\b.*?\b(disconnect|cut|cutoff|shut|stop)\b",
        r"\bpower\b.*?\b(disconnect|cut|cutoff|supply)\b",
        r"\btonight\b.*?\b9:?30\b",
        r"\b(unpaid|pending)\b.*?\b(bill|electricity|bijli)\b",
        r"\b(electricity|bijli)\b.*?\b(bill|officer)\b",
        r"\bupdate\b.*?\bbill\b",
        r"\bcontact\s+electricity\s+officer\b"
    ],
    "KYC & Banking Phishing": [
        r"\byono\b",
        r"\bpan\s+card\b.*?\b(block|suspend|update|link)\b",
        r"\bkyc\b.*?\b(expire|block|suspend|update|mandatory|pending|verification)\b",
        r"\bnetbanking\b.*?\b(block|suspend|deactivate)\b",
        r"\breward\s+points\b",
        r"\baccount\s+will\s+be\s+(permanently\s+)?(closed|suspended|frozen)\b",
        r"\bshare\s+(otp|cvv|upi\s+pin)\b",
        r"\bverify\s+(your\s+)?(bank|account|pan|aadhaar)\b"
    ],
    "Account Suspension & Credential Phishing": [
        r"\b(account|mailbox|subscription|apple\s*id|google|paypal|netflix|microsoft|amazon)\b.*?\b(suspended|limited|locked|disabled|blocked|cancelled|deactivated|expire)\b",
        r"\bverify\s+(your\s+)?(identity|account|details|wallet|credentials|password)\b",
        r"\bunauthorized\s+(login|access|sign[- ]in|activity|transaction)\b",
        r"\breset\s+(your\s+)?password\b",
        r"\bupdate\s+(your\s+)?(payment|billing|card|payment\s+method)\b",
        r"\baction\s+required\s*:?\s*(your\s+)?account\b",
        r"\bsecurity\s+alert\s*:?\s*(suspicious\s+activity|sign[- ]in)\b"
    ],
    "Lottery, Prize & Giveaway Scam": [
        r"\bcongratulations\b.*?\b(won|winner|selected|prize|reward|lottery)\b",
        r"\byou\s+have\s+won\b",
        r"\b(won|claim)\s+(\$|rs\.?|inr|usd|euro|gbp|millions|crore)\b",
        r"\blottery\s+(ticket|winner|prize|claim|fund)\b",
        r"\blucky\s+draw\b",
        r"\bunclaimed\s+(funds|inheritance|millions|money)\b",
        r"\bclaim\s+(your\s+)?(prize|reward|cash|bonus)\b"
    ],
    "Invoice & Billing Renewal Extortion": [
        r"\b(geek\s+squad|norton|mcafee|paypal|apple|amazon|best\s+buy)\b.*?\b(invoice|subscription|renewal|renewed|billed|debited|charge|receipt)\b",
        r"\bauto[- ]?renew(al|ed)?\b",
        r"\bif\s+you\s+did\s+not\s+(make|authorize|recognize)\s+this\s+(order|charge|payment|purchase)\b",
        r"\bcall\s+(us|support|helpdesk|our\s+team)\s+to\s+cancel\b",
        r"\brefund\s+department\b"
    ],
    "Blackmail, Spyware & Sextortion": [
        r"\b(recorded|filmed|videotaped)\s+(you|your\s+screen|webcam)\b",
        r"\bpegasus\s+(spyware|malware)\b",
        r"\bpay\s+(bitcoin|btc|usdt|crypto)\b",
        r"\bi\s+know\s+your\s+password\b",
        r"\bsend\s+to\s+all\s+your\s+contacts\b"
    ],
    "Advance Fee & Inheritance Fraud": [
        r"\b(barrister|diplomat|beneficiary|next\s+of\s+kin|late\s+client|confidential\s+proposal)\b",
        r"\btransfer\s+of\s+(funds|\$|usd|millions)\b",
        r"\bclaim\s+the\s+inheritance\b"
    ],
    "Remote Desktop Malware": [
        r"\banydesk\b",
        r"\bquicksupport\b",
        r"\bteamviewer\b",
        r"\brustdesk\b",
        r"\bscreen\s+share\b",
        r"\binstall\s+(support\s+)?app\b"
    ],
    "Fake Job & Telegram Scam": [
        r"\bearn\b.*?\b(daily|per\s+day)\b",
        r"\blike\s+(youtube|videos)\b",
        r"\brate\s+(google|hotels|movies)\b",
        r"\btelegram\s+(task|group|channel|admin)\b",
        r"\bwork\s+from\s+home\b",
        r"\bcrypto\s+trading\s+profit\b"
    ],
    "Courier & Customs Seizure": [
        r"\bfedex\b",
        r"\bdhl\b",
        r"\bcustoms\b.*?\b(clearance|duty|held|penalty|seized)\b",
        r"\bcontraband\b",
        r"\bparcel\s+sent\s+from\s+mumbai\b"
    ],
    "UPI & Reverse QR Scam": [
        r"\bscan\s+(this\s+)?qr\s+code\b",
        r"\benter\s+(upi\s+)?pin\b",
        r"\bcashback\s+credited\b",
        r"\brefund\s+processing\b"
    ]
}

SUSPICIOUS_TLDS = [".xyz", ".top", ".club", ".online", ".site", ".tk", ".cf", ".work", ".live", ".guru", ".apk", ".click", ".buzz"]
SUSPICIOUS_SHORTENERS = ["bit.ly", "tinyurl.com", "is.gd", "t.co", "cutt.ly", "ngrok.io", "rb.gy", "shorturl.at"]


def extract_entities(text: str) -> Dict[str, Any]:
    url_pattern = r"https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+[^\s]*"
    urls = re.findall(url_pattern, text)
    
    phone_pattern = r"(?:\+91[\-\s]?)?[6-9]\d{9}\b|\b\+?\d{1,3}[\-\s]?\(?\d{3}\)?[\-\s]?\d{3}[\-\s]?\d{4}\b"
    phones = list(set(re.findall(phone_pattern, text)))

    email_pattern = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
    emails = list(set(re.findall(email_pattern, text)))

    apk_pattern = r"\b[\w\-]+\.apk\b|\bapk\b"
    apks = list(set(re.findall(apk_pattern, text, re.IGNORECASE)))

    return {
        "urls": urls,
        "phones": phones,
        "emails": emails,
        "apks": apks
    }


def analyze_email_or_sms(content: str, sender: Optional[str] = None, subject: Optional[str] = None) -> Dict[str, Any]:
    full_text = f"{subject or ''} {content}".strip()
    if not full_text:
        return {
            "risk_score": 0.0,
            "risk_level": "LOW",
            "verdict": "SAFE / EMPTY CONTENT",
            "fraud_category": "Standard Message",
            "summary": "No text content provided for threat analysis.",
            "urgent_urgency_score": 0.0,
            "financial_request_score": 0.0,
            "authority_impersonation_score": 0.0,
            "detected_indicators": [],
            "extracted_urls": [],
            "extracted_phone_numbers": [],
            "extracted_emails": [],
            "malicious_domains_found": [],
            "recommendations": get_standard_safety_tips("LOW"),
            "emergency_actions": []
        }

    entities = extract_entities(full_text)
    risk_indicators: List[Dict[str, Any]] = []
    base_score = 0.0
    detected_categories: List[str] = []

    urgency_score = 0.0
    financial_score = 0.0
    impersonation_score = 0.0

    # 1. Check sender spoofing indicators
    if sender:
        sender_lower = sender.lower()
        if any(brand in sender_lower for brand in ["sbi", "hdfc", "icici", "pnb", "axis", "paytm", "police", "trai", "rbi", "paypal", "apple", "netflix", "geek squad"]):
            if any(free in sender_lower for free in ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"]):
                risk_indicators.append({
                    "rule": "Brand / Authority Impersonation via Free Mail Provider",
                    "impact": "Critical",
                    "score_change": 45.0,
                    "description": f"Sender claims to represent an institution ({sender}) but uses an unverified free personal email domain."
                })
                base_score += 45.0
                impersonation_score += 45.0

    # 2. Match thematic threat patterns
    text_lower = full_text.lower()
    for category_name, patterns in THREAT_TRIGGERS.items():
        matched_in_cat = []
        for pat in patterns:
            match = re.search(pat, text_lower)
            if match:
                matched_in_cat.append(match.group(0))

        if matched_in_cat:
            detected_categories.append(category_name)
            weight = 65.0 if any(k in category_name for k in ["Digital Arrest", "KYC", "Remote Desktop", "Invoice", "Lottery", "Suspension", "Blackmail", "Advance Fee"]) else 50.0
            
            risk_indicators.append({
                "rule": f"Detected Scam Pattern: {category_name}",
                "impact": "Critical" if weight >= 60 else "High",
                "score_change": weight,
                "description": f"Trigger keywords found: {', '.join(matched_in_cat[:3])}"
            })
            base_score += weight

            if "Digital Arrest" in category_name or "Courier" in category_name or "Suspension" in category_name:
                impersonation_score += 35.0
                urgency_score += 25.0
            if "KYC" in category_name or "UPI" in category_name or "Invoice" in category_name or "Lottery" in category_name:
                financial_score += 40.0
            if "Electricity" in category_name:
                urgency_score += 40.0

    # 3. Urgency and panic signals
    urgency_patterns = [
        r"\bimmediately\b", r"\bwithin 24 hours\b", r"\blast warning\b",
        r"\burgent\b", r"\bwithout delay\b", r"\btonight\b", r"\baction required\b",
        r"\btime is running out\b", r"\bact now\b", r"\bfinal notice\b"
    ]
    urgent_matches = [p for p in urgency_patterns if re.search(p, text_lower)]
    if urgent_matches:
        urgency_score += min(40.0, len(urgent_matches) * 15.0)
        risk_indicators.append({
            "rule": "Psychological Time Pressure / Urgency",
            "impact": "High",
            "score_change": 20.0,
            "description": f"Content creates artificial panic through time limits: {', '.join(urgent_matches)}"
        })
        base_score += 20.0

    # 4. Sensitive credential requests
    cred_patterns = [r"\botp\b", r"\bpin\b", r"\bpassword\b", r"\bcvv\b", r"\bcard number\b", r"\bcredit card\b", r"\bdebit card\b"]
    cred_matches = [p for p in cred_patterns if re.search(p, text_lower)]
    if cred_matches:
        financial_score += 45.0
        risk_indicators.append({
            "rule": "Confidential Credential Request",
            "impact": "Critical",
            "score_change": 45.0,
            "description": f"Explicitly demands sensitive authentication credentials ({', '.join(cred_matches)})."
        })
        base_score += 45.0

    # 5. Dangerous URLs and Malicious APKs
    parsed_urls: List[Dict[str, Any]] = []
    malicious_domains: List[str] = []

    for u in entities["urls"]:
        try:
            parsed = urlparse(u)
            domain = parsed.netloc.lower()
            is_suspicious_tld = any(domain.endswith(tld) for tld in SUSPICIOUS_TLDS)
            is_shortener = any(short in domain for short in SUSPICIOUS_SHORTENERS)
            is_ip = bool(re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}", domain))
            
            is_risky = is_suspicious_tld or is_shortener or is_ip
            if is_risky:
                malicious_domains.append(domain)

            parsed_urls.append({
                "url": u,
                "domain": domain,
                "is_shortener": is_shortener,
                "is_suspicious": is_risky
            })
        except Exception:
            parsed_urls.append({"url": u, "domain": "invalid", "is_shortener": False, "is_suspicious": True})

    if malicious_domains:
        risk_indicators.append({
            "rule": "Suspicious / Obfuscated Link Detected",
            "impact": "Critical",
            "score_change": 35.0,
            "description": f"Contains shortened or deceptive web destinations: {', '.join(list(set(malicious_domains))[:3])}"
        })
        base_score += 35.0

    if entities["apks"]:
        risk_indicators.append({
            "rule": "Malicious Android Package (.APK) Prompt",
            "impact": "Critical",
            "score_change": 50.0,
            "description": f"Prompts side-loading unverified APK file ({', '.join(entities['apks'])}). Typical trojan vector used to steal banking SMS."
        })
        base_score += 50.0

    # Ensure baseline score reflects risk
    final_score = min(100.0, max(0.0, base_score))
    risk_level, verdict, _ = calculate_risk_level(final_score)

    primary_category = detected_categories[0] if detected_categories else ("Phishing / Scam" if final_score >= 50 else "Standard Message")

    summary = (
        f"Analyzed content with {len(risk_indicators)} threat indicators. "
        f"Primary classification: {primary_category}. "
        f"Threat evaluation score: {round(final_score, 1)}/100."
    )

    emergency_actions = []
    if risk_level in ["CRITICAL", "HIGH"]:
        emergency_actions = [
            "DO NOT click any link in the message or download attachments.",
            "DO NOT call back numbers mentioned in the message or provide remote access.",
            "Forward suspicious SMS to TRAI anti-spam shortcode 1909.",
            "If credentials or banking information were shared, immediately call 1930 and contact your bank to freeze access."
        ]

    return {
        "risk_score": round(final_score, 1),
        "risk_level": risk_level,
        "verdict": verdict,
        "fraud_category": primary_category,
        "summary": summary,
        "urgent_urgency_score": min(100.0, urgency_score),
        "financial_request_score": min(100.0, financial_score),
        "authority_impersonation_score": min(100.0, impersonation_score),
        "detected_indicators": risk_indicators,
        "extracted_urls": parsed_urls,
        "extracted_phone_numbers": entities["phones"],
        "extracted_emails": entities["emails"],
        "malicious_domains_found": list(set(malicious_domains)),
        "recommendations": get_standard_safety_tips(risk_level),
        "emergency_actions": emergency_actions
    }
