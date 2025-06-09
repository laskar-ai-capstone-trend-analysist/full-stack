from flask import Flask, request, jsonify
from flask_cors import CORS
from controller.fetch import *
import logging

app = Flask(__name__)

# ✅ Konfigurasi CORS yang lebih lengkap
CORS(app, origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000"
], supports_credentials=True, allow_headers=['Content-Type', 'Authorization'])

# ✅ Setup logging untuk debug
logging.basicConfig(level=logging.DEBUG)

@app.route('/')
def hello():
    return jsonify({'message': 'Hello world', 'status': 'Backend is running'})

@app.route('/getAllProduct', methods=['GET'])
def fetchAllProduct():
    try:
        response = getAllProducts()
        return response
    except Exception as e:
        app.logger.error(f"Error in getAllProduct: {str(e)}")
        return jsonify({'error': True, 'message': str(e)}), 500

@app.route('/getAllCategory', methods=['GET'])
def fetchAllCategory():
    try:
        response = getAllCategories()
        return response
    except Exception as e:
        app.logger.error(f"Error in getAllCategory: {str(e)}")
        return jsonify({'error': True, 'message': str(e)}), 500

@app.route('/getAllReview', methods=['GET'])
def fetchAllReview():
    try:
        response = getAllReviews()
        return response
    except Exception as e:
        app.logger.error(f"Error in getAllReview: {str(e)}")
        return jsonify({'error': True, 'message': str(e)}), 500

@app.route('/getAllProductByCategory', methods=['GET'])
def fetchAllProductsByCategory():
    try:
        categoryId = request.args.get('category')
        response = getAllProductsByCategory(categoryId)
        return response
    except Exception as e:
        app.logger.error(f"Error in getAllProductsByCategory: {str(e)}")
        return jsonify({'error': True, 'message': str(e)}), 500

@app.route('/getAllReviewByProduct', methods=['GET'])
def fetchAllReviewsByProduct():
    try:
        productId = request.args.get('product')
        response = getAllReviewsByProduct(productId)
        return response
    except Exception as e:
        app.logger.error(f"Error in getAllReviewsByProduct: {str(e)}")
        return jsonify({'error': True, 'message': str(e)}), 500

@app.route('/getAllReviewByCategory', methods=['GET'])
def fetchAllReviewsByCategory():
    try:
        categoryId = request.args.get('category')
        response = getAllReviewsByCategory(categoryId)
        return response
    except Exception as e:
        app.logger.error(f"Error in getAllReviewsByCategory: {str(e)}")
        return jsonify({'error': True, 'message': str(e)}), 500

@app.route('/getSentimentByProduct', methods=['GET'])
def fetchSentimentReviewsByProduct():
    try:
        productId = request.args.get('product')
        response = getSentimentPrediction(productId)
        return response
    except Exception as e:
        app.logger.error(f"Error in getSentimentByProduct: {str(e)}")
        return jsonify({'error': True, 'message': str(e)}), 500

@app.route('/getAllProductsByName', methods=['GET'])
def fetchAllProductsByName():
    try:
        name = request.args.get('name')
        response = getProductsByName(name)
        return response
    except Exception as e:
        app.logger.error(f"Error in getAllProductsByName: {str(e)}")
        return jsonify({'error': True, 'message': str(e)}), 500

# ✅ Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Backend server is running',
        'timestamp': str(datetime.now())
    })

if __name__ == '__main__':
    print("🚀 Starting backend server...")
    print("📡 Server will be accessible at: http://127.0.0.1:5000")
    print("🔗 CORS enabled for: http://localhost:3000")
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)