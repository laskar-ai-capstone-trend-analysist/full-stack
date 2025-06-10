from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
import sys
import os
import gc  # Garbage collector

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from controller.fetch import *
    print("✅ Controller imported successfully")
except ImportError as e:
    print(f"❌ Error importing controller: {e}")
    traceback.print_exc()

app = Flask(__name__)

# ✅ Enhanced CORS support
CORS(app, 
     origins=['http://localhost:3000', 'http://127.0.0.1:3000'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'])

# ✅ Add error handler for all exceptions
@app.errorhandler(Exception)
def handle_exception(e):
    print(f"❌ Unhandled exception: {e}")
    traceback.print_exc()
    
    # Force garbage collection to free memory
    gc.collect()
    
    return jsonify({
        'error': True,
        'message': f'Internal server error: {str(e)}',
        'data': None
    }), 500

# ✅ Add memory monitoring
def log_memory_usage():
    import psutil
    process = psutil.Process(os.getpid())
    memory_mb = process.memory_info().rss / 1024 / 1024
    print(f"📊 Memory usage: {memory_mb:.1f} MB")

@app.before_request
def before_request():
    try:
        # Log request info
        print(f"📨 {request.method} {request.path}")
        
        # Check memory usage
        import psutil
        process = psutil.Process(os.getpid())
        memory_mb = process.memory_info().rss / 1024 / 1024
        
        if memory_mb > 500:  # If memory > 500MB
            print(f"⚠️ High memory usage: {memory_mb:.1f} MB - forcing garbage collection")
            gc.collect()
            
    except Exception as e:
        print(f"⚠️ Error in before_request: {e}")

@app.after_request
def after_request(response):
    try:
        print(f"✅ {request.method} {request.path} - {response.status_code}")
        
        # Force garbage collection after each request
        gc.collect()
        
    except Exception as e:
        print(f"⚠️ Error in after_request: {e}")
    
    return response

@app.route('/')
def hello():
    try:
        log_memory_usage()
        return jsonify({
            'error': False,
            'message': 'YAPin API is running!',
            'data': {
                'status': 'healthy',
                'version': '1.0.0',
                'endpoints': [
                    '/getAllProduct',
                    '/getAllCategory', 
                    '/getAllReview',
                    '/getRecommendProducts',
                    '/getReviewsSumOfProduct'
                ]
            }
        })
    except Exception as e:
        print(f"❌ Error in hello endpoint: {e}")
        traceback.print_exc()
        return jsonify({
            'error': True,
            'message': str(e),
            'data': None
        }), 500

@app.route('/getAllProduct', methods=['GET'])
def fetchAllProduct():
    try:
        print("📦 Fetching all products...")
        log_memory_usage()
        
        response = getAllProducts()
        
        # Force cleanup after large data operations
        gc.collect()
        
        print("✅ Products fetched successfully")
        return response
        
    except MemoryError:
        print("❌ Memory error in fetchAllProduct - forcing cleanup")
        gc.collect()
        return jsonify({
            'error': True,
            'message': 'Memory error - try again',
            'data': []
        }), 500
    except Exception as e:
        print(f"❌ Error fetching products: {e}")
        traceback.print_exc()
        gc.collect()
        return jsonify({
            'error': True,
            'message': f'Error fetching products: {str(e)}',
            'data': []
        }), 500

@app.route('/getAllCategory', methods=['GET'])
def fetchAllCategory():
    try:
        print("📂 Fetching all categories...")
        response = getAllCategories()
        gc.collect()
        print("✅ Categories fetched successfully")
        return response
    except Exception as e:
        print(f"❌ Error fetching categories: {e}")
        traceback.print_exc()
        gc.collect()
        return jsonify({
            'error': True,
            'message': f'Error fetching categories: {str(e)}',
            'data': []
        }), 500

@app.route('/getAllReview', methods=['GET'])
def fetchAllReview():
    try:
        print("💬 Fetching all reviews...")
        response = getAllReviews()
        gc.collect()
        print("✅ Reviews fetched successfully")
        return response
    except Exception as e:
        print(f"❌ Error fetching reviews: {e}")
        traceback.print_exc()
        gc.collect()
        return jsonify({
            'error': True,
            'message': f'Error fetching reviews: {str(e)}',
            'data': []
        }), 500

@app.route('/getAllProductByCategory', methods=['GET'])
def fetchAllProductsByCategory():
    try:
        categoryId = request.args.get('category')
        print(f"🌐 API: Received request for category: {categoryId}")
        
        # Validation
        if not categoryId:
            return jsonify({
                'error': True,
                'message': 'Category parameter is required',
                'data': []
            }), 400
        
        try:
            categoryId = int(categoryId)
        except ValueError:
            return jsonify({
                'error': True,
                'message': 'Category parameter must be a valid number',
                'data': []
            }), 400
        
        # Call controller function (returns dict)
        print(f"🔄 API: Calling getAllProductsByCategory({categoryId})")
        response_dict = getAllProductsByCategory(categoryId)
        print(f"🔄 API: Controller returned type: {type(response_dict)}")
        
        # Validate controller response
        if not isinstance(response_dict, dict):
            print(f"❌ API: Invalid controller response type: {type(response_dict)}")
            return jsonify({
                'error': True,
                'message': 'Internal server error: Invalid controller response',
                'data': []
            }), 500
        
        # Check if controller returned error
        if response_dict.get('error', False):
            print(f"❌ API: Controller error: {response_dict.get('message')}")
            return jsonify(response_dict), 500
        
        # Success case
        data_count = len(response_dict.get('data', []))
        print(f"✅ API: Success with {data_count} products")
        
        # Return success with jsonify
        return jsonify(response_dict), 200
        
    except Exception as e:
        print(f"❌ API: Unexpected error in endpoint: {e}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'error': True,
            'message': f'Internal server error: {str(e)}',
            'data': []
        }), 500

@app.route('/getAllReviewByProduct', methods=['GET'])
def fetchAllReviewsByProduct():
    try:
        productId = request.args.get('product')
        print(f"💬 Fetching reviews for product: {productId}")
        
        if not productId:
            return jsonify({
                'error': True,
                'message': 'Product parameter is required',
                'data': []
            }), 400
        
        try:
            productId = int(productId)
        except ValueError:
            return jsonify({
                'error': True,
                'message': 'Product parameter must be a valid number',
                'data': []
            }), 400
        
        response_data = getAllReviewsByProduct(productId)
        gc.collect()
        print("✅ Reviews by product fetched successfully")
        
        if response_data.get('error'):
            return jsonify(response_data), 500
        else:
            return jsonify(response_data), 200
        
    except Exception as e:
        print(f"❌ Error fetching reviews by product: {e}")
        traceback.print_exc()
        gc.collect()
        return jsonify({
            'error': True,
            'message': f'Error fetching reviews by product: {str(e)}',
            'data': []
        }), 500

@app.route('/getAllReviewByCategory', methods=['GET'])
def fetchAllReviewsByCategory():
    try:
        categoryId = request.args.get('category')
        print(f"💬 Fetching reviews for category: {categoryId}")
        
        if not categoryId:
            return jsonify({
                'error': True,
                'message': 'Category parameter is required',
                'data': []
            }), 400
        
        try:
            categoryId = int(categoryId)
        except ValueError:
            return jsonify({
                'error': True,
                'message': 'Category parameter must be a valid number',
                'data': []
            }), 400
        
        response_data = getAllReviewsByCategory(categoryId)
        gc.collect()
        print("✅ Reviews by category fetched successfully")
        
        if response_data.get('error'):
            return jsonify(response_data), 500
        else:
            return jsonify(response_data), 200
        
    except Exception as e:
        print(f"❌ Error fetching reviews by category: {e}")
        traceback.print_exc()
        gc.collect()
        return jsonify({
            'error': True,
            'message': f'Error fetching reviews by category: {str(e)}',
            'data': []
        }), 500

@app.route('/getSentimentByProduct', methods=['GET'])
def fetchSentimentReviewsByProduct():
    try:
        productId = request.args.get('product')
        print(f"😊 Fetching sentiment for product: {productId}")
        
        if not productId:
            return jsonify({
                'error': True,
                'message': 'Product parameter is required',
                'data': []
            }), 400
        
        try:
            productId = int(productId)
        except ValueError:
            return jsonify({
                'error': True,
                'message': 'Product parameter must be a valid number',
                'data': []
            }), 400
        
        response_data = getSentimentPrediction(productId)
        gc.collect()
        print("✅ Sentiment analysis fetched successfully")
        
        if response_data.get('error'):
            return jsonify(response_data), 500
        else:
            return jsonify(response_data), 200
        
    except Exception as e:
        print(f"❌ Error fetching sentiment: {e}")
        traceback.print_exc()
        gc.collect()
        return jsonify({
            'error': True,
            'message': f'Error fetching sentiment: {str(e)}',
            'data': []
        }), 500

@app.route('/getAllProductsByName', methods=['GET'])
def fetchAllProductsByName():
    try:
        name = request.args.get('name')
        print(f"🔍 Searching products by name: {name}")
        
        if not name:
            return jsonify({
                'error': True,
                'message': 'Name parameter is required',
                'data': []
            }), 400
        
        if len(name.strip()) < 2:
            return jsonify({
                'error': True,
                'message': 'Name parameter must be at least 2 characters',
                'data': []
            }), 400
        
        response_data = getProductsByName(name)
        gc.collect()
        print("✅ Products search completed successfully")
        
        if response_data.get('error'):
            return jsonify(response_data), 500
        else:
            return jsonify(response_data), 200
        
    except Exception as e:
        print(f"❌ Error searching products: {e}")
        traceback.print_exc()
        gc.collect()
        return jsonify({
            'error': True,
            'message': f'Error searching products: {str(e)}',
            'data': []
        }), 500

# ✅ Fix: Endpoint untuk rekomendasi produk dengan memory management
@app.route('/getRecommendProducts', methods=['GET'])
def fetchRecommendProductsByName():
    try:
        productId = request.args.get('product')
        print(f"🎯 API endpoint called for product recommendations: {productId}")
        log_memory_usage()
        
        response = recomend_products(productId)
        
        # Force cleanup after AI operations
        gc.collect()
        
        print(f"✅ Recommendations API response ready")
        return response
        
    except MemoryError:
        print("❌ Memory error in recommendations - forcing cleanup")
        gc.collect()
        return jsonify({
            'error': True,
            'message': 'Memory error in recommendations - try again',
            'data': []
        }), 500
    except Exception as e:
        print(f"❌ Error in recommendations endpoint: {e}")
        traceback.print_exc()
        gc.collect()
        return jsonify({
            'error': True,
            'message': f'Error fetching recommendations: {str(e)}',
            'data': []
        }), 500

# ✅ Fix: Endpoint untuk rangkuman review dengan memory management
@app.route('/getReviewsSumOfProduct', methods=['GET'])
def fetchReviewsSumOfProduct():
    try:
        productId = request.args.get('product')
        print(f"📝 Review summary endpoint called for product: {productId}")
        log_memory_usage()
        
        response = getReviewsSumByProduct(productId)
        
        # Force cleanup after AI operations
        gc.collect()
        
        print(f"✅ Review summary response ready")
        return response
        
    except MemoryError:
        print("❌ Memory error in review summary - forcing cleanup")
        gc.collect()
        return jsonify({
            'error': True,
            'message': 'Memory error in review summary - try again',
            'data': {
                'productId': str(productId) if productId else 'unknown',
                'summary': 'Memory error - coba lagi.'
            }
        }), 500
    except Exception as e:
        print(f"❌ Error in review summary endpoint: {e}")
        traceback.print_exc()
        gc.collect()
        return jsonify({
            'error': True,
            'message': f'Error generating review summary: {str(e)}',
            'data': {
                'productId': str(productId) if productId else 'unknown',
                'summary': 'Gagal membuat rangkuman review.'
            }
        }), 500

# ✅ Add health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    try:
        log_memory_usage()
        return jsonify({
            'error': False,
            'message': 'Backend is healthy',
            'data': {
                'status': 'ok',
                'memory_usage': f"{psutil.Process(os.getpid()).memory_info().rss / 1024 / 1024:.1f} MB"
            }
        })
    except Exception as e:
        return jsonify({
            'error': True,
            'message': str(e),
            'data': None
        }), 500

if __name__ == '__main__':
    print("🚀 Starting YAPin Backend Server...")
    print("📡 CORS enabled for localhost:3000 and 127.0.0.1:3000")
    print("🔗 API will be available at:")
    print("   • http://127.0.0.1:5000")
    print("   • http://localhost:5000")
    
    try:
        # Install psutil if not available
        try:
            import psutil
        except ImportError:
            print("📦 Installing psutil for memory monitoring...")
            os.system("pip install psutil")
            import psutil
        
        app.run(
            debug=False,  # ✅ Disable debug mode to prevent memory leaks
            host='0.0.0.0', 
            port=5000,
            threaded=True,
            use_reloader=False  # ✅ Prevent double imports
        )
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        traceback.print_exc()