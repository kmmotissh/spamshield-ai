import os
import uuid
import json
from datetime import datetime
from typing import Optional, List

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from database import engine, Base, get_db, SessionLocal
from models import ScamNumber, ScanLog, ScamReport
import schemas
from phone_detection import analyze_phone_number
from email_detection import analyze_email_or_sms
from screenshot_ocr import analyze_screenshot
from dataset_import import import_dataset_if_empty

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Create tables and seed data
Base.metadata.create_all(bind=engine)
with SessionLocal() as db_session:
    import_dataset_if_empty(db_session)

app = FastAPI(
    title="SpamShield AI - Indian Scam & Cyber Threat Intelligence API",
    description="Intelligent multi-vector scam detection system for Phone, SMS, Email, and Screenshot fraud.",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SpamShield AI Backend",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "SQLite connected"
    }


@app.post("/api/scan/phone", response_model=schemas.PhoneScanResponse)
def scan_phone(req: schemas.PhoneScanRequest, db: Session = Depends(get_db)):
    if not req.phone_number or not req.phone_number.strip():
        raise HTTPException(status_code=400, detail="Phone number is required.")

    result = analyze_phone_number(req.phone_number.strip(), db)

    # Log scan
    log = ScanLog(
        scan_type="phone",
        query_text=req.phone_number.strip(),
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        verdict=result["verdict"],
        flags_json=json.dumps([f["rule"] for f in result["risk_factors"]]),
        summary=f"Phone scan for {result['phone_number']}: {result['verdict']}"
    )
    db.add(log)
    db.commit()

    return result


@app.post("/api/scan/email", response_model=schemas.EmailScanResponse)
def scan_email(req: schemas.EmailScanRequest, db: Session = Depends(get_db)):
    if not req.content or not req.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty.")

    result = analyze_email_or_sms(
        content=req.content.strip(),
        sender=req.sender.strip() if req.sender else None,
        subject=req.subject.strip() if req.subject else None
    )

    # Log scan
    log = ScanLog(
        scan_type="email_sms",
        query_text=(req.content[:200] + "...") if len(req.content) > 200 else req.content,
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        verdict=result["verdict"],
        flags_json=json.dumps([f["rule"] for f in result["detected_indicators"]]),
        summary=result["summary"]
    )
    db.add(log)
    db.commit()

    return result


