import nltk
import ssl

# Fix SSL certificate issue
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

print("📦 Downloading NLTK data...")

# Download required NLTK data
try:
    nltk.download('stopwords')
    nltk.download('punkt')
    nltk.download('vader_lexicon')
    print("✅ NLTK data downloaded successfully!")
except Exception as e:
    print(f"❌ Error downloading NLTK data: {e}")
    
# Test import
try:
    from nltk.corpus import stopwords
    print("✅ Stopwords import test successful!")
    print(f"   Available languages: {stopwords.fileids()[:5]}...")
except Exception as e:
    print(f"❌ Stopwords import test failed: {e}")