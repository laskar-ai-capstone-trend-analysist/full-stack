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

##### GET /getAllProduct

Mengambil semua produk

```bash
curl -X GET http://localhost:5000/getAllProduct
```

**Response:**

```json
{
  "error": false,
  "message": "Data fetched successfully",
  "data": [
    {
      "categoryId": 1,
      "currentPrice": 46999,
      "discount": 59.13,
      "id": 1,
      "imgUrl": "https://images.tokopedia.net/img/cache/500-square/aphluv/1997/1/1/d2258014fd4b4e8dacf82c30502bc26d~.jpeg.webp?ect=4g",
      "name": "(BELI 2pcs DAPAT HADIAH) BITZEN Ikat Pinggang Pria Premium Dengan Bahan Aluminium Zinc Alloy dan Nylon Canvas Sabuk - Hitam, 120",
      "originalPrice": 115000,
      "stock": 376
    }
  ]
}
```

**Error Response (500):**

```json
{
  "error": true,
  "message": "Error fetching data",
  "data": null
}
```

##### GET /getAllProductByCategory

Filter produk berdasarkan kategori

**Query Parameters:**

- `category` (string, required): category id untuk filter product

```bash
curl -X GET "http://localhost:5000/getAllProductByCategory?category=1"
```

**Response:**

```json
{
  "error": false,
  "message": "Data fetched successfully",
  "data": [
    {
      "categoryId": 1,
      "currentPrice": 46999,
      "discount": 59.13,
      "id": 1,
      "imgUrl": "https://images.tokopedia.net/img/cache/500-square/aphluv/1997/1/1/d2258014fd4b4e8dacf82c30502bc26d~.jpeg.webp?ect=4g",
      "name": "(BELI 2pcs DAPAT HADIAH) BITZEN Ikat Pinggang Pria Premium Dengan Bahan Aluminium Zinc Alloy dan Nylon Canvas Sabuk - Hitam, 120",
      "originalPrice": 115000,
      "stock": 376
    }
  ]
}
```

##### GET /getAllProductsByName

Pencarian produk berdasarkan nama dengan keyword

**Query Parameters:**

- `name` (string, required): keyword untuk mencari product

```bash
curl -X GET "http://localhost:5000/getAllProductsByName?name=jam tangan"
```

**Response:**

```json
{
  "error": false,
  "message": "Data fetched successfully",
  "data": [
    {
      "categoryId": 3,
      "currentPrice": 8299000,
      "discount": 20.95,
      "id": 2,
      "imgUrl": "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2024/12/11/8eb8652e-eb2f-4464-8ce9-7d61054b907e.png.webp?ect=4g",
      "name": "APPLE IPHONE 15 IBOX 512GB 256GB 128GB - IPHONE 14 - IPHONE 13 GARANSI RESMI INDONESIA NEW SEGEL GREEN PEEL - IPHONE 13 128GB",
      "originalPrice": 10499000,
      "stock": 44
    }
  ]
}
```

#### 📂 Categories

##### GET /getAllCategory

Mengambil semua kategori produk

```bash
curl -X GET http://localhost:5000/getAllCategory
```

**Response:**

```json
{
  "error": false,
  "message": "Data fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Aksesoris"
    }
  ]
}
```

**Error Response (500):**

```json
{
  "error": true,
  "message": "Error fetching data",
  "data": null
}
```

#### ⭐ Reviews

##### GET /getAllReview

Mengambil semua data review

```bash
curl -X GET http://localhost:5000/getAllReview
```

**Response:**

```json
{
  "error": false,
  "message": "Data fetched successfully",
  "data": [
    {
      "id": 1,
      "productId": 13,
      "rating": 5,
      "review": "gelang kirim seller ramah tanggung dana terimakasih seller",
      "tanggal": "Tue, 01 Apr 2025 10:55:59 GMT"
    }
  ]
}
```

##### GET /getAllReviewByProduct

Review untuk produk tertentu

**Query Parameters:**

- `product` (string, required): product id untuk filter review

```bash
curl -X GET "http://localhost:5000/getAllReviewByProduct?product=1"
```

**Response:**

```json
{
  "error": false,
  "message": "Data fetched successfully",
  "data": [
    {
      "id": 5368,
      "productId": 1,
      "rating": 5,
      "review": "jam fungsi kelihatannewah sesuai harap",
      "tanggal": "Sun, 01 Dec 2024 10:55:59 GMT"
    }
  ]
}
```

##### GET /getAllReviewByCategory

Review berdasarkan kategori tertentu

**Query Parameters:**

- `category` (string, required): category id untuk filter review

```bash
curl -X GET "http://localhost:5000/getAllReviewByCategory?category=1"
```

