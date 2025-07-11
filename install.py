#!/usr/bin/env python3
"""
WildGuard Installation Script
Automatically sets up the WildGuard Animal Detection System
"""

import os
import sys
import subprocess
import platform
import shutil
from pathlib import Path

def print_header():
    print("🛡️  WildGuard Animal Detection System Setup")
    print("=" * 50)
    print()

def check_requirements():
    """Check if required software is installed"""
    required = {
        'python3': 'Python 3.9+',
        'node': 'Node.js 18+',
        'npm': 'npm package manager'
    }
    
    missing = []
    for cmd, desc in required.items():
        if not shutil.which(cmd):
            missing.append(f"❌ {desc} ({cmd})")
        else:
            print(f"✅ {desc} found")
    
    if missing:
        print("\nMissing requirements:")
        for item in missing:
            print(f"  {item}")
        print("\nPlease install missing requirements and try again.")
        return False
    
    return True

def install_backend():
    """Install Python backend dependencies"""
    print("\n📦 Installing Python backend dependencies...")
    
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found!")
        return False
    
    requirements_file = backend_dir / "requirements.txt"
    if not requirements_file.exists():
        print("❌ requirements.txt not found!")
        return False
    
    try:
        # Create virtual environment
        print("  Creating virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
        
        # Activate venv and install requirements
        if platform.system() == "Windows":
            pip_cmd = "venv\\Scripts\\pip"
        else:
            pip_cmd = "venv/bin/pip"
        
        print("  Installing requirements...")
        subprocess.run([pip_cmd, "install", "-r", str(requirements_file)], check=True)
        
        print("✅ Backend dependencies installed successfully!")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install backend dependencies: {e}")
        return False

def install_frontend():
    """Install Node.js frontend dependencies"""
    print("\n🌐 Installing frontend dependencies...")
    
    package_json = Path("package.json")
    if not package_json.exists():
        print("❌ package.json not found!")
        return False
    
    try:
        print("  Running npm install...")
        subprocess.run(["npm", "install"], check=True)
        print("✅ Frontend dependencies installed successfully!")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install frontend dependencies: {e}")
        return False

def check_model_file():
    """Check if YOLO model file exists"""
    model_file = Path("best.pt")
    if model_file.exists():
        print("✅ YOLO model file (best.pt) found")
        return True
    else:
        print("⚠️  YOLO model file (best.pt) not found")
        print("   The system will use a default YOLOv8 model")
        return True

def check_audio_file():
    """Check if alarm audio file exists"""
    audio_file = Path("alarm.mp3")
    if audio_file.exists():
        print("✅ Alarm audio file (alarm.mp3) found")
    else:
        print("⚠️  Alarm audio file (alarm.mp3) not found")
        print("   Audio alerts will not work")

def create_startup_scripts():
    """Create platform-specific startup scripts"""
    print("\n📜 Creating startup scripts...")
    
    # Windows batch file
    windows_script = """@echo off
echo Starting WildGuard Animal Detection System...

echo Starting backend...
start "Backend" cmd /k "cd backend && ..\\venv\\Scripts\\python main.py"

timeout /t 3 /nobreak > nul

echo Starting frontend...
start "Frontend" cmd /k "npm run dev"

echo.
echo WildGuard is starting up!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo.
echo Press any key to exit...
pause > nul
"""
    
    # Unix shell script
    unix_script = """#!/bin/bash
echo "🚀 Starting WildGuard Animal Detection System..."

echo "Starting backend..."
cd backend
../venv/bin/python main.py &
BACKEND_PID=$!
cd ..

sleep 3

echo "Starting frontend..."
npm run dev &
FRONTEND_PID=$!

echo "✅ WildGuard is now running!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all services"

trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
"""
    
    try:
        if platform.system() == "Windows":
            with open("start_wildguard.bat", "w") as f:
                f.write(windows_script)
            print("✅ Created start_wildguard.bat")
        else:
            with open("start_wildguard.sh", "w") as f:
                f.write(unix_script)
            os.chmod("start_wildguard.sh", 0o755)
            print("✅ Created start_wildguard.sh")
            
    except Exception as e:
        print(f"⚠️  Could not create startup script: {e}")

def main():
    print_header()
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Install dependencies
    if not install_backend():
        sys.exit(1)
    
    if not install_frontend():
        sys.exit(1)
    
    # Check files
    check_model_file()
    check_audio_file()
    
    # Create startup scripts
    create_startup_scripts()
    
    print("\n🎉 Installation completed successfully!")
    print("\nTo start WildGuard:")
    
    if platform.system() == "Windows":
        print("  Double-click: start_wildguard.bat")
        print("  Or run: start_wildguard.bat")
    else:
        print("  Run: ./start_wildguard.sh")
        print("  Or run: chmod +x start.sh && ./start.sh")
    
    print("\nAccess the application at:")
    print("  🌐 Frontend: http://localhost:3000")
    print("  🔧 Backend API: http://localhost:8000")
    print("\nEnjoy using WildGuard! 🛡️")

if __name__ == "__main__":
    main()