from flask import Flask, request
from flask_cors import CORS
from controller.fetch import *

app = Flask(__name__)

# ✅ Add CORS support
CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000'])

@app.route('/')
def hello():
  return {
    'error': False,
    'message': 'YAPin API is running!',
    'data': {
      'status': 'healthy',
      'version': '1.0.0'
    }
  }

@app.route('/getAllProduct', methods=['GET'])
def fetchAllProduct():
  response = getAllProducts()
  return response


@app.route('/getAllCategory', methods=['GET'])
def fetchAllCategory():
  response = getAllCategories()
  return response

@app.route('/getAllReview', methods=['GET'])
def fetchAllReview():
  response = getAllReviews()
  return response

@app.route('/getAllProductByCategory', methods=['GET'])
def fetchAllProductsByCategory():
  categoryId = request.args.get('category')
  response = getAllProductsByCategory(categoryId)
  return response

@app.route('/getAllReviewByProduct', methods=['GET'])
def fetchAllReviewsByProduct():
  productId = request.args.get('product')
  response = getAllReviewsByProduct(productId)
  return response

@app.route('/getAllReviewByCategory', methods=['GET'])
def fetchAllReviewsByCategory():
  categoryId = request.args.get('category')
  response = getAllReviewsByCategory(categoryId)
  return response

@app.route('/getSentimentByProduct', methods=['GET'])
def fetchSentimentReviewsByProduct():
  productId = request.args.get('product')
  response = getSentimentPrediction(productId)
  return response


@app.route('/getAllProductsByName', methods=['GET'])
def fetchAllProductsByName():
  name = request.args.get('name')
  response = getProductsByName(name)
  return response

# ✅ Fix: Endpoint untuk rekomendasi produk
@app.route('/getRecommendProducts', methods=['GET'])
def fetchRecommendProductsByName():
  productId = request.args.get('product')
  print(f"🔍 API endpoint called for product: {productId}")
  response = recomend_products(productId)
  print(f"🔍 API response: {response}")
  return response

# ✅ Fix: Endpoint untuk rangkuman review
@app.route('/getReviewsSumOfProduct', methods=['GET'])
def fetchReviewsSumOfProduct():
  productId = request.args.get('product')
  print(f"🔍 Review summary endpoint called for product: {productId}")
  response = getReviewsSumByProduct(productId)
  print(f"🔍 Review summary response: {response}")
  return response

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port=5000)