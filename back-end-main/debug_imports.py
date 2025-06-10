import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    print("🧪 Testing imports...")
    
    try:
        print("1️⃣ Testing db.util import...")
        from db.util import getProductsByCategory
        print("✅ db.util imported successfully")
        
        print("\n2️⃣ Testing controller.fetch import...")
        from controller.fetch import getAllProductsByCategory
        print("✅ controller.fetch imported successfully")
        
        print("\n3️⃣ Testing controller function...")
        result = getAllProductsByCategory(1)
        print(f"✅ Controller function works: {type(result)}")
        
        print("\n4️⃣ Testing Flask imports...")
        from flask import Flask, jsonify
        print("✅ Flask imported successfully")
        
    except Exception as e:
        print(f"❌ Import Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_imports()