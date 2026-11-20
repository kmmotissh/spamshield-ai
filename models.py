from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float
from database import Base


class ScamNumber(Base):
    __tablename__ = "scam_numbers"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(32), unique=True, index=True, nullable=False)
    normalized_number = Column(String(32), index=True, nullable=False)
    caller_name = Column(String(128), default="Unknown Caller")
    category = Column(String(64), index=True, default="Spam")
    risk_level = Column(String(20), default="HIGH")  # LOW, MEDIUM, HIGH, CRITICAL
    reports_count = Column(Integer, default=1)
    reported_date = Column(String(32), default=lambda: datetime.utcnow().strftime("%Y-%m-%d"))
    description = Column(Text, default="")
    location_state = Column(String(64), default="India")
    carrier = Column(String(64), default="Unknown")
    fraud_type = Column(String(64), default="Spam Call")
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ScanLog(Base):
    __tablename__ = "scan_logs"

    id = Column(Integer, primary_key=True, index=True)
    scan_type = Column(String(32), index=True)  # phone, email, sms, screenshot
    query_text = Column(Text, nullable=False)
    risk_score = Column(Float, default=0.0)
    risk_level = Column(String(20), default="LOW")
    verdict = Column(String(128), default="SAFE")
    flags_json = Column(Text, default="[]")
    summary = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)


class ScamReport(Base):
    __tablename__ = "scam_reports"

    id = Column(Integer, primary_key=True, index=True)
    target_type = Column(String(32), default="phone")  # phone, email, sms, url
    target_value = Column(String(256), nullable=False)
    category = Column(String(64), default="General Scam")
    fraud_type = Column(String(64), default="Suspicious Contact")
    description = Column(Text, nullable=False)
    evidence = Column(Text, default="")
    reporter_contact = Column(String(128), default="Anonymous")
    status = Column(String(32), default="VERIFIED")
    upvotes = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
