import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from db.util import *
from flask import jsonify
from recomm_system.main import recomend

# Pastikan import statement sesuai dengan struktur folder
try:
    from review_summarization.main import lexrank_summarizer
except ImportError as e:
    print(f"Warning: Could not import lexrank_summarizer: {e}")
    def lexrank_summarizer(reviews, num_sentences=3, threshold=0.1):
        return "Summarization service not available"

try:
    import networkx as nx
except ImportError:
    print("Warning: networkx not installed. Some features may not work.")
    nx = None

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

# ✅ Updated recommendation function
def recomend_products(productId):
  try:
    print(f"Getting recommendations for product ID: {productId}")
    result = recomend(productId)
    
    # Pastikan result dalam format yang benar
    if not result or len(result) == 0:
      return jsonify({
          'error': False,
          'message': 'No recommendations found for this product',
          'data': []
      }), 200
    
    return jsonify({
        'error': False,
        'message': 'Product recommendations fetched successfully',
        'data': result
    }), 200
  except Exception as e:
    print(f'Error fetching recommendations for product {productId}:', e)
    return jsonify({
      'error': True,
      'message': f'Error fetching product recommendations: {str(e)}',
      'data': []
    }), 500

# ✅ Updated review summary function
def getReviewsSumByProduct(productId):
  try:
    print(f"Getting review summary for product ID: {productId}")
    
    # Get reviews for the product
    reviews_result = getReviewsByProduct(productId)
    
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
    reviews = [item['review'] for item in reviews_result if 'review' in item]
    
    if not reviews:
      return jsonify({
          'error': False,
          'message': 'No review content found',
          'data': {
              'productId': str(productId),
              'summary': 'Konten review tidak tersedia.'
          }
      }), 200
    
    # Generate summary
    summary = lexrank_summarizer(reviews, num_sentences=3, threshold=0.1)
    
    return jsonify({
        'error': False,
        'message': 'Review summary generated successfully',
        'data': {
            'productId': str(productId),
            'summary': summary
        }
    }), 200
    
  except Exception as e:
    print(f'Error generating review summary for product {productId}:', e)
    return jsonify({
      'error': True,
      'message': f'Error generating review summary: {str(e)}',
      'data': {
          'productId': str(productId),
          'summary': 'Gagal membuat rangkuman review.'
      }
    }), 500