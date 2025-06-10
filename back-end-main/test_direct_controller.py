import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_direct_controller():
    print("🧪 Testing controller function directly...")
    
    try:
        # Import controller function
        from controller.fetch import getAllProductsByCategory
        
        # Test with category 1
        print("📞 Calling getAllProductsByCategory(1)...")
        result = getAllProductsByCategory(1)
        
        print(f"✅ Result type: {type(result)}")
        print(f"✅ Result keys: {list(result.keys()) if isinstance(result, dict) else 'Not a dict'}")
        
        if isinstance(result, dict):
            print(f"✅ Error status: {result.get('error')}")
            print(f"✅ Message: {result.get('message')}")
            print(f"✅ Data count: {len(result.get('data', []))}")
            
            if result.get('data'):
                print(f"✅ Sample data: {result['data'][0]['name'][:50]}...")
        
        return result
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    test_direct_controller()