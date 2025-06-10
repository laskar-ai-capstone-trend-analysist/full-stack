import sys
import os
import traceback
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from db.util import *
from flask import jsonify

# Enhanced imports with error handling
try:
    from recomm_system.main import recomend
    RECOMMEND_SYSTEM_AVAILABLE = True
    print("✅ Recommendation system loaded successfully")
except ImportError as e:
    print(f"⚠️ Recommendation system not available: {e}")
    RECOMMEND_SYSTEM_AVAILABLE = False

try:
    from review_summarization.main import lexrank_summarizer
    SUMMARIZATION_AVAILABLE = True
    print("✅ Review summarization loaded successfully")
except ImportError as e:
    print(f"⚠️ Review summarization not available: {e}")
    SUMMARIZATION_AVAILABLE = False
    
    # Fallback summarizer
    def lexrank_summarizer(reviews, num_sentences=3, threshold=0.1):
        if not reviews:
            return "Tidak ada review tersedia."
        
        # Simple fallback
        combined = " ".join(str(review) for review in reviews[:3] if review)
        if len(combined) > 200:
            return combined[:200] + "..."
        return combined

def getAllProducts():
    try:
        result = getAllProduct()
        return jsonify({
            'error': False,
            'message': 'Data fetched successfully',
            'data': result
        }), 200
    except Exception as e:
        print('Error fetching the data', e)
        return jsonify({
            'error': True,
            'message': 'Error fetching data',
            'data': None
        }), 500

def getAllCategories():
    try:
        result = getAllCategory()
        return jsonify({
            'error': False,
            'message': 'Categories fetched successfully',
            'data': result
        }), 200
    except Exception as e:
        print('Error fetching the data', e)
        return jsonify({
            'error': True,
            'message': 'Error fetching categories',
            'data': None
        }), 500

def getAllReviews():
    try:
        result = getAllReview()
        return jsonify({
            'error': False,
            'message': 'Reviews fetched successfully',
            'data': result
        }), 200
    except Exception as e:
        print('Error fetching the data', e)
        return jsonify({
            'error': True,
            'message': 'Error fetching reviews',
            'data': None
        }), 500

def getAllProductsByCategory(categoryId):
    try:
        result = getProductsByCategory(categoryId)
        return jsonify({
            'error': False,
            'message': 'Products by category fetched successfully',
            'data': result
        }), 200
    except Exception as e:
        print('Error fetching the data', e)
        return jsonify({
            'error': True,
            'message': 'Error fetching products by category',
            'data': None
        }), 500

def getAllReviewsByProduct(productId):
    try:
        result = getReviewsByProduct(productId)
        return jsonify({
            'error': False,
            'message': 'Reviews by product fetched successfully',
            'data': result
        }), 200
    except Exception as e:
        print('Error fetching the data', e)
        return jsonify({
            'error': True,
            'message': 'Error fetching reviews by product',
            'data': None
        }), 500

def getAllReviewsByCategory(categoryId):
    try:
        result = getReviewsByCategory(categoryId)
        return jsonify({
            'error': False,
            'message': 'Reviews by category fetched successfully',
            'data': result
        }), 200
    except Exception as e:
        print('Error fetching the data', e)
        return jsonify({
            'error': True,
            'message': 'Error fetching reviews by category',
            'data': None
        }), 500

def getSentimentPrediction(productId):
    try:
        result = getSentimentByProduct(productId)
        return jsonify({
            'error': False,
            'message': 'Sentiment analysis fetched successfully',
            'data': result
        }), 200
    except Exception as e:
        print('Error fetching the data', e)
        return jsonify({
            'error': True,
            'message': 'Error fetching sentiment analysis',
            'data': None
        }), 500

def getProductsByName(name):
    try:
        result = getAllProductsByName(name.lower())
        return jsonify({
            'error': False,
            'message': 'Products by name fetched successfully',
            'data': result
        }), 200
    except Exception as e:
        print('Error fetching the data', e)
        return jsonify({
            'error': True,
            'message': 'Error fetching products by name',
            'data': None
        }), 500

