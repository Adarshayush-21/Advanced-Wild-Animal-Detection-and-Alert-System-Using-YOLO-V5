from fastapi import FastAPI, File, UploadFile, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import cv2
import numpy as np
from ultralytics import YOLO
import math
import time
from datetime import datetime
import geocoder
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import threading
import base64
import asyncio
from typing import List, Dict, Any
import io
from PIL import Image
import json

app = FastAPI(title="Wild Animal Detection API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Email configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_USER = "adarshayush02345@gmail.com"
EMAIL_PASS = "lohj qdlc pjgp nasv"
TO_EMAIL = "adarsh02354@gmail.com"

# Load YOLO model
try:
    model = YOLO('../best.pt')
except:
    model = YOLO('yolov8n.pt')  # Fallback to default model

# Wild animal classes
classnames = [
    'antelope', 'bear', 'cheetah', 'human', 'coyote', 'crocodile', 'deer', 'elephant', 'flamingo',
    'fox', 'giraffe', 'gorilla', 'hedgehog', 'hippopotamus', 'hornbill', 'horse', 'hummingbird', 'hyena',
    'kangaroo', 'koala', 'leopard', 'lion', 'meerkat', 'mole', 'monkey', 'moose', 'okapi', 'orangutan',
    'ostrich', 'otter', 'panda', 'pelecaniformes', 'porcupine', 'raccoon', 'reindeer', 'rhino', 'rhinoceros',
    'snake', 'squirrel', 'swan', 'tiger', 'turkey', 'wolf', 'woodpecker', 'zebra', 'horse',
    'wild boar', 'bison', 'buffalo', 'panther', 'jaguar', 'leopard', 'puma', 'cheetah', 'elephant seal',
    'grizzly bear', 'polar bear', 'giant panda', 'red panda', 'chimpanzee', 'orangutan', 'snow leopard',
    'sea lion', 'walrus', 'manatee', 'hippopotamus', 'wolverine', 'wild dog', 'serval', 'jackal',
    'meerkat', 'hyena', 'camel', 'moose', 'albatross', 'vulture', 'eagle', 'falcon', 'owl', 'hawk', 'kite',
    'penguin', 'seal', 'whale', 'orca', 'dolphin', 'shark', 'ray', 'stingray', 'cuttlefish', 'octopus'
]

wild_animals = set(classnames)
human_class = "human"

def get_live_location():
    try:
        g = geocoder.ip('me')
        if g.latlng:
            latitude, longitude = g.latlng
            return f"Latitude: {latitude}, Longitude: {longitude}"
        else:
            return "Location not available."
    except:
        return "Location not available."

def send_email(subject: str, body: str):
    try:
        msg = MIMEMultipart()
        msg["From"] = EMAIL_USER
        msg["To"] = TO_EMAIL
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)
        print("Email sent successfully.")
    except Exception as e:
        print(f"Failed to send email: {e}")

def detect_objects(frame):
    results = model(frame, stream=True)
    detections = {
        "humans": [],
        "animals": [],
        "annotated_frame": None
    }
    
    for result in results:
        boxes = result.boxes
        for box in boxes:
            confidence = box.conf[0]
            confidence = math.ceil(confidence * 100)
            class_index = int(box.cls[0])
            
            if class_index >= len(classnames):
                continue
                
            class_name = classnames[class_index]
            x1, y1, x2, y2 = box.xyxy[0]
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
            
            # Detect human with lower threshold
            if confidence > 40 and class_name == human_class:
                cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
                cv2.putText(frame, f'Human {confidence}%', (x1, y1 - 10),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
                detections["humans"].append({
                    "class": "human",
                    "confidence": confidence,
                    "bbox": [x1, y1, x2, y2]
                })
                
            # Detect wild animals with higher threshold
            elif confidence > 60 and class_name in wild_animals:
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                cv2.putText(frame, f'{class_name} {confidence}%', (x1, y1 - 10),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
                detections["animals"].append({
                    "class": class_name,
                    "confidence": confidence,
                    "bbox": [x1, y1, x2, y2]
                })
    
    # Convert frame to base64 for frontend
    _, buffer = cv2.imencode('.jpg', frame)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    detections["annotated_frame"] = f"data:image/jpeg;base64,{img_base64}"
    
    return detections

@app.get("/")
async def root():
    return {"message": "Wild Animal Detection API", "status": "running"}

@app.post("/detect/image")
async def detect_image(file: UploadFile = File(...)):
    try:
        # Read image file
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        # Perform detection
        detections = detect_objects(frame)
        
        # Send alerts if animals detected
        if detections["animals"]:
            location = get_live_location()
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            for animal in detections["animals"]:
                animal_name = animal["class"]
                threading.Thread(target=send_email, args=(
                    f"🚨 Wild Animal Alert: {animal_name.title()}",
                    f"ALERT: A {animal_name} was detected in uploaded image!\n\n"
                    f"Confidence: {animal['confidence']}%\n"
                    f"Time: {current_time}\n"
                    f"Location: {location}\n\n"
                    f"Please take necessary precautions!"
                )).start()
        
        return JSONResponse({
            "success": True,
            "detections": detections,
            "location": get_live_location(),
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/webcam")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive image data from frontend
            data = await websocket.receive_text()
            img_data = json.loads(data)
            
            # Decode base64 image
            img_base64 = img_data["image"].split(",")[1]
            img_bytes = base64.b64decode(img_base64)
            nparr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is not None:
                # Perform detection
                detections = detect_objects(frame)
                
                # Send alerts if animals detected
                if detections["animals"]:
                    location = get_live_location()
                    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    
                    for animal in detections["animals"]:
                        animal_name = animal["class"]
                        threading.Thread(target=send_email, args=(
                            f"🚨 LIVE Wild Animal Alert: {animal_name.title()}",
                            f"URGENT: A {animal_name} was detected via live webcam!\n\n"
                            f"Confidence: {animal['confidence']}%\n"
                            f"Time: {current_time}\n"
                            f"Location: {location}\n\n"
                            f"Immediate action recommended!"
                        )).start()
                
                # Send results back to frontend
                await websocket.send_text(json.dumps({
                    "detections": detections,
                    "location": get_live_location(),
                    "timestamp": datetime.now().isoformat()
                }))
                
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)