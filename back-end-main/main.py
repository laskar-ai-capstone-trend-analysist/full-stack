from flask import Flask, request
from controller.fetch import *

app = Flask(__name__)

@app.route('/')
def hello():
  return 'Hello world'

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

@app.route('/getRecommendProducts', methods=['GET'])
def fetchRecommendProductsByName():
  productId = request.args.get('product')
  response = recomend_products(productId)
  return response

@app.route('/getReviewsSumOfProduct', methods=['GET'])
def fetchReviewsSumOfProduct():
  productId = request.args.get('product')
  response = getReviewsSumByProduct(productId)
  return response


if __name__ == '__main__':
  app.run(debug=True)