**Response:**

```json
{
  "error": false,
  "message": "Data fetched successfully",
  "data": [
    {
      "id": 1070,
      "productId": 6,
      "rating": 4,
      "review": "bagus rekomedasi hadiah sukses trimakasih paket darat tuju aman",
      "tanggal": "Sat, 01 Mar 2025 10:55:59 GMT"
    }
  ]
}
```

#### 🤖 AI Sentiment Analysis

##### GET /getSentimentByProduct

Analisis sentiment untuk produk tertentu

**Query Parameters:**

- `product` (string, required): product id untuk filter sentiment

```bash
curl -X GET "http://localhost:5000/getSentimentByProduct?product=7"
```

**Response:**

```json
{
  "error": false,
  "message": "Prediction succeeded",
  "data": [
    {
      "productId": 7,
      "sentiment_negative": 0,
      "sentiment_neutral": 987,
      "sentiment_positive": 1
    }
  ]
}
```

**Error Response (500):**

```json
{
  "error": true,
  "message": "Prediction failed",
  "data": null
}
```

### Error Handling

Semua endpoint mengikuti format response yang konsisten:

**Success Response Format:**

```json
{
  "error": false,
  "message": "Operation successful message",
  "data": [
    /* actual data */
  ]
}
```

**Error Response Format:**

```json
{
  "error": true,
  "message": "Error description message",
  "data": null
}
```

### Common HTTP Status Codes

- `200 OK`: Request berhasil
- `400 Bad Request`: Parameter tidak valid atau missing
- `404 Not Found`: Resource tidak ditemukan
- `500 Internal Server Error`: Error pada server

### Rate Limiting

Saat ini belum ada rate limiting. Untuk production, implementasikan rate limiting untuk mencegah abuse.

### CORS Configuration

API sudah dikonfigurasi dengan CORS untuk development. Untuk production, pastikan CORS dikonfigurasi sesuai dengan domain frontend.

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
```

### 🔍 Detail Komponen Frontend

#### Core Pages

- **`src/app/page.tsx`**: Homepage utama dengan hero section, search, dan product grid
- **`src/app/layout.tsx`**: Root layout dengan metadata dan global providers

#### UI Components

- **`SearchInput.tsx`**: AI-powered search component dengan auto-suggestions
- **`CategoryFilter.tsx`**: Dropdown filter untuk kategori produk
- **`StatsCards.tsx`**: Dashboard cards untuk statistik platform
- **`FeatureCards.tsx`**: Cards menampilkan fitur-fitur YAPin

#### Product Components

- **`ProductCard.tsx`**: Card komponen untuk menampilkan produk individual
- **`ProductGrid.tsx`**: Grid layout untuk list produk dengan responsive design
- **`ProductModal.tsx`**: Modal detail produk dengan review dan sentiment analysis

#### Custom Hooks

- **`useProducts.ts`**: Hook untuk manajemen state produk dan search
- **`useCategories.ts`**: Hook untuk data kategori
- **`useReviews.ts`**: Hook untuk review dan sentiment data

#### Utilities

- **`api.ts`**: HTTP client untuk komunikasi dengan backend API
- **`types.ts`**: TypeScript interfaces untuk type safety
- **`utils.ts`**: Helper functions (className merger, date formatter, etc.)

### 🔧 Detail Komponen Backend

#### Core Application

- **`main.py`**: Flask app dengan route definitions dan CORS setup
- **`requirements.txt`**: Dependencies including Flask, mysql-connector, tensorflow

#### AI/ML Module

- **`sentiment_model.keras`**: Pre-trained model untuk sentiment analysis
- **`predict.py`**: Functions untuk prediction dan batch processing
- **`custom_layers.py`**: Custom layers untuk neural network
- **`util.py`**: Text preprocessing dan tokenization

#### Controllers

- **`fetch.py`**: Business logic untuk data fetching dan processing

#### Database

- **`db.sql`**: Complete database schema dengan sample data (10,000+ entries)
- **`setup.py`**: Database initialization dan migration scripts
- **`util.py`**: Database connection dan query utilities

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 🔴 Frontend Issues

##### 1. Module not found errors

```bash
# Clear cache dan reinstall
rm -rf node_modules .next
npm install
```

##### 2. TypeScript errors

```bash
# Check dan fix TypeScript issues
npm run build
```

##### 3. Tailwind CSS tidak load

- Pastikan `tailwind.config.ts` configure dengan benar
- Check import di `globals.css`
- Restart development server

##### 4. API connection failed

- Pastikan backend running di port 5000
- Check CORS configuration
- Verify `.env.local` configuration

#### 🔴 Backend Issues

##### 1. Database connection failed

```python
# Test database connection
python test_db.py
```

**Solusi:**

- Pastikan MySQL running via XAMPP
- Check credentials di `.env`
- Verify database `yapin_db` exists

##### 2. AI model loading error

```bash
# Check model file
ls -la ai_model/sentiment_model.keras
```

**Solusi:**

- Pastikan model file exists dan readable
- Check Python dependencies untuk TensorFlow
- Verify model path di environment variables

##### 3. Flask import errors

```bash
# Reinstall dependencies
pip install -r requirements.txt
```

##### 4. Port already in use

```bash
# Find process using port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

