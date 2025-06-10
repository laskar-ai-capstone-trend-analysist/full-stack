import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db.util import *

def test_functions():
    print("🧪 Testing database functions directly...")
    
    # Test getProductsByCategory
    print("\n1️⃣ Testing getProductsByCategory(1)...")
    try:
        products = getProductsByCategory(1)
        print(f"✅ Success: Found {len(products)} products")
        if products:
            print(f"Sample product: {products[0]['name']}")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    # Test getReviewsByProduct
    print("\n2️⃣ Testing getReviewsByProduct(1)...")
    try:
        reviews = getReviewsByProduct(1)
        print(f"✅ Success: Found {len(reviews)} reviews")
        if reviews:
            print(f"Sample review: {reviews[0]['review'][:50]}...")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    # Test controller functions (now returns dict instead of jsonify)
    print("\n3️⃣ Testing controller functions...")
    try:
        from controller.fetch import getAllProductsByCategory
        response_dict = getAllProductsByCategory(1)
        print(f"✅ Controller response: {response_dict}")
        print(f"Error status: {response_dict.get('error')}")
        print(f"Data count: {len(response_dict.get('data', []))}")
    except Exception as e:
        print(f"❌ Controller Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_functions()