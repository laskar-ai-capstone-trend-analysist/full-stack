import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from controller.fetch import getAllProductsByCategory

def test_controller():
    print("🧪 Testing controller function directly...")
    
    try:
        result = getAllProductsByCategory(1)
        print(f"✅ Controller result type: {type(result)}")
        print(f"✅ Controller result: {result}")
        
        if isinstance(result, dict):
            print(f"✅ Error status: {result.get('error')}")
            print(f"✅ Message: {result.get('message')}")
            print(f"✅ Data count: {len(result.get('data', []))}")
        else:
            print(f"❌ Unexpected result type: {type(result)}")
            
    except Exception as e:
        print(f"❌ Controller Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_controller()