# ✅ Enhanced recommendation function with comprehensive error handling
def recomend_products(productId):
    try:
        print(f"🔍 Getting recommendations for product ID: {productId}")
        
        # Validate productId
        if not productId:
            return jsonify({
                'error': True,
                'message': 'Product ID is required',
                'data': []
            }), 400
        
        # Convert to int if it's a string
        try:
            productId = int(productId)
        except ValueError:
            return jsonify({
                'error': True,
                'message': 'Invalid product ID format',
                'data': []
            }), 400
        
        # Check if recommendation system is available
        if not RECOMMEND_SYSTEM_AVAILABLE:
            print("⚠️ Recommendation system not available, returning fallback")
            # Return some sample products as fallback
            try:
                all_products = getAllProduct()
                if all_products and len(all_products) > 0:
                    # Return first 5 products as fallback recommendations
                    fallback_recommendations = all_products[:5]
                    return jsonify({
                        'error': False,
                        'message': 'Fallback recommendations (recommendation system unavailable)',
                        'data': fallback_recommendations
                    }), 200
                else:
                    return jsonify({
                        'error': False,
                        'message': 'No products available for recommendations',
                        'data': []
                    }), 200
            except Exception as e:
                print(f"❌ Error getting fallback recommendations: {e}")
                return jsonify({
                    'error': True,
                    'message': 'Recommendation system unavailable and fallback failed',
                    'data': []
                }), 500
        
        # Call recommendation system
        try:
            result = recomend(productId)
            print(f"🔍 Recommendation system returned: {type(result)} with length {len(result) if result else 0}")
        except Exception as e:
            print(f"❌ Recommendation system error: {e}")
            traceback.print_exc()
            
            # Try fallback
            try:
                all_products = getAllProduct()
                if all_products and len(all_products) > 0:
                    fallback_recommendations = [p for p in all_products if p.get('id') != productId][:5]
                    return jsonify({
                        'error': False,
                        'message': f'Fallback recommendations (error: {str(e)})',
                        'data': fallback_recommendations
                    }), 200
                else:
                    return jsonify({
                        'error': False,
                        'message': 'No recommendations available',
                        'data': []
                    }), 200
            except Exception as fallback_error:
                print(f"❌ Fallback also failed: {fallback_error}")
                return jsonify({
                    'error': True,
                    'message': f'Recommendation failed: {str(e)}',
                    'data': []
                }), 500
        
        # Handle empty results
        if not result or len(result) == 0:
            return jsonify({
                'error': False,
                'message': 'No recommendations found for this product',
                'data': []
            }), 200
        
        # Ensure result is a list
        if not isinstance(result, list):
            print(f"⚠️ Recommendation result is not a list: {type(result)}")
            return jsonify({
                'error': False,
                'message': 'No valid recommendations found',
                'data': []
            }), 200
        
        print(f"✅ Successfully retrieved {len(result)} recommendations")
        return jsonify({
            'error': False,
            'message': 'Product recommendations fetched successfully',
            'data': result
        }), 200
        
    except Exception as e:
        print(f'❌ Error fetching recommendations for product {productId}:', str(e))
        traceback.print_exc()
        
        return jsonify({
            'error': True,
            'message': f'Error fetching product recommendations: {str(e)}',
            'data': []
        }), 500

# ✅ Enhanced review summary function with comprehensive error handling
def getReviewsSumByProduct(productId):
    try:
        print(f"🔍 Getting review summary for product ID: {productId}")
        
        # Validate productId
        if not productId:
            return jsonify({
                'error': True,
                'message': 'Product ID is required',
                'data': None
            }), 400
        
        # Convert to int if it's a string
        try:
            productId = int(productId)
        except ValueError:
            return jsonify({
                'error': True,
                'message': 'Invalid product ID format',
                'data': None
            }), 400
        
        # Get reviews for the product
        try:
            reviews_result = getReviewsByProduct(productId)
            print(f"🔍 Found {len(reviews_result) if reviews_result else 0} reviews")
        except Exception as e:
            print(f"❌ Error getting reviews: {e}")
            return jsonify({
                'error': True,
                'message': f'Error fetching reviews: {str(e)}',
                'data': {
                    'productId': str(productId),
                    'summary': 'Gagal mengambil data review.'
                }
            }), 500
        
        if not reviews_result or len(reviews_result) == 0:
            return jsonify({
                'error': False,
                'message': 'No reviews found for this product',
                'data': {
                    'productId': str(productId),
                    'summary': 'Belum ada review tersedia untuk produk ini.'
                }
            }), 200
        
        # Extract review content
        reviews = []
        for item in reviews_result:
            if isinstance(item, dict) and 'review' in item:
                review_text = str(item['review']).strip()
                if review_text and len(review_text) > 5:  # Minimum review length
                    reviews.append(review_text)
        
        print(f"🔍 Extracted {len(reviews)} valid review texts")
        
        if not reviews:
            return jsonify({
                'error': False,
                'message': 'No valid review content found',
                'data': {
                    'productId': str(productId),
                    'summary': 'Review tersedia tetapi konten tidak dapat diproses.'
                }
            }), 200
        
        # Generate summary
        try:
            if SUMMARIZATION_AVAILABLE:
                summary = lexrank_summarizer(reviews, num_sentences=3, threshold=0.1)
            else:
                # Simple fallback summarization
                combined_reviews = " ".join(reviews[:5])  # Take first 5 reviews
                if len(combined_reviews) > 200:
                    summary = combined_reviews[:200] + "..."
                else:
                    summary = combined_reviews
            
            print(f"✅ Generated summary: {summary[:100]}...")
            
        except Exception as e:
            print(f"⚠️ Error generating summary: {e}")
            traceback.print_exc()
            
            # Ultra-simple fallback
            try:
                first_few_reviews = " ".join(reviews[:3])
                if len(first_few_reviews) > 150:
                    summary = first_few_reviews[:150] + "..."
                else:
                    summary = first_few_reviews
            except:
                summary = "Produk ini memiliki beragam review dari pelanggan dengan pengalaman yang bervariasi."
        
        return jsonify({
            'error': False,
            'message': 'Review summary generated successfully',
            'data': {
                'productId': str(productId),
                'summary': summary
            }
        }), 200
        
    except Exception as e:
        print(f'❌ Error generating review summary for product {productId}:', str(e))
        traceback.print_exc()
        
        return jsonify({
            'error': True,
            'message': f'Error generating review summary: {str(e)}',
            'data': {
                'productId': str(productId) if productId else 'unknown',
                'summary': 'Gagal membuat rangkuman review karena masalah teknis.'
            }
        }), 500