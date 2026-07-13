# 🦁 Advanced Wild Animal Detection and Alert System Using YOLOv5

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python">
  <img src="https://img.shields.io/badge/OpenCV-Computer%20Vision-green?style=for-the-badge&logo=opencv">
  <img src="https://img.shields.io/badge/YOLOv5-Object%20Detection-red?style=for-the-badge">
  <img src="https://img.shields.io/badge/PyTorch-Deep%20Learning-orange?style=for-the-badge&logo=pytorch">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge">
</p>

<p align="center">
An AI-powered wildlife monitoring system that detects wild animals in real time using YOLOv5 and OpenCV, helping reduce human–wildlife conflict through intelligent video analysis and instant alert notifications.
</p>

---

# 📖 Overview

Human–wildlife conflict has become a major challenge in many forest-bordering regions. Wild animals such as elephants, tigers, leopards, and bears frequently enter nearby villages in search of food or water, causing damage to crops, property, livestock, and sometimes resulting in injuries or loss of life.

The **Advanced Wild Animal Detection and Alert System** leverages **Artificial Intelligence (AI)** and **Computer Vision** to automatically detect wild animals from CCTV cameras, webcams, or recorded videos. When an animal is detected, the system immediately triggers an alarm to warn nearby residents and authorities, enabling faster response and improving public safety.

This project demonstrates how modern AI technologies can contribute to wildlife conservation while protecting human communities.

---

# 🎯 Problem Statement

Human–wildlife conflict has become an increasing concern in many rural and forest-bordering regions. Wild animals often enter villages, farms, highways, and railway tracks in search of food and water, posing serious risks to both human lives and wildlife. Traditional monitoring methods rely on manual surveillance, which is time-consuming, resource-intensive, and often fails to provide timely warnings.

This project addresses this challenge by developing an AI-powered real-time detection system using YOLOv5 and OpenCV. The system continuously monitors video streams, detects wild animals with high accuracy, and immediately triggers an alarm to alert nearby people. By providing early warnings, the solution aims to reduce accidents, protect communities, and support wildlife conservation efforts.

---

# ✨ Features

- 🦁 Real-time wild animal detection
- 🎥 Supports webcam, CCTV, and recorded videos
- ⚡ Fast object detection using YOLOv5
- 🔔 Automatic alarm generation when animals are detected
- 📦 Lightweight and easy to deploy
- 🎯 High detection accuracy
- 📊 Bounding box visualization with confidence scores
- 🖥 Easy-to-use Python implementation
- 🌳 Designed for forest-bordering regions

---

# 🛠 Technology Stack

| Category | Technologies |
|------------|----------------|
| Programming Language | Python |
| AI Model | YOLOv5 |
| Deep Learning | PyTorch |
| Computer Vision | OpenCV |
| IDE | Visual Studio Code |
| Version Control | Git & GitHub |

---

# 📂 Repository Structure

```
Advanced-Wild-Animal-Detection-and-Alert-System-Using-YOLO-V5
│
├── animal.py
├── best.pt
├── alarm.mp3
├── requirements.txt
├── README.md
├── demo_videos/
│   ├── WhatsApp Video 1.mp4
│   └── WhatsApp Video 2.mp4
└── assets/
    ├── screenshots/
    └── images/
```

---

# ⚙ Installation

### Clone the repository

```bash
git clone https://github.com/Adarshayush-21/Advanced-Wild-Animal-Detection-and-Alert-System-Using-YOLO-V5.git
```

### Navigate to the project folder

```bash
cd Advanced-Wild-Animal-Detection-and-Alert-System-Using-YOLO-V5
```

### Install dependencies

```bash
pip install -r requirements.txt
```

---

# ▶️ Usage

Run the application using:

```bash
python animal.py
```

The system will:

- Capture live video or process a video file
- Detect wild animals using YOLOv5
- Draw bounding boxes around detected animals
- Trigger an alarm when an animal is identified
- Display the processed video with detection results

---

# 🧠 How It Works

```
Video Input
      │
      ▼
Frame Extraction
      │
      ▼
YOLOv5 Model
      │
      ▼
Animal Detection
      │
      ▼
Bounding Box + Confidence Score
      │
      ▼
Play Alarm
      │
      ▼
Display Detection Result
```

---

# 📈 Model Information

| Parameter | Value |
|------------|--------|
| Model | YOLOv5 |
| Framework | PyTorch |
| Language | Python |
| Detection | Real-Time |
| Alert | Audio Alarm |

---

# 🌍 Project Applications

The **Advanced Wild Animal Detection and Alert System** is designed to enhance public safety and wildlife monitoring by providing real-time detection and instant notifications. The system can be applied in the following scenarios:

- 🦁 **Real-Time Wild Animal Detection** – Detects wild animals such as elephants, tigers, leopards, and bears from live CCTV cameras, webcams, or recorded videos using the YOLOv5 deep learning model.
- 🚨 **Instant Alarm System** – Automatically activates an alarm when a wild animal is detected, providing an immediate warning to nearby residents.
- 📩 **SMS Alert Notifications** – Sends instant SMS alerts to registered users, forest officials, or emergency contacts, enabling quick action during wildlife intrusions.
- 📧 **Email Notifications** – Automatically sends email alerts containing information about the detected animal, helping authorities respond efficiently.
- 📍 **GPS Location Tracking** – Shares the location of the detected animal, allowing forest departments and rescue teams to identify the affected area quickly.
- 🎥 **24/7 Video Surveillance** – Continuously monitors live camera feeds and recorded videos without requiring manual supervision.
- 🎯 **Accurate Object Detection** – Identifies wild animals with high accuracy by drawing bounding boxes and displaying confidence scores on the video stream.
- 🌲 **Forest Border Protection** – Assists in monitoring forest boundaries to reduce human–wildlife conflicts in nearby villages and agricultural areas.
- 👨‍🌾 **Farmland & Village Safety** – Helps protect farmers, livestock, and local communities by providing early warnings before animals reach populated areas.
- 📊 **Wildlife Monitoring & Research** – Supports wildlife researchers and forest authorities by monitoring animal movement patterns and collecting valuable observational data.

---

# 🚀 Future Enhancements

- 📱 Mobile application
- 📩 SMS notifications
- 📧 Email alerts
- 📍 GPS location tracking
- ☁ Cloud-based monitoring dashboard
- 🎥 Multi-camera support
- 🌙 Improved night vision detection
- 📊 Detection analytics dashboard
- 🤖 Edge AI deployment using NVIDIA Jetson or Raspberry Pi

---

# 👨‍💻 Author

## Adarsh K S

Computer Science Engineer

💻 Python Developer

🤖 AI/ML Enthusiast

👁 Computer Vision Developer

📊 Data Analytics

---

## ⭐ Support

If you found this project helpful, consider giving it a **⭐ Star** on GitHub. It helps others discover the project and motivates future improvements.