#### 🔴 Database Issues

##### 1. Import db.sql failed

- Check MySQL server running
- Verify database permissions
- Try importing via command line:

```bash
mysql -u root -p yapin_db < db.sql
```

##### 2. Connection timeout

- Increase MySQL timeout settings
- Check firewall settings
- Verify MySQL configuration

#### 🔴 Performance Issues

##### 1. Slow API responses

- Check database query optimization
- Implement caching untuk frequently accessed data
- Monitor AI model prediction time

##### 2. Frontend loading slow

- Enable Next.js image optimization
- Implement lazy loading untuk components
- Check network requests di DevTools

### 🔧 Debug Mode

#### Frontend Debug

```bash
# Enable debug mode
NEXT_PUBLIC_DEBUG=true npm run dev
```

#### Backend Debug

```python
# Enable Flask debug
export FLASK_DEBUG=1
python main.py
```

### 📊 Performance Monitoring

#### Frontend Performance

- Built-in Next.js analytics
- Custom performance hooks
- Real User Monitoring (RUM)

#### Backend Performance

- Flask request timing
- Database query monitoring
- AI model prediction metrics

### 🆘 Getting Help

Jika masih mengalami issues:

1. **Check Logs**: Periksa console logs untuk error details
2. **Search Issues**: Cari di GitHub issues atau StackOverflow
3. **Contact Team**: Hubungi tim pengembang (lihat section Tim Pengembang)

## 💡 Tips & Best Practices

### 🚀 Development Tips

#### Frontend

1. **Component Organization**: Gunakan atomic design pattern
2. **State Management**: Prefer React hooks over external state libraries
3. **Performance**: Implement lazy loading dan code splitting
4. **Accessibility**: Pastikan proper ARIA labels dan keyboard navigation

#### Backend

1. **API Design**: Follow RESTful conventions
2. **Error Handling**: Implement comprehensive error responses
3. **Security**: Validate input data dan implement rate limiting
4. **Caching**: Cache frequently accessed data

#### Database

1. **Indexing**: Add proper indexes untuk query performance
2. **Normalization**: Maintain proper database normalization
3. **Backup**: Regular database backups
4. **Monitoring**: Monitor query performance

### 🔒 Security Considerations

#### Frontend

- Sanitize user inputs
- Implement CSP headers
- Use HTTPS dalam production
- Validate data before API calls

#### Backend

- Input validation
- SQL injection prevention
- Rate limiting
- Authentication/Authorization untuk production

#### Database

- Use prepared statements
- Regular security updates
- Access control
- Encrypted connections

### 🎯 Production Deployment

#### Frontend (Vercel/Netlify)

```bash
# Build untuk production
npm run build

# Test production build
npm run start
```

#### Backend (Docker/Cloud)

```dockerfile
FROM python:3.12.7-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "main.py"]
```

#### Database (Cloud SQL/RDS)

- Migrate ke cloud database service
- Setup automated backups
- Configure monitoring
- Implement connection pooling

## 👥 Tim Pengembang

### 🏆 Tim Laskar AI

Proyek YAPin dikembangkan oleh tim yang passionate tentang AI dan web development:

#### 👨‍💻 **Ajus Dwimantara**

