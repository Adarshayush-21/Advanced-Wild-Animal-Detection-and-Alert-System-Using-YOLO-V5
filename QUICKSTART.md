# 🚀 Quick Start Guide - WildGuard

Get WildGuard running in under 5 minutes!

## 🎯 Fastest Setup (Recommended)

### Option 1: One-Click Start
```bash
./start.sh
```

### Option 2: Python Installer
```bash
python3 install.py
```

## 📋 What You Need

- **Python 3.9+** ([Download](https://python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **YOLO Model** (`best.pt` file - included)

## 🔧 Manual Setup (If needed)

### 1. Install Backend
```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 2. Install Frontend
```bash
npm install
```

### 3. Start Services
```bash
# Terminal 1 - Backend
cd backend && python main.py

# Terminal 2 - Frontend  
npm run dev
```

## 🌐 Access Your App

- **Website**: http://localhost:3000
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs

## ✅ Test It Works

1. Open http://localhost:3000
2. Upload a test image with animals
3. Check for detection results
4. Try webcam detection (allow camera access)

## 🚨 Configure Email Alerts

Edit `backend/main.py`:
```python
EMAIL_USER = "your-email@gmail.com"
EMAIL_PASS = "your-app-password"  # Use App Password for Gmail
TO_EMAIL = "recipient@gmail.com"
```

## 🆘 Common Issues

**Port 3000/8000 in use?**
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```

**Permission denied?**
```bash
chmod +x start.sh
```

**Python/Node not found?**
- Install Python 3.9+ and Node.js 18+
- Add to your PATH

## 🎉 You're Done!

WildGuard is now protecting your community with AI-powered animal detection!

**Next Steps:**
- Customize email settings
- Deploy to production
- Integrate with security systems

---
Need help? Check the full [README.md](README.md) or open an issue!