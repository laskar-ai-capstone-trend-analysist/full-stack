from .setup import *

def getAllProduct():
  try:
    dbCursor.execute('SELECT * FROM product')
    result = dbCursor.fetchall()
    column_names = dbCursor.column_names
    result = [dict(zip(column_names, row)) for row in result]
    return result
  except Exception as e:
    print('Error fetching the data', e)
    return None

def getAllCategory():
  try:
    dbCursor.execute('SELECT * FROM category')
    result = dbCursor.fetchall()
    column_names = dbCursor.column_names
    result = [dict(zip(column_names, row)) for row in result]
    return result
  except Exception as e:
    print('Error fetching the data', e)
    return None

def getAllReview():
  try:
    dbCursor.execute('SELECT * FROM review')
    result = dbCursor.fetchall()
    column_names = dbCursor.column_names
    result = [dict(zip(column_names, row)) for row in result]
    return result
  except Exception as e:
    print('Error fetching the data', e)
    return None

def getProductsByCategory(categoryId):
  try:
    dbCursor.execute(f'SELECT * FROM product WHERE categoryId = {categoryId}')
    result = dbCursor.fetchall()
    column_names = dbCursor.column_names
    result = [dict(zip(column_names, row)) for row in result]
    return result
  except Exception as e:
    print('Error fetching the data', e)
    return None

def getReviewsByProduct(productId):
  try:
    dbCursor.execute(f'SELECT * FROM review WHERE productId = {productId}')
    result = dbCursor.fetchall()
    column_names = dbCursor.column_names
    result = [dict(zip(column_names, row)) for row in result]
    return result
  except Exception as e:
    print('Error fetching the data', e)
    return None

def getReviewsByCategory(categoryId):
  try:
    dbCursor.execute(f'SELECT rv.* FROM category ct JOIN product pr ON ct.id = pr.categoryId JOIN review rv ON rv.productId = pr.id WHERE ct.id = {categoryId}')
    result = dbCursor.fetchall()
    column_names = dbCursor.column_names
    result = [dict(zip(column_names, row)) for row in result]
    return result
  except Exception as e:
    print('Error fetching the data', e)
    return None
  

def getSentimentByProduct(productId):
  try:
    dbCursor.execute(f'SELECT productId, sentiment_positive, sentiment_negative, sentiment_neutral FROM prediction WHERE productId = {productId}')
    result = dbCursor.fetchall()
    column_names = dbCursor.column_names
    result = [dict(zip(column_names, row)) for row in result]
    return result
  except Exception as e:
    print('Error fetching the data', e)
    return None

def getAllProductsByName(name):
  try:
    dbCursor.execute(f'SELECT * FROM product WHERE LOWER(name) LIKE \'%{name}%\'')
    result = dbCursor.fetchall()
    column_names = dbCursor.column_names
    result = [dict(zip(column_names, row)) for row in result]
    return result
  except Exception as e:
    print('Error fetching the data', e)
    return None