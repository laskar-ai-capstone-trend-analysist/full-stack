# Product trend analysist back-end

Repository ini berisi kode untuk layanan back-end pada proyek product trend analysist

### Menjalankan proyek back-end

1. Tools :

- python : 3.12.7
- pip : 25.1.1
- mysql : 10.4.32
- xampp : 3.3.0

2. Persiapan

- Resources
  - Download python melalui [link](https://www.python.org/downloads/) berikut
  - Install pip melalui [panduan](https://packaging.python.org/en/latest/tutorials/installing-packages/) berikut
  - Install xampp yang menyertakan mysql di dalamnya, melalui [link](https://www.apachefriends.org/download.html) berikut
- Environtment

  - (Opsional) Aktifkan environtment pip atau conda jika menggunakan anaconda package manager. Langkah ini dapat dilewati jika ingin menjalankan proyek tanpa environtment, namun sangat disarankan agar tidak terjadi konflik dengan library lain pada komputer anda. Jika menggunakan pip, maka perintahnya adalah sebagai berikut

  ```bash
  pipenv install #buat pip environment
  pipenv shell #mengaktifkan pip environtment
  ```

- Dependency

  - Install dependecies menggunakan perintah

  ```
  pip install -r requirements.txt
  ```

- Database
  - Buka xampp dan jalankan mysql dan apache
  - Buka mysql workspace pada browser melalui link : localhost:[port-apache]/phpmyadmin. _port-apache disesuaikan dengan port pada lokal komputer_
  - Import file db.sql melalui menu import pada mysql workspace
- File .env
  - Buat file dengan nama `.env` lalu isi informasi variabel berikut
    - DB_HOST=localhost (atau alamat lain jika menggunakan komputer lain)
    - DB_USERNAME=[username-database], isi dengan username database
    - DB_PASSWORD=[password-database], isi dengan password database
    - DB_NAME=[name-database], isi dengan nama database
- Jalankan program

  - Buka terminal lalu jalankan proyek dengan perintah

  ```bash
  python ./main.py
  ```

  - Buka alamat localhost:5000 pada browser <br>
    _note : jika terjadi konflik dengan port 5000, ganti dengan port lain yang tersedia dengan mengupdate kode berikut_

  ```python
  if __name__ == '__main__':
  app.run(debug=True, port=[port]) # ganti [port] dengan port yang tersedia
  ```

  - Proyek siap digunakan

<br>
<br>

## REST API Documentation

`Base url : localhost:5000`

### GET /getAllProduct

Mengambil semua product

#### Query Parameters

_None_

#### Responses

- **200 OK**:
  ```json
  {
    "error": false
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
      },
      ..,
      ..
    ]
  }
  ```
- **500**:
  ```json
  {
    "error": true,
    "message": "Error fetching data",
    "data": null
  }
  ```

---

### GET /getAllCategory

Mengambil semua kategori produk

#### Query Parameters

_None_

#### Responses

- **200 OK**:

  ```json
  {
    "error": false
    "message": "Data fetched successfully",
    "data": [
      {
        "id": 1,
        "name": "Aksesoris"
      },
      ..,
      ..
    ]
  }
  ```

- **500**:
  ```json
  {
    "error": true,
    "message": "Error fetching data",
    "data": null
  }
  ```

---

### GET /getAllReview

Mengambil semua data review

#### Query Parameters

_None_

#### Responses

- **200 OK**:
  ```json
  {
    "error": false
    "message": "Data fetched successfully",
    "data": [
      {
        "id": 1,
        "productId": 13,
        "rating": 5,
        "review": "gelang kirim seller ramah tanggung dana terimakasih seller",
        "tanggal": "Tue, 01 Apr 2025 10:55:59 GMT"
      },
      ..,
      ..
    ]
  }
  ```
- **500**:
  ```json
  {
    "error": true,
    "message": "Error fetching data",
    "data": null
  }
  ```

---

### GET /getAllProductByCategory

Mengambil semua product dengan kategori tertentu

#### Query Parameters

- `category` (string, required): category id untuk filter product.

#### Responses

- **200 OK**:
  ```json
  {
    "error": false
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
        "stock": 376,
      }
      ..,
      ..
    ]
  }
  ```
- **500**:
  ```json
  {
    "error": true,
    "message": "Error fetching data",
    "data": null
  }
  ```

---

### GET /getAllReviewByProduct

Mengambil semua review berdasarkan product tertentu

#### Query Parameters

- `product` (string, required): product id untuk filter review.

#### Responses

- **200 OK**:
  ```json
  {
    "error": false
    "message": "Data fetched successfully",
    "data": [
      {
        "id": 5368,
        "productId": 1,
        "rating": 5,
        "review": "jam fungsi kelihatannewah sesuai harap",
        "tanggal": "Sun, 01 Dec 2024 10:55:59 GMT"
      },
      ..,
      ..
    ]
  }
  ```
- **500**:
  ```json
  {
    "error": true,
    "message": "Error fetching data",
    "data": null
  }
  ```

---

### GET /getAllReviewByCategory

Mengambil semua review dengan kategori tertentu

#### Query Parameters

- `category` (string, required): category id untuk filter review.

#### Responses

- **200 OK**:
  ```json
  {
    "error": false
    "message": "Data fetched successfully",
    "data": [
      {
        "id": 1070,
        "productId": 6,
        "rating": 4,
        "review": "bagus rekomedasi hadiah sukses trimakasih paket darat tuju aman",
        "tanggal": "Sat, 01 Mar 2025 10:55:59 GMT"
      },
      ..,
      ..
    ]
  }
  ```
- **500**:
  ```json
  {
    "error": true,
    "message": "Error fetching data",
    "data": null
  }
  ```

### GET /getSentimentByProduct

Mengambil semua review dengan kategori tertentu

#### Query Parameters

- `product` (string, required): product id untuk filter sentiment.

#### Responses

- **200 OK**:
  ```json
  {
    "error": false
    "message": "Prediction succeeded",
    "data": [
      {
        "productId": 7,
        "sentiment_negative": 0,
        "sentiment_neutral": 987,
        "sentiment_positive": 1
      },
      ..,
      ..
    ]
  }
  ```
- **500**:
  ```json
  {
    "error": true,
    "message": "Prediction failed",
    "data": null
  }
  ```

### GET /getAllProductsByName

Mengambil semua product yang memiliki kempiripan nama dengan keyword

#### Query Parameters

- `name` (string, required): keyword untuk mencari product.

#### Responses

- **200 OK**:
  ```json
  {
    "error": false
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
      },
      ..,
      ..
    ]
  }
  ```
- **500**:
  ```json
  {
    "error": true,
    "message": "Error fetching data",
    "data": null
  }
  ```