@app.post("/api/scan/screenshot", response_model=schemas.ScreenshotScanResponse)
async def scan_screenshot(file: UploadFile = File(...), db: Session = Depends(get_db)):
    allowed_exts = {".png", ".jpg", ".jpeg", ".webp", ".bmp"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_exts:
        raise HTTPException(status_code=400, detail=f"Unsupported file format. Please upload {', '.join(allowed_exts)}")

    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    result = analyze_screenshot(file_path, file.filename)

    # Log scan
    log = ScanLog(
        scan_type="screenshot",
        query_text=f"Uploaded image: {file.filename}",
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        verdict=result["verdict"],
        flags_json=json.dumps([f["rule"] for f in result["risk_indicators"]]),
        summary=f"Screenshot OCR analysis of {file.filename}: {result['verdict']}"
    )
    db.add(log)
    db.commit()

    return result


@app.get("/api/database", response_model=schemas.DatabaseQueryResponse)
def get_scam_database(
    query: Optional[str] = Query(None, description="Search phone number, name or description"),
    category: Optional[str] = Query(None, description="Filter by scam category"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level (CRITICAL, HIGH, MEDIUM, LOW)"),
    state: Optional[str] = Query(None, description="Filter by telecom circle or state"),
    page: int = Query(1, ge=1),
    page_size: int = Query(15, ge=1, le=100),
    db: Session = Depends(get_db)
):
    q = db.query(ScamNumber)

    if query:
        search_term = f"%{query.strip()}%"
        q = q.filter(
            (ScamNumber.phone_number.ilike(search_term)) |
            (ScamNumber.normalized_number.ilike(search_term)) |
            (ScamNumber.caller_name.ilike(search_term)) |
            (ScamNumber.description.ilike(search_term)) |
            (ScamNumber.fraud_type.ilike(search_term))
        )

    if category and category != "All":
        q = q.filter(ScamNumber.category == category)

    if risk_level and risk_level != "All":
        q = q.filter(ScamNumber.risk_level == risk_level.upper())

    if state and state != "All":
        q = q.filter(ScamNumber.location_state == state)

    total = q.count()
    items = q.order_by(desc(ScamNumber.reports_count)).offset((page - 1) * page_size).limit(page_size).all()

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": items
    }


@app.post("/api/reports", response_model=schemas.ScamReportResponse)
def submit_report(report: schemas.ScamReportCreate, db: Session = Depends(get_db)):
    if not report.target_value or not report.description:
        raise HTTPException(status_code=400, detail="Target contact and description are required.")

    new_report = ScamReport(
        target_type=report.target_type,
        target_value=report.target_value.strip(),
        category=report.category,
        fraud_type=report.fraud_type,
        description=report.description.strip(),
        evidence=report.evidence or "",
        reporter_contact=report.reporter_contact or "Anonymous",
        status="VERIFIED",
        upvotes=1
    )
    db.add(new_report)

    # If it's a phone number, update or insert into ScamNumber
    if report.target_type == "phone":
        clean_val = report.target_value.strip()
        digits = "".join(filter(str.isdigit, clean_val))
        if len(digits) >= 10:
            norm = digits[-10:]
            existing = db.query(ScamNumber).filter(
                (ScamNumber.phone_number == clean_val) |
                (ScamNumber.normalized_number == norm)
            ).first()

            if existing:
                existing.reports_count += 1
                existing.risk_level = "CRITICAL" if existing.reports_count >= 10 else "HIGH"
            else:
                new_num = ScamNumber(
                    phone_number=clean_val,
                    normalized_number=norm,
                    caller_name=report.category,
                    category=report.category,
                    risk_level="HIGH",
                    reports_count=1,
                    reported_date=datetime.utcnow().strftime("%Y-%m-%d"),
                    description=report.description,
                    location_state="User Reported",
                    carrier="Reported Contact",
                    fraud_type=report.fraud_type,
                    is_verified=False
                )
                db.add(new_num)

    db.commit()
    db.refresh(new_report)

    return {
        "id": new_report.id,
        "target_type": new_report.target_type,
        "target_value": new_report.target_value,
        "category": new_report.category,
        "fraud_type": new_report.fraud_type,
        "description": new_report.description,
        "evidence": new_report.evidence,
        "reporter_contact": new_report.reporter_contact,
        "status": new_report.status,
        "upvotes": new_report.upvotes,
        "created_at": new_report.created_at.strftime("%Y-%m-%d %H:%M")
    }


@app.get("/api/reports", response_model=List[schemas.ScamReportResponse])
def get_reports(limit: int = 15, db: Session = Depends(get_db)):
    reports = db.query(ScamReport).order_by(desc(ScamReport.created_at)).limit(limit).all()
    out = []
    for r in reports:
        out.append({
            "id": r.id,
            "target_type": r.target_type,
            "target_value": r.target_value,
            "category": r.category,
            "fraud_type": r.fraud_type,
            "description": r.description,
            "evidence": r.evidence or "",
            "reporter_contact": r.reporter_contact,
            "status": r.status,
            "upvotes": r.upvotes,
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M")
        })
    return out


@app.get("/api/stats", response_model=schemas.DashboardStatsResponse)
def get_stats(db: Session = Depends(get_db)):
    total_numbers = db.query(ScamNumber).count()
    critical_count = db.query(ScamNumber).filter(ScamNumber.risk_level == "CRITICAL").count()
    high_count = db.query(ScamNumber).filter(ScamNumber.risk_level == "HIGH").count()
    total_scans = db.query(ScanLog).count()
    total_reports = db.query(ScamReport).count()

    # Category distribution
    cat_rows = db.query(ScamNumber.category, func.count(ScamNumber.id)).group_by(ScamNumber.category).all()
    category_dist = {cat: cnt for cat, cnt in cat_rows}

    # Top fraud types
    fraud_rows = db.query(ScamNumber.fraud_type, func.sum(ScamNumber.reports_count)).group_by(ScamNumber.fraud_type).order_by(desc(func.sum(ScamNumber.reports_count))).limit(5).all()
    top_frauds = [{"fraud_type": row[0], "total_reports": int(row[1] or 0)} for row in fraud_rows]

    # State distribution
    state_rows = db.query(ScamNumber.location_state, func.count(ScamNumber.id)).group_by(ScamNumber.location_state).order_by(desc(func.count(ScamNumber.id))).limit(6).all()
    state_dist = [{"state": row[0], "count": row[1]} for row in state_rows]

    # Recent alerts
    recent_nums = db.query(ScamNumber).order_by(desc(ScamNumber.reports_count)).limit(4).all()
    recent_alerts = [
        {
            "id": n.id,
            "phone_number": n.phone_number,
            "caller_name": n.caller_name,
            "category": n.category,
            "risk_level": n.risk_level,
            "reports_count": n.reports_count,
            "description": n.description
        }
        for n in recent_nums
    ]

    return {
        "total_scam_numbers": total_numbers,
        "critical_threats": critical_count,
        "high_threats": high_count,
        "total_scans_performed": total_scans,
        "total_user_reports": total_reports,
        "category_distribution": category_dist,
        "top_fraud_types": top_frauds,
        "state_breakdown": state_dist,
        "recent_alerts": recent_alerts
    }
