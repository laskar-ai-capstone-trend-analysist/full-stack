import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import networkx as nx

# Safe NLTK import with fallback
try:
    import nltk
    from nltk.corpus import stopwords
    from nltk.tokenize import sent_tokenize, word_tokenize
    
    # Download required data if not present
    try:
        nltk.data.find('corpora/stopwords')
    except LookupError:
        print("Downloading NLTK stopwords...")
        nltk.download('stopwords', quiet=True)
    
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        print("Downloading NLTK punkt...")
        nltk.download('punkt', quiet=True)
    
    # Get Indonesian stopwords with fallback
    try:
        INDONESIAN_STOPWORDS = set(stopwords.words('indonesian'))
    except:
        INDONESIAN_STOPWORDS = set(stopwords.words('english'))  # fallback
        
    NLTK_AVAILABLE = True
    print("✅ NLTK loaded successfully with stopwords")
    
except ImportError as e:
    print(f"⚠️ NLTK not available: {e}")
    NLTK_AVAILABLE = False
    # Fallback stopwords for Indonesian
    INDONESIAN_STOPWORDS = {
        'yang', 'dan', 'di', 'dengan', 'untuk', 'ke', 'dari', 'pada', 'dalam', 
        'adalah', 'ini', 'itu', 'atau', 'juga', 'akan', 'telah', 'sudah', 
        'bisa', 'dapat', 'tidak', 'ada', 'seperti', 'saya', 'kita', 'mereka',
        'bagus', 'barang', 'produk', 'seller', 'toko', 'kirim', 'paket',
        'sesuai', 'terima', 'kasih', 'cepat', 'aman', 'mantap', 'oke'
    }

def preprocess_text(text):
    """Preprocess text for better summarization"""
    if not text or not isinstance(text, str):
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters but keep Indonesian characters
    text = re.sub(r'[^\w\s]', ' ', text)
    
    # Remove extra whitespace
    text = ' '.join(text.split())
    
    return text

def simple_sentence_tokenize(text):
    """Simple sentence tokenization fallback"""
    if not text:
        return []
    
    # Split by common sentence endings
    sentences = re.split(r'[.!?]+', text)
    
    # Clean and filter sentences
    cleaned_sentences = []
    for sentence in sentences:
        sentence = sentence.strip()
        if len(sentence) > 10:  # Minimum sentence length
            cleaned_sentences.append(sentence)
    
    return cleaned_sentences

def simple_word_tokenize(text):
    """Simple word tokenization fallback"""
    if not text:
        return []
    
    # Simple word splitting
    words = re.findall(r'\b\w+\b', text.lower())
    return words

def remove_stopwords(words):
    """Remove stopwords from word list"""
    if not words:
        return []
    
    filtered_words = [word for word in words if word not in INDONESIAN_STOPWORDS and len(word) > 2]
    return filtered_words

