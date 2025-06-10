import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from db.util import getAllProduct
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import hstack
from .text_preprocessing import preprocess_text



def prepare_data():
  df = getAllProduct()
  df = pd.DataFrame.from_dict(df)
  # Set original price = current price jika tidak ada discount
  df.loc[df['discount'] == 0.0, 'originalPrice'] = df['currentPrice']

  cleaned_df = df.copy()
  cleaned_df['name'] = cleaned_df['name'].apply(preprocess_text)
  new_df = cleaned_df.drop(columns=['categoryId', 'id'], axis=1)
  new_df['name'] = new_df['name'].fillna('').str.lower()
  tfidf = TfidfVectorizer()

  name_features = tfidf.fit_transform(new_df['name'])

  numerical_features = new_df[['currentPrice', 'originalPrice', 'discount', 'stock']].fillna(0)
  scaler = MinMaxScaler()
  scaled_numerical = scaler.fit_transform(numerical_features)
  combined_features = hstack([name_features, scaled_numerical])
  return combined_features, cleaned_df

def getScoreById(scores, ind):
  for (ind, score) in scores:
    if ind == int(ind):
      return score
  return 0

def recomend(productId):
  features, knowledge_df = prepare_data()
  cos_sim = cosine_similarity(features)
  print(cos_sim)
  product_index = knowledge_df[knowledge_df['id'] == int(productId)].index[0]
  similarities = list(enumerate(cos_sim[product_index]))
  similar_products = sorted(similarities, key=lambda x: x[1], reverse=True)
  # top 5 similar products
  similar_products = similar_products[:6]
  indices = [ind for (ind, _) in similar_products]
  filtered_df = knowledge_df[knowledge_df['id'].isin(indices)]
  filtered_df.loc[:, 'similarity_score'] = filtered_df['id'].apply(
    lambda x: next((score for (i, score) in similar_products if i == (x - 1)), 0)
  )
  filtered_df = filtered_df.sort_values(by='similarity_score', ascending=False)
  return filtered_df.to_dict(orient='records')
