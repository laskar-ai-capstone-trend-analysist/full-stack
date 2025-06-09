# YAPin - Yuk AI Pickin 🤖

Platform AI-powered untuk product discovery yang cerdas dan personal. YAPin menggunakan teknologi AI untuk menganalisis sentiment review dan memberikan rekomendasi produk terbaik dari marketplace.

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Python](https://img.shields.io/badge/Python-3.12.7-green?style=flat-square&logo=python)
![MySQL](https://img.shields.io/badge/MySQL-10.4.32-orange?style=flat-square&logo=mysql)
![AI](https://img.shields.io/badge/AI-Sentiment_Analysis-purple?style=flat-square&logo=tensorflow)

## 📖 Daftar Isi

- [✨ Fitur Utama](#-fitur-utama)
- [🏗️ Arsitektur Sistem](#️-arsitektur-sistem)
- [🛠️ Tech Stack](#️-tech-stack)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Instalasi & Setup](#-instalasi--setup)
- [💻 Cara Penggunaan](#-cara-penggunaan)
- [📊 API Documentation](#-api-documentation)
- [🤖 AI Model](#-ai-model)
- [🔧 Konfigurasi](#-konfigurasi)
- [📁 Struktur Project](#-struktur-project)
- [🐛 Troubleshooting](#-troubleshooting)
- [👥 Tim Pengembang](#-tim-pengembang)
- [📝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Fitur Utama

### 🔍 AI-Powered Search

- **Smart Search**: Pencarian produk menggunakan natural language processing
- **Context Understanding**: AI memahami konteks dan preferensi pengguna
- **Intelligent Filtering**: Filter otomatis berdasarkan sentiment analysis

### 📊 Sentiment Analysis

- **Review Analysis**: Analisis sentiment dari ribuan review produk
- **Rating Prediction**: Prediksi rating berdasarkan sentiment review
- **Trend Detection**: Deteksi tren produk berdasarkan sentiment positif

### 📱 User Experience

- **Responsive Design**: Optimized untuk mobile, tablet, dan desktop
- **Real-time Updates**: Data produk dan review ter-update secara real-time
- **Interactive UI**: Interface yang intuitif dan user-friendly

### 📈 Analytics Dashboard

- **Product Trends**: Visualisasi tren produk populer
- **Category Analytics**: Analisis performa per kategori
- **Review Insights**: Dashboard insight dari review pelanggan

## 🏗️ Arsitektur Sistem

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │────│   (Flask)       │────│   (MySQL)       │
│                 │    │                 │    │                 │
│ - React 19      │    │ - AI Model      │    │ - Products      │
│ - TypeScript    │    │ - REST API      │    │ - Reviews       │
│ - Tailwind CSS  │    │ - Sentiment     │    │ - Categories    │
│ - Lucide Icons  │    │   Analysis      │    │ - Users         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Hooks

### Backend

- **Framework**: Flask (Python 3.12.7)
- **Database**: MySQL 10.4.32
- **AI/ML**: TensorFlow/Keras untuk sentiment analysis
- **API**: RESTful API architecture
- **ORM**: Custom database utilities

### DevOps & Tools

- **Development**: Turbopack, ESLint
- **Database Management**: phpMyAdmin (XAMPP)
- **Version Control**: Git
- **Package Manager**: npm/pip

## 📋 Prerequisites

Pastikan sistem Anda sudah terinstall:

### Software Requirements

- **Node.js** >= 18.0
- **Python** >= 3.12.7
- **MySQL** >= 10.4.32
- **XAMPP** 3.3.0 (untuk MySQL dan phpMyAdmin)
- **Git** (untuk version control)

### Package Managers

- **npm** atau **yarn** atau **pnpm** (untuk frontend)
- **pip** >= 25.1.1 (untuk backend)

### Hardware Requirements

- **RAM**: Minimum 8GB (16GB recommended untuk AI model)
- **Storage**: Minimum 2GB free space
- **CPU**: Multi-core processor (untuk AI processing)

## 🚀 Instalasi & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd fullstack
```

### 2. Setup Database

#### 2.1 Install & Jalankan XAMPP

1. Download XAMPP dari [https://www.apachefriends.org/download.html](https://www.apachefriends.org/download.html)
2. Install XAMPP
3. Buka XAMPP Control Panel
4. Start **Apache** dan **MySQL**

#### 2.2 Import Database

1. Buka browser dan navigasi ke `http://localhost/phpmyadmin`
2. Buat database baru dengan nama `yapin_db` (atau sesuai konfigurasi)
3. Import file `back-end-main/db.sql`:
   - Klik tab **Import**
   - Choose file: `back-end-main/db.sql`
   - Klik **Go**

### 3. Setup Backend (Flask)

#### 3.1 Navigasi ke folder backend

```bash
cd back-end-main
```

#### 3.2 Buat Virtual Environment (Recommended)

```bash
# Menggunakan pip
python -m venv yapin-env

# Aktivasi di Windows
yapin-env\Scripts\activate

# Aktivasi di macOS/Linux
source yapin-env/bin/activate
```

#### 3.3 Install Dependencies

```bash
pip install -r requirements.txt
```

#### 3.4 Konfigurasi Environment

Buat file `.env` di folder `back-end-main`:

```env
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=yapin_db
FLASK_ENV=development
FLASK_DEBUG=True
AI_MODEL_PATH=./ai_model/sentiment_model.keras
```

#### 3.5 Test Database Connection

```bash
python test_db.py
```

#### 3.6 Jalankan Backend Server

```bash
python main.py
```

Backend akan berjalan di `http://localhost:5000`

### 4. Setup Frontend (Next.js)

#### 4.1 Buka terminal baru dan navigasi ke frontend

```bash
cd front-end-main
```

#### 4.2 Install Dependencies

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

#### 4.3 Konfigurasi Environment

Buat file `.env.local` di folder `front-end-main`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=YAPin
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### 4.4 Jalankan Frontend Development Server

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

Frontend akan berjalan di `http://localhost:3000`

### 5. Verifikasi Setup

1. **Backend Check**: Buka `http://localhost:5000` - seharusnya menampilkan API response
2. **Frontend Check**: Buka `http://localhost:3000` - seharusnya menampilkan YAPin homepage
3. **Database Check**: Pastikan data produk dan review ter-load di homepage

## 💻 Cara Penggunaan

### 🏠 Homepage

1. Buka `http://localhost:3000`
2. Anda akan melihat hero section dengan branding "YAPin - Yuk AI Pickin"
3. Scroll down untuk melihat statistik produk dan kategori

### 🔍 Pencarian Produk

1. **Basic Search**:

   - Gunakan search box: "Ceritakan produk yang Anda cari..."
   - Ketik kata kunci produk (contoh: "jam tangan", "sepatu", "tas")
   - Tekan Enter atau klik tombol search

2. **AI-Powered Search**:

   - Gunakan kalimat natural: "Saya butuh jam tangan untuk olahraga"
   - AI akan memahami konteks dan menampilkan produk yang relevan

3. **Filter Kategori**:
   - Gunakan dropdown filter kategori
   - Pilih kategori spesifik untuk menyaring hasil

### 📊 Detail Produk

1. Klik pada card produk manapun
2. Modal detail akan terbuka menampilkan:
   - Informasi produk lengkap
   - Rating dan review
   - Analisis sentiment AI
   - Rekomendasi similar products

### 📱 Fitur Mobile

- Design fully responsive
- Touch-friendly interface
- Optimized untuk berbagai screen size

### 🤖 AI Features

- **Sentiment Badge**: Setiap produk menampilkan sentiment score
- **Smart Recommendations**: AI memberikan rekomendasi berdasarkan preferensi
- **Trend Analysis**: Produk trending berdasarkan sentiment positif

## 📊 API Documentation

### Base URL

```
http://localhost:5000
```

### Authentication

Saat ini API belum menggunakan authentication. Untuk production, implementasikan JWT atau API key.

### Endpoints

#### 📦 Products

##### GET /products

Mengambil semua produk

```bash
curl -X GET http://localhost:5000/products
```

**Response:**

```json
{
  "error": false,
  "message": "Data fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Smart Watch SKMEI",
      "currentPrice": 150000,
      "originalPrice": 200000,
      "imgUrl": "https://example.com/image.jpg",
      "stock": 50,
      "categoryId": 1,
      "discount": 25
    }
  ]
}
```

##### GET /products/search?q={query}

Pencarian produk dengan AI

```bash
curl -X GET "http://localhost:5000/products/search?q=jam tangan"
```

##### GET /products/category/{categoryId}

Filter produk berdasarkan kategori

```bash
curl -X GET http://localhost:5000/products/category/1
```

#### 📂 Categories

##### GET /categories

Mengambil semua kategori

```bash
curl -X GET http://localhost:5000/categories
```

#### ⭐ Reviews

##### GET /reviews

Mengambil semua review

```bash
curl -X GET http://localhost:5000/reviews
```

##### GET /reviews/product/{productId}

Review untuk produk tertentu

```bash
curl -X GET http://localhost:5000/reviews/product/1
```

#### 🤖 AI Sentiment Analysis

##### POST /analyze-sentiment

Analisis sentiment untuk text

```bash
curl -X POST http://localhost:5000/analyze-sentiment \
  -H "Content-Type: application/json" \
  -d '{"text": "Produk bagus banget, sangat puas!"}'
```

**Response:**

```json
{
  "sentiment": "positive",
  "confidence": 0.95,
  "score": 4.7
}
```

## 🤖 AI Model

### Sentiment Analysis Model

YAPin menggunakan custom trained model untuk sentiment analysis review produk.

#### Model Architecture

- **Framework**: TensorFlow/Keras
- **Type**: Sequential Neural Network
- **Input**: Tokenized Indonesian text
- **Output**: Sentiment classification (1-5 stars)

#### Model Files

```
ai_model/
├── sentiment_model.keras     # Main model file
├── custom_layers.py         # Custom layer definitions
├── predict.py              # Prediction functions
└── util.py                # Utility functions
```

#### Training Data

- **Dataset**: 10,000+ review produk Tokopedia
- **Languages**: Bahasa Indonesia
- **Categories**: Electronics, Fashion, Home & Living, etc.
- **Preprocessing**: Text cleaning, tokenization, embedding

#### Performance Metrics

- **Accuracy**: ~89%
- **Precision**: ~87%
- **Recall**: ~85%
- **F1-Score**: ~86%

### Menggunakan AI Model

#### Manual Prediction

```python
from ai_model.predict import predict_sentiment

text = "Barang bagus, sesuai ekspektasi"
result = predict_sentiment(text)
print(f"Sentiment: {result['sentiment']}")
print(f"Confidence: {result['confidence']}")
```

#### Batch Processing

```python
from ai_model.predict import predict_batch

reviews = [
    "Produk berkualitas tinggi",
    "Tidak sesuai deskripsi",
    "Pengiriman cepat, packaging bagus"
]

results = predict_batch(reviews)
for result in results:
    print(f"Text: {result['text']}")
    print(f"Sentiment: {result['sentiment']}")
```

## 🔧 Konfigurasi

### Frontend Configuration

#### Environment Variables (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ENABLE_MOCK_DATA=false

# App Configuration
NEXT_PUBLIC_APP_NAME=YAPin
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Product Discovery

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_SEARCH=true
NEXT_PUBLIC_ENABLE_SENTIMENT_ANALYSIS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Performance
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
```

#### Tailwind Configuration (tailwind.config.ts)

```typescript
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
```

### Backend Configuration

#### Environment Variables (.env)

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=yapin_db

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_PORT=5000

# AI Model Configuration
AI_MODEL_PATH=./ai_model/sentiment_model.keras
AI_ENABLE_CACHING=true
AI_BATCH_SIZE=32

# Performance
ENABLE_CORS=true
MAX_CONTENT_LENGTH=16777216  # 16MB
```

#### Database Configuration (db/util.py)

```python
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT', 3306),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USERNAME'),
            password=os.getenv('DB_PASSWORD')
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None
```

## 📁 Struktur Project

```
fullstack/
├── README.md                 # Documentation utama
├── back-end-main/           # Backend Flask application
│   ├── .env                 # Environment variables
│   ├── .gitignore          # Git ignore untuk backend
│   ├── db.sql              # Database schema & sample data
│   ├── main.py             # Flask application entry point
│   ├── requirements.txt    # Python dependencies
│   ├── test_db.py         # Database connection test
│   ├── ai_model/          # AI/ML components
│   │   ├── custom_layers.py    # Custom neural network layers
│   │   ├── predict.py         # Prediction functions
│   │   ├── sentiment_model.keras # Trained sentiment model
│   │   └── util.py           # AI utility functions
│   ├── controller/        # API controllers
│   │   ├── fetch.py          # Data fetching logic
│   │   └── __pycache__/     # Python cache
│   ├── db/               # Database utilities
│   │   ├── setup.py         # Database setup
│   │   ├── util.py          # Database utilities
│   │   └── __pycache__/    # Python cache
│   ├── etl-process/      # ETL data processing
│   └── recomm_system/    # Recommendation system
├── front-end-main/      # Frontend Next.js application
│   ├── .env.local       # Environment variables
│   ├── .gitignore      # Git ignore untuk frontend
│   ├── package.json    # Node.js dependencies
│   ├── next.config.ts  # Next.js configuration
│   ├── tailwind.config.ts # Tailwind CSS config
│   ├── tsconfig.json   # TypeScript configuration
│   ├── .next/         # Next.js build output
│   ├── public/        # Static assets
│   ├── scripts/       # Build scripts
│   └── src/          # Source code
│       ├── app/      # App Router pages
│       │   ├── globals.css    # Global styles
│       │   ├── layout.tsx     # Root layout
│       │   └── page.tsx       # Homepage
│       ├── components/        # React components
│       │   ├── ui/           # Basic UI components
│       │   │   ├── SearchInput.tsx
│       │   │   ├── CategoryFilter.tsx
│       │   │   ├── StatsCards.tsx
│       │   │   └── FeatureCards.tsx
│       │   └── product/      # Product components
│       │       ├── ProductCard.tsx
│       │       ├── ProductGrid.tsx
│       │       └── ProductModal.tsx
│       ├── hooks/           # Custom React hooks
│       │   ├── useProducts.ts
│       │   ├── useCategories.ts
│       │   └── useReviews.ts
│       └── lib/            # Utilities & configurations
│           ├── api.ts         # API functions
│           ├── types.ts       # TypeScript interfaces
│           ├── utils.ts       # Helper functions
│           ├── debug.ts       # Debug utilities
│           └── performance.ts # Performance monitoring
│
```
