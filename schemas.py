from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class PhoneScanRequest(BaseModel):
    phone_number: str = Field(..., description="Phone number to scan (e.g., +919876543210 or 9876543210)")


class RiskBreakdownItem(BaseModel):
    rule: str
    impact: str  # Critical, High, Medium, Low
    score_change: float
    description: str


class PhoneScanResponse(BaseModel):
    phone_number: str
    normalized_number: str
    is_valid_format: bool
    country: str
    carrier_guess: str
    circle_state_guess: str
    telecom_type: str  # Mobile, Landline, Telemarketing (140/160), International VOIP
    is_known_scam: bool
    risk_score: float  # 0 to 100
    risk_level: str    # LOW, MEDIUM, HIGH, CRITICAL
    verdict: str
    reports_count: int
    category: Optional[str] = None
    caller_name: Optional[str] = None
    description: Optional[str] = None
    fraud_type: Optional[str] = None
    risk_factors: List[RiskBreakdownItem] = []
    safety_recommendations: List[str] = []
    helpline_info: Dict[str, str] = {}


class EmailScanRequest(BaseModel):
    content: str = Field(..., description="Email body or SMS text message to inspect")
    sender: Optional[str] = Field(None, description="Sender email address or SMS header (e.g., AX-SBINB, support@bank-kyc.com)")
    subject: Optional[str] = Field(None, description="Optional subject line")


class EmailScanResponse(BaseModel):
    risk_score: float
    risk_level: str
    verdict: str
    fraud_category: str
    summary: str
    urgent_urgency_score: float
    financial_request_score: float
    authority_impersonation_score: float
    detected_indicators: List[RiskBreakdownItem] = []
    extracted_urls: List[Dict[str, Any]] = []
    extracted_phone_numbers: List[str] = []
    extracted_emails: List[str] = []
    malicious_domains_found: List[str] = []
    recommendations: List[str] = []
    emergency_actions: List[str] = []


class ScreenshotScanResponse(BaseModel):
    filename: str
    extracted_text: str
    ocr_engine: str
    ocr_status: str
    risk_score: float
    risk_level: str
    verdict: str
    detected_category: str
    summary: str
    detected_phones: List[str] = []
    detected_urls: List[str] = []
    risk_indicators: List[RiskBreakdownItem] = []
    recommendations: List[str] = []


class ScamReportCreate(BaseModel):
    target_type: str = "phone"  # phone, email, sms, url
    target_value: str
    category: str
    fraud_type: str
    description: str
    evidence: Optional[str] = ""
    reporter_contact: Optional[str] = "Anonymous"


class ScamReportResponse(BaseModel):
    id: int
    target_type: str
    target_value: str
    category: str
    fraud_type: str
    description: str
    evidence: str
    reporter_contact: str
    status: str
    upvotes: int
    created_at: str

    class Config:
        from_attributes = True


class ScamNumberItem(BaseModel):
    id: int
    phone_number: str
    caller_name: str
    category: str
    risk_level: str
    reports_count: int
    reported_date: str
    description: str
    location_state: str
    carrier: str
    fraud_type: str
    is_verified: bool

    class Config:
        from_attributes = True


class DatabaseQueryResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[ScamNumberItem]


class DashboardStatsResponse(BaseModel):
    total_scam_numbers: int
    critical_threats: int
    high_threats: int
    total_scans_performed: int
    total_user_reports: int
    category_distribution: Dict[str, int]
    top_fraud_types: List[Dict[str, Any]]
    state_breakdown: List[Dict[str, Any]]
    recent_alerts: List[Dict[str, Any]]
