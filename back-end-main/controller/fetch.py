import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from db.util import *
from flask import jsonify
from recomm_system.main import recomend
from review_summarization.main import lexrank_summarizer

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
  
def getAllReviews():
  try:
    result = getAllReview()
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

def getAllProductsByCategory(categoryId):
  try:
    result = getProductsByCategory(categoryId)
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

def getAllReviewsByProduct(productId):
  try:
    result = getReviewsByProduct(productId)
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
  
def getAllReviewsByCategory(categoryId):
  try:
    result = getReviewsByCategory(categoryId)
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
  
def getSentimentPrediction(productId):
  try:
    result = getSentimentByProduct(productId)
    return jsonify({
        'error': False,
        'message': 'Prediction succeeded',
        'data': result
    }), 200
  except Exception as e:
    print('Error fetching the data', e)
    return jsonify({
      'error': True,
      'message': 'Prediction failed',
      'data': None
    }), 500

def getProductsByName(name):
  try:
    result = getAllProductsByName(name.lower())
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

def recomend_products(productId):
  try:
    result = recomend(productId)
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

def getReviewsSumByProduct(productId):
  try:
    result = getReviewsByProduct(productId)
    reviews = [item['review'] for item in result]
    summary = lexrank_summarizer(reviews)
    return jsonify({
        'error': False,
        'message': 'Summarization succeed',
        'data': {
          'productId': productId,
          'summary': summary
        }
    }), 200
  except Exception as e:
    print('Error fetching the data', e)
    return jsonify({
      'error': True,
      'message': 'Summarization failed',
      'data': None
    }), 500