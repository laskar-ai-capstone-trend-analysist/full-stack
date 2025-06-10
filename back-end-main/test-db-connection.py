import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_database():
    print("🔍 Testing Database Connection\n")
    
    try:
        from db.util import getAllProduct
        print("✅ Database module imported successfully")
        
        products = getAllProduct()
        print(f"✅ Database connection successful")
        print(f"   Products found: {len(products) if products else 0}")
        
        if products and len(products) > 0:
            print(f"   Sample product: {products[0]}")
        
    except ImportError as e:
        print(f"❌ Database module import failed: {e}")
        print("💡 Check if db/util.py exists and is properly configured")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("💡 Check if XAMPP MySQL is running")
        print("💡 Check database credentials in db/util.py")

if __name__ == "__main__":
    test_database()