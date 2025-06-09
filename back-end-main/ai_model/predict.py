import os
import pandas as pd
from tensorflow.keras.models import load_model
from .util import data_prep, preprocess_text
from tensorflow.keras.preprocessing.sequence import pad_sequences
from .custom_layers import TransformerBlock, TokenAndPositionEmbedding
import numpy as np
import nltk



# Load pre-trained model
abs_path = os.path.abspath(os.path.join(os.path.dirname(__file__)))
model_path = os.path.join(abs_path, 'sentiment_model.keras')
nltk.download('stopwords')
# Load pre-trained model
model = load_model(model_path)




def predict_sentiment(corpus, text):
  # Praproses teks masukan
  preprocessed_text = preprocess_text(text)

  # config
  max_length = 100
  vocab_size = 6000

  # Inisialisasi tokenizer dan padding
  _, tokenizer = data_prep(corpus, vocab_size, max_length)

  # Membentuk text menjadi sequences
  test_seq = tokenizer.texts_to_sequences([preprocessed_text])
  # Menerapkan padding untuk meneyeragamkan dimensi input
  test_pad = pad_sequences(test_seq, max_length, padding='post')

  # Prediksi sentiment
  prediction = model.predict(test_pad)
  predicted_index = np.argmax(prediction, axis=1)[0]
  # Label dari sentimen
  mapped_class = ['negative', 'neutral', 'positive']
  # Memperoleh label sentimen
  predicted_class = mapped_class[predicted_index]

  return predicted_class

def predict_batch_sentiment(corpus, texts):
  sentiment = {
    'negative': 0,
    'neutral': 0,
    'positive': 0
  }
  for text in texts:
    predicted_label = predict_sentiment(corpus, text)
    sentiment[predicted_label] += 1
  return sentiment

predict_sentiment('bagus', 'recommended muas bagus kokoh')
