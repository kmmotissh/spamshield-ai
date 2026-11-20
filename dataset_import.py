import os
import csv
import re
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import ScamNumber

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "data", "spam-calls.csv")


def normalize_digits(phone: str) -> str:
    cleaned = re.sub(r"[^\d]", "", phone.strip())
    if cleaned.startswith("91") and len(cleaned) == 12:
        return cleaned[2:]
    elif cleaned.startswith("0") and len(cleaned) == 11:
        return cleaned[1:]
    return cleaned


def import_csv_to_db(db: Session, csv_file_path: str = CSV_PATH) -> int:
    if not os.path.isfile(csv_file_path):
        print(f"[Dataset Import] CSV file not found at: {csv_file_path}")
        return 0

    imported_count = 0
    with open(csv_file_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            raw_phone = row.get("phone_number", "").strip()
            if not raw_phone:
                continue

            norm_digits = normalize_digits(raw_phone)
            existing = db.query(ScamNumber).filter(
                (ScamNumber.phone_number == raw_phone) |
                (ScamNumber.normalized_number == norm_digits)
            ).first()

            if not existing:
                try:
                    reports_cnt = int(row.get("reports_count", "1") or 1)
                except ValueError:
                    reports_cnt = 1

                item = ScamNumber(
                    phone_number=raw_phone,
                    normalized_number=norm_digits,
                    caller_name=row.get("caller_name", "Unknown Caller") or "Unknown Caller",
                    category=row.get("category", "Spam") or "Spam",
                    risk_level=(row.get("risk_level", "HIGH") or "HIGH").upper(),
                    reports_count=reports_cnt,
                    reported_date=row.get("reported_date", "2026-11-01"),
                    description=row.get("description", "") or "",
                    location_state=row.get("location_state", "India") or "India",
                    carrier=row.get("carrier", "Unknown") or "Unknown",
                    fraud_type=row.get("fraud_type", "Spam Call") or "Spam Call",
                    is_verified=True
                )
                db.add(item)
                imported_count += 1

    db.commit()
    print(f"[Dataset Import] Successfully imported {imported_count} scam entries.")
    return imported_count


def import_dataset_if_empty(db: Session):
    count = db.query(ScamNumber).count()
    if count == 0:
        print("[Dataset Import] Database is empty. Seeding Indian scam numbers dataset...")
        import_csv_to_db(db)
    else:
        print(f"[Dataset Import] Database already contains {count} scam number records.")


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        import_csv_to_db(session)
    finally:
        session.close()
