from typing import List, Dict, Any, Tuple


def calculate_risk_level(score: float) -> Tuple[str, str, str]:
    """
    Returns (risk_level, verdict, color_code)
    """
    if score >= 85:
        return "CRITICAL", "CONFIRMED HIGH-THREAT SCAM", "#ef4444"
    elif score >= 60:
        return "HIGH", "HIGH-RISK SCAM DETECTED", "#f97316"
    elif score >= 30:
        return "MEDIUM", "SUSPICIOUS / POTENTIAL RISK", "#eab308"
    else:
        return "LOW", "LIKELY SAFE / NO HIGH RISKS FOUND", "#22c55e"


def get_standard_safety_tips(risk_level: str) -> List[str]:
    if risk_level in ["CRITICAL", "HIGH"]:
        return [
            "DO NOT click any link, scan any QR code, or download APK files.",
            "DO NOT share OTP, UPI PIN, bank account numbers, or CVV under any circumstances.",
            "Law enforcement agencies (Police, CBI, ED, TRAI) NEVER conduct arrests via video call ('Digital Arrest' is 100% fake).",
            "Power departments never disconnect electricity through personal WhatsApp or mobile numbers.",
            "If any money was transferred, immediately call National Cyber Crime Helpline at 1930 within the 'Golden Hour'."
        ]
    elif risk_level == "MEDIUM":
        return [
            "Exercise caution: Verify the caller or sender identity through official customer service channels.",
            "Never install remote desktop apps (AnyDesk, TeamViewer, RustDesk, QuickSupport) on recommendation of strangers.",
            "Do not accept incoming payment requests or enter your UPI PIN to 'receive' money."
        ]
    else:
        return [
            "Always verify unknown senders before sharing personal information.",
            "Keep two-factor authentication (2FA) active on all financial accounts.",
            "Report unexpected or unsolicited marketing calls to DND registry (1909)."
        ]


def get_helpline_info() -> Dict[str, str]:
    return {
        "emergency_number": "1930",
        "emergency_title": "National Cyber Crime Reporting Helpline",
        "portal_url": "https://cybercrime.gov.in",
        "trai_dnd_portal": "https://www.trai.gov.in",
        "rbi_sachet_portal": "https://sachet.rbi.org.in",
        "golden_hour_rule": "Report within 1 to 2 hours of financial transaction to freeze fraudulent transfers."
    }
