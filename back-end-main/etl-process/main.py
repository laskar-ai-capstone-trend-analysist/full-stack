import sys
import os
import pandas as pd
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from db.setup import *
from db.util import getAllProduct, getReviewsByProduct, getAllReview
from ai_model.predict import predict_batch_sentiment
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()

# MYSQL connection URL
DATABASE_URL = f'mysql+pymysql://{os.getenv("DB_USERNAME")}:{os.getenv("DB_PASSWORD")}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}'

all_products = getAllProduct()
all_products = pd.DataFrame.from_dict(all_products)
all_products = all_products[['id']]

all_reviews = getAllReview()
all_reviews = pd.DataFrame.from_dict(all_reviews)
corpus = all_reviews[['review']]

prediction_reports = []

for productId in all_products['id']:
    reviews = getReviewsByProduct(productId)
    if len(reviews) != 0:
        reviews = pd.DataFrame.from_dict(reviews)
        reviews = reviews['review']
        prediction_report = predict_batch_sentiment(corpus, reviews)
        prediction_report['productId'] = productId
        prediction_reports.append(prediction_report)
    

engine = create_engine(DATABASE_URL)
prediction_reports = pd.DataFrame.from_dict(prediction_reports)
prediction_reports = prediction_reports.drop('Unnamed: 0', axis=1)
prediction_reports.rename(
  columns={
    'positive': 'sentiment_positive',
    'negative': 'sentiment_negative',
    'neutral': 'sentiment_neutral'
  },
  inplace=True
)
prediction_reports.to_sql('prediction', engine, if_exists='append', index=False)