def lexrank_summarizer(reviews, num_sentences=3, threshold=0.1):
    """
    Enhanced LexRank algorithm for review summarization
    with better error handling and fallbacks
    """
    try:
        print(f"🔍 Starting summarization with {len(reviews)} reviews")
        
        if not reviews or len(reviews) == 0:
            return "Tidak ada review yang tersedia untuk dirangkum."
        
        # Combine all reviews into one text
        combined_text = " ".join(str(review) for review in reviews if review)
        
        if not combined_text.strip():
            return "Review tidak mengandung teks yang dapat dirangkum."
        
        print(f"📝 Combined text length: {len(combined_text)} characters")
        
        # Preprocess the combined text
        processed_text = preprocess_text(combined_text)
        
        if len(processed_text) < 50:
            return "Review terlalu pendek untuk dirangkum."
        
        # Tokenize into sentences
        if NLTK_AVAILABLE:
            try:
                sentences = sent_tokenize(processed_text)
            except:
                sentences = simple_sentence_tokenize(processed_text)
        else:
            sentences = simple_sentence_tokenize(processed_text)
        
        print(f"📄 Found {len(sentences)} sentences")
        
        if len(sentences) < 2:
            return processed_text[:200] + "..." if len(processed_text) > 200 else processed_text
        
        # Limit number of sentences for performance
        if len(sentences) > 50:
            sentences = sentences[:50]
        
        # Create TF-IDF matrix
        try:
            # Enhanced TF-IDF with better parameters for Indonesian text
            vectorizer = TfidfVectorizer(
                lowercase=True,
                stop_words=list(INDONESIAN_STOPWORDS),
                max_features=1000,
                ngram_range=(1, 2),
                min_df=1,
                max_df=0.85
            )
            
            tfidf_matrix = vectorizer.fit_transform(sentences)
            print(f"📊 TF-IDF matrix shape: {tfidf_matrix.shape}")
            
        except Exception as e:
            print(f"⚠️ TF-IDF failed: {e}, using simpler approach")
            # Fallback to simple word counting
            return simple_extractive_summary(sentences, num_sentences)
        
        # Calculate cosine similarity
        try:
            similarity_matrix = cosine_similarity(tfidf_matrix)
            print(f"🔗 Similarity matrix shape: {similarity_matrix.shape}")
        except Exception as e:
            print(f"⚠️ Similarity calculation failed: {e}")
            return simple_extractive_summary(sentences, num_sentences)
        
        # Apply threshold to create adjacency matrix
        adjacency_matrix = similarity_matrix > threshold
        
        # Create graph using NetworkX
        try:
            graph = nx.from_numpy_array(adjacency_matrix)
            
            # Calculate PageRank scores (LexRank)
            scores = nx.pagerank(graph, max_iter=100, tol=1e-4)
            print(f"📈 PageRank scores calculated: {len(scores)} sentences")
            
        except Exception as e:
            print(f"⚠️ NetworkX PageRank failed: {e}")
            return simple_extractive_summary(sentences, num_sentences)
        
        # Sort sentences by score and select top sentences
        try:
            sorted_sentences = sorted(scores.items(), key=lambda x: x[1], reverse=True)
            
            # Select top sentences (limit to available sentences)
            num_sentences = min(num_sentences, len(sentences), 5)
            top_sentence_indices = [idx for idx, score in sorted_sentences[:num_sentences]]
            
            # Sort indices to maintain original order
            top_sentence_indices.sort()
            
            # Create summary
            summary_sentences = [sentences[idx] for idx in top_sentence_indices]
            summary = ". ".join(summary_sentences)
            
            # Clean up summary
            summary = summary.strip()
            if not summary.endswith('.'):
                summary += '.'
                
            print(f"✅ Summary generated: {len(summary)} characters")
            
            return summary
            
        except Exception as e:
            print(f"⚠️ Summary generation failed: {e}")
            return simple_extractive_summary(sentences, num_sentences)
            
    except Exception as e:
        print(f"❌ LexRank summarization failed: {e}")
        # Return a simple fallback summary
        return simple_fallback_summary(reviews)

def simple_extractive_summary(sentences, num_sentences=3):
    """Simple extractive summarization fallback"""
    try:
        if not sentences:
            return "Tidak ada kalimat yang dapat dirangkum."
        
        # Score sentences by length and word diversity
        sentence_scores = []
        
        for i, sentence in enumerate(sentences):
            words = simple_word_tokenize(sentence)
            filtered_words = remove_stopwords(words)
            
            # Simple scoring: length + unique words
            score = len(filtered_words) + len(set(filtered_words))
            sentence_scores.append((i, score, sentence))
        
        # Sort by score and take top sentences
        sentence_scores.sort(key=lambda x: x[1], reverse=True)
        
        num_sentences = min(num_sentences, len(sentences))
        top_sentences = sentence_scores[:num_sentences]
        
        # Sort by original order
        top_sentences.sort(key=lambda x: x[0])
        
        summary = ". ".join([sent[2] for sent in top_sentences])
        return summary.strip() + "."
        
    except Exception as e:
        print(f"❌ Simple extractive summary failed: {e}")
        return "Gagal membuat rangkuman review."

def simple_fallback_summary(reviews):
    """Ultimate fallback for summarization"""
    try:
        if not reviews:
            return "Tidak ada review tersedia."
        
        # Take first few meaningful words from reviews
        combined = " ".join(str(review) for review in reviews[:5] if review)
        processed = preprocess_text(combined)
        
        if len(processed) > 200:
            return processed[:200] + "... "
        else:
            return processed + " "
            
    except:
        return "Review produk ini mencakup berbagai pengalaman pengguna dengan kualitas dan pelayanan yang bervariasi."

# Test function
if __name__ == "__main__":
    # Test the summarizer
    test_reviews = [
        "Produk bagus sesuai deskripsi",
        "Kirim cepat, packing aman",
        "Kualitas barang memuaskan, seller responsif",
        "Barang sesuai foto, terima kasih"
    ]
    
    result = lexrank_summarizer(test_reviews, num_sentences=2)
    print("Test result:", result)

