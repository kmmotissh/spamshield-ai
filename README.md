# 🛡️ SpamShield AI — Cyber Scam & Phishing Intelligence Platform

An intelligent, multi-vector cyber fraud detection and prevention system specifically engineered to detect and analyze prevalent Indian cyber threats — including **Digital Arrest** impersonation, **Electricity Bill Disconnection** SMS threats, **SBI/HDFC YONO KYC** phishing, **FedEx/Customs parcel seizure** extortion, and **Telegram task** scams.

---

## 📁 Project Structure

All files, datasets, configurations, virtual environments, and source code are strictly self-contained within this single project directory:

```
SpamShield-AI/
│
├── backend/
│   ├── main.py                  # FastAPI application & REST endpoints
│   ├── database.py              # SQLite connection & SQLAlchemy engine
│   ├── models.py                # Database models (ScamNumber, ScanLog, ScamReport)
│   ├── schemas.py               # Pydantic request & response schemas
│   ├── phone_detection.py       # Indian telecom circle heuristics & scam matching
│   ├── email_detection.py       # Phishing NLP, urgency scoring & URL inspector
│   ├── screenshot_ocr.py        # OCR text extraction & screenshot threat analyzer
│   ├── risk_scoring.py          # Unified threat scoring (0-100) & safety tips
│   ├── dataset_import.py        # Automatic CSV to SQLite seeder
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Environment variables
│   ├── spamshield.db            # SQLite database
│   ├── data/
│   │   └── spam-calls.csv       # Indian scam-number dataset
│   └── uploads/                 # Temporary uploaded screenshots
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, RiskBadge, RiskMeter
│   │   ├── pages/               # Dashboard, Phone, Email, OCR, Registry, Report, Helpline
│   │   ├── services/            # API client service (fetch)
│   │   ├── assets/              # Icons and static assets
│   │   ├── App.jsx              # Main tab router & application shell
│   │   ├── main.jsx             # React 18 DOM root
│   │   └── index.css            # Cyber-defense UI design system
│   ├── public/                  # Favicon & public static assets
│   ├── package.json             # Node dependencies & Vite scripts
│   ├── vite.config.js           # Vite dev server & backend API proxy
│   └── index.html               # HTML5 entry point
│
├── README.md                    # Complete documentation
├── start.bat                    # One-click automated setup & startup
├── stop.bat                     # Clean shutdown script
└── .gitignore                   # Exclusions for .venv, node_modules, .env, uploads
```

---

## ⚡ Quick Start (Double-Click Launch)

### 1. Start Both Services
Double-click `start.bat` in the `SpamShield-AI` root folder. It automatically:
1. Detects Python 3 and Node.js.
2. Creates `backend/.venv` and installs all backend Python packages.
3. Initializes the SQLite database and seeds `backend/data/spam-calls.csv`.
4. Installs frontend dependencies with `npm install` inside `frontend/`.
5. Starts the FastAPI backend at `http://127.0.0.1:8000`.
6. Starts the React + Vite frontend at `http://localhost:5173`.
7. Automatically opens `http://localhost:5173` in your default browser.

### 2. Stop Both Services
Double-click `stop.bat` in the root folder. It gracefully terminates all background processes running on port 8000 and port 5173.

---

## 💻 VS Code Instructions

> **Important**: Open **only** the main `SpamShield-AI` folder in VS Code. Do not open `backend` and `frontend` as separate workspaces.

1. Open **VS Code**.
2. Go to **File** > **Open Folder...** (or press `Ctrl + K, Ctrl + O`).
3. Select the `SpamShield-AI` folder.
4. Open the integrated terminal by pressing:
   `Ctrl + ~` (or **Terminal** > **New Terminal** from the menu).

### Running Manually from the Integrated Terminal

#### Terminal 1 — Backend:
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

#### Terminal 2 — Frontend:
Click the **+** (New Terminal) button in VS Code, then run:
```powershell
cd frontend
npm install
npm run dev
```

---

## 🚀 Key Features

### 1. 📞 Indian Phone & Caller Scanner
- **Circle & Carrier Heuristics**: Identifies telecom circle (Delhi, Mumbai, Karnataka, UP, etc.) and carrier (Jio, Airtel, Vi, BSNL).
- **TRAI Telemarketing Detection**: Automatically flags 140 / 160 series promotional lines.
- **International Spoofing Defense**: High-alert detection for spoofed numbers (+92, +234, +44) used in Digital Arrest scams.
- **National Registry Lookup**: Cross-references against verified Indian scam databases.

### 2. ✉️ Email, SMS & WhatsApp Threat Analyzer
- **Thematic Scam Cues**: Detects "Digital Arrest", "Electricity power cutoff at 9:30 PM", "SBI YONO PAN card blocked", and "Telegram review task".
- **Psychological Pressure Analysis**: Measures artificial urgency and panic triggers.
- **Malicious URL Detection**: Unmasks shortened links (`bit.ly`, `tinyurl`) and suspicious TLDs (`.xyz`, `.top`, `.apk`).

### 3. 🖼️ Screenshot OCR Scanner
- Upload screenshots of WhatsApp chats, SMS inboxes, or payment QR codes.
- Extracts on-screen text with optical character recognition.
- Automatically isolates extracted phone numbers and links for one-click inspection.

### 4. 🗄️ Scam Number Registry Explorer
- Search and filter scam records by category, threat level, and telecom circle.
- Instant inspection button to examine any flagged caller ID.

### 5. 📢 Community Scam Reporting
- Crowd-sourced reporting form allowing citizens to contribute newly observed scam contacts.

### 6. 🚨 National Cyber Helpline 1930 & Golden Hour Protocol
- Direct emergency calling shortcut to `1930`.
- Step-by-step guidance on freezing fraudulent transactions within the 2-hour Golden Hour window on `cybercrime.gov.in`.

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `POST` | `/api/scan/phone` | Scans phone number & returns risk report |
| `POST` | `/api/scan/email` | Analyzes SMS / email text for scam indicators |
| `POST` | `/api/scan/screenshot` | Uploads screenshot and performs OCR threat scan |
| `GET` | `/api/database` | Search & paginate scam number registry |
| `POST` | `/api/reports` | Submit community scam incident report |
| `GET` | `/api/reports` | Retrieve recent community scam reports |
| `GET` | `/api/stats` | Live dashboard metrics and threat breakdown |

Interactive Swagger documentation is available at `http://127.0.0.1:8000/docs` while the backend is running.
