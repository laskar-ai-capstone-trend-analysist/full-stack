import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_flask_context():
    print("🧪 Testing Flask app context...")
    
    try:
        # Import Flask app
        from main import app
        
        # Test dalam Flask context
        with app.test_client() as client:
            print("📞 Making test request to /getAllProductByCategory?category=1")
            
            response = client.get('/getAllProductByCategory?category=1')
            
            print(f"✅ Response status: {response.status_code}")
            print(f"✅ Response headers: {dict(response.headers)}")
            
            try:
                json_data = response.get_json()
                print(f"✅ Response JSON: {json_data}")
                
                if json_data:
                    print(f"✅ Error status: {json_data.get('error')}")
                    print(f"✅ Message: {json_data.get('message')}")
                    print(f"✅ Data count: {len(json_data.get('data', []))}")
                    
            except Exception as json_error:
                print(f"❌ JSON parsing error: {json_error}")
                print(f"Raw response: {response.get_data(as_text=True)}")
        
    except Exception as e:
        print(f"❌ Flask context test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_flask_context()