import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import numpy as np
import networkx as nx
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from db.util import getReviewsByProduct

nltk.download('punkt')
nltk.download('punkt_tab')
from nltk.tokenize import sent_tokenize

def lexrank_summarizer(reviews, num_sentences=3, threshold=0.1):
    sentences = reviews
    if len(sentences) == 0:
        return "Hasil tidak ditemukan"
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(sentences)
    similarity_matrix = cosine_similarity(tfidf_matrix)
    similarity_graph = np.where(similarity_matrix > threshold, similarity_matrix, 0)
    nx_graph = nx.from_numpy_array(similarity_graph)
    scores = nx.pagerank(nx_graph)
    ranked_sentences = sorted(((scores[i], s) for i, s in enumerate(sentences)), reverse=True)
    top_sentences = sorted(ranked_sentences[:num_sentences], key=lambda x: sentences.index(x[1]))
    summary = ",".join([sentence for _, sentence in top_sentences])
    return summary