- **Role**: Full Stack Developer & AI Engineer
- **GitHub**: [@ajusdwimantara](https://github.com/ajusdwimantara)
- **Expertise**: React, Node.js, Machine Learning
- **Contribution**: Frontend architecture, AI model integration

#### 👩‍💻 **Febhe Maulita May Pramasta**

- **Role**: Frontend Developer & UI/UX Designer
- **GitHub**: [@fluffybhe](https://github.com/fluffybhe)
- **Expertise**: React, TypeScript, Design Systems
- **Contribution**: Component design, user experience

#### 👨‍💻 **Shingen (Jeremias Barani)**

- **Role**: Backend Developer & DevOps
- **GitHub**: [@jeremiasbarani](https://github.com/jeremiasbarani)
- **Expertise**: Python, Flask, Database Design
- **Contribution**: API development, database architecture

#### 👨‍💻 **Rama Anindya**

- **Role**: AI/ML Engineer & Data Scientist
- **GitHub**: [@ramaanindyaa](https://github.com/ramaanindyaa)
- **Expertise**: Machine Learning, Data Analysis, Python
- **Contribution**: Sentiment analysis model, data processing

### 🤝 Collaboration

Tim bekerja menggunakan:

- **Methodology**: Agile Scrum
- **Tools**: Git, GitHub, VS Code, Figma
- **Communication**: Discord, Zoom
- **Documentation**: Markdown, JSDoc, Python docstrings

## 📝 Contributing

Kami menyambut kontribusi dari komunitas! Berikut cara untuk berkontribusi:

### 🔄 Process Flow

1. **Fork** repository ini
2. **Clone** fork ke local machine

```bash
git clone https://github.com/YOUR_USERNAME/yapin.git
```

3. **Create** feature branch

```bash
git checkout -b feature/amazing-feature
```

4. **Make** changes dan commit

```bash
git add .
git commit -m "Add amazing feature"
```

5. **Push** ke branch

```bash
git push origin feature/amazing-feature
```

6. **Create** Pull Request

### 📋 Contribution Guidelines

#### Code Style

- **Frontend**: ESLint + Prettier configuration
- **Backend**: PEP 8 untuk Python
- **Commit Messages**: Conventional commits format

#### Testing

- Write unit tests untuk new features
- Ensure all tests pass sebelum PR
- Include integration tests jika applicable

#### Documentation

- Update README untuk new features
- Add JSDoc comments untuk functions
- Include API documentation updates

### 🐛 Bug Reports

Untuk melaporkan bug:

1. **Search** existing issues terlebih dahulu
2. **Create** detailed bug report dengan:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots/logs jika applicable
   - Environment details

### 💡 Feature Requests

Untuk request fitur baru:

1. **Describe** use case dan problem yang dipecahkan
2. **Provide** detailed requirements
3. **Consider** implementation complexity
4. **Discuss** dengan tim sebelum development

## 📄 License

Proyek ini menggunakan **MIT License**. Lihat file [LICENSE](LICENSE) untuk detail lengkap.

```
MIT License

Copyright (c) 2024 Tim Laskar AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🙏 Acknowledgments

### 🎯 Inspirations

- **Google Trends** - untuk UI/UX inspiration
- **Tokopedia** - untuk product data structure
- **OpenAI** - untuk AI integration patterns

### 📚 Resources

- **Data Source**: Sample data dari marketplace patterns
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Inter dari Google Fonts
- **Colors**: Custom palette inspired by modern design

### 🛠️ Technologies

- **Next.js Team** - untuk amazing React framework
- **Tailwind CSS** - untuk utility-first CSS framework
- **TensorFlow** - untuk AI/ML capabilities
- **MySQL** - untuk reliable database solution

## 📈 Roadmap

### 🎯 Q1 2025

- [ ] **Advanced AI Features**

  - Multi-language sentiment analysis
  - Product recommendation engine
  - Price prediction algorithm

- [ ] **User Features**
  - User authentication & profiles
  - Wishlist & favorites
  - Personalized recommendations

### 🎯 Q2 2025

- [ ] **Analytics Dashboard**

  - Real-time analytics
  - Business intelligence features
  - Custom reporting

- [ ] **Mobile App**
  - React Native mobile app
  - Push notifications
  - Offline functionality

### 🎯 Q3 2025

- [ ] **Enterprise Features**
  - Multi-tenant architecture
  - API rate limiting
  - Advanced security features

### 🎯 Future Ideas

- [ ] **AR/VR Integration**
- [ ] **Voice Search**
- [ ] **Blockchain Integration**
- [ ] **IoT Device Support**

---

## 🚀 Quick Start Commands

### Development Mode

```bash
# Backend
cd back-end-main
python main.py

# Frontend (new terminal)
cd front-end-main
npm run dev
```

### Production Build

```bash
# Frontend
npm run build
npm run start

# Backend
python main.py
```

### Database Operations

```bash
# Import database
mysql -u root -p yapin_db < db.sql

# Test connection
python test_db.py
```

---

**⭐ Jika project ini bermanfaat, berikan star di repository! ⭐**

**💬 Punya pertanyaan? Buka issue atau hubungi tim pengembang.**

**🔗 Links:**

- [Live Demo](http://localhost:3000) (when running locally)
- [API Documentation](http://localhost:5000) (when running locally)
- [GitHub Repository](https://github.com/laskar-ai-capstone-trend-analysist)

---

_Made with ❤️ and 🤖 AI by Tim Laskar AI - Indonesia_
