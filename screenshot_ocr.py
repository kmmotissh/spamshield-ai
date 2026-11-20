import os
import shutil
from typing import Dict, Any, List
from PIL import Image
from email_detection import analyze_email_or_sms, extract_entities
from risk_scoring import calculate_risk_level, get_standard_safety_tips

# Initialize RapidOCR (Neural ONNX OCR engine - no external binaries needed)
RAPID_ENGINE = None
try:
    from rapidocr_onnxruntime import RapidOCR
    RAPID_ENGINE = RapidOCR()
except Exception as e:
    RAPID_ENGINE = None

# Fallback: Tesseract if installed
TESSERACT_AVAILABLE = False
try:
    import pytesseract
    TESSERACT_COMMON_PATHS = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        r"C:\Users\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"
    ]
    if shutil.which("tesseract"):
        TESSERACT_AVAILABLE = True
    else:
        for p in TESSERACT_COMMON_PATHS:
            if os.path.isfile(p):
                pytesseract.pytesseract.tesseract_cmd = p
                TESSERACT_AVAILABLE = True
                break
except Exception:
    TESSERACT_AVAILABLE = False


def extract_text_from_image(image_path: str) -> Dict[str, Any]:
    extracted_text = ""
    engine_name = "RapidOCR (Neural ONNX Engine)"
    status_msg = "SUCCESS"

    # 1. Try RapidOCR first (fastest, most accurate, no external exe required)
    if RAPID_ENGINE is not None:
        try:
            results, elapse = RAPID_ENGINE(image_path)
            if results:
                lines = [item[1].strip() for item in results if item and len(item) > 1 and item[1].strip()]
                extracted_text = "\n".join(lines)
                status_msg = f"Successfully recognized {len(lines)} text block(s) via Neural OCR."
            else:
                status_msg = "Image scanned successfully, but no readable text was detected."
                extracted_text = ""
            return {
                "text": extracted_text,
                "engine": engine_name,
                "status": status_msg
            }
        except Exception as e:
            status_msg = f"RapidOCR processing notice: {str(e)}"

    # 2. Try PyTesseract fallback
    if TESSERACT_AVAILABLE:
        try:
            import pytesseract
            img = Image.open(image_path)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            extracted_text = pytesseract.image_to_string(img).strip()
            engine_name = "Tesseract OCR"
            status_msg = "Text extracted via Tesseract OCR engine."
            return {
                "text": extracted_text,
                "engine": engine_name,
                "status": status_msg
            }
        except Exception as e:
            status_msg = f"Tesseract error: {str(e)}"

    # 3. If neither engine worked or both failed
    return {
        "text": "",
        "engine": "Standard Image Analyzer",
        "status": "Could not extract legible text. Please upload a clear screenshot with high contrast."
    }


def analyze_screenshot(image_path: str, filename: str) -> Dict[str, Any]:
    ocr_result = extract_text_from_image(image_path)
    text = ocr_result["text"].strip()

    if not text:
        return {
            "filename": filename,
            "extracted_text": "(No readable text detected in screenshot)",
            "ocr_engine": ocr_result["engine"],
            "ocr_status": ocr_result["status"],
            "risk_score": 0.0,
            "risk_level": "LOW",
            "verdict": "SAFE / NO TEXT FOUND",
            "detected_category": "Unclassified Image",
            "summary": "No text detected in the uploaded image to evaluate for scam patterns.",
            "detected_phones": [],
            "detected_urls": [],
            "risk_indicators": [],
            "recommendations": [
                "Ensure the screenshot contains readable chat messages, SMS, or emails.",
                "Crop or enhance image contrast if text is blurry or low resolution."
            ]
        }

    # Run textual risk analysis on the OCR extracted text
    analysis = analyze_email_or_sms(content=text, sender="Screenshot Attachment", subject="Visual Screenshot OCR Analysis")
    entities = extract_entities(text)

    return {
        "filename": filename,
        "extracted_text": text,
        "ocr_engine": ocr_result["engine"],
        "ocr_status": ocr_result["status"],
        "risk_score": analysis["risk_score"],
        "risk_level": analysis["risk_level"],
        "verdict": analysis["verdict"],
        "detected_category": analysis["fraud_category"],
        "summary": analysis["summary"],
        "detected_phones": entities["phones"],
        "detected_urls": [u["url"] for u in analysis["extracted_urls"]],
        "risk_indicators": analysis["detected_indicators"],
        "recommendations": analysis["recommendations"]
    }
