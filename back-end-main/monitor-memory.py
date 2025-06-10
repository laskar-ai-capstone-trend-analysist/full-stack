import psutil
import time
import requests
import sys

def monitor_backend():
    print("🔍 Monitoring Backend Memory Usage")
    print("=" * 40)
    
    # Find Python processes
    python_processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            if 'python' in proc.info['name'].lower() and 'main.py' in ' '.join(proc.info['cmdline']):
                python_processes.append(proc)
        except:
            pass
    
    if not python_processes:
        print("❌ Backend process not found!")
        return
    
    backend_process = python_processes[0]
    print(f"✅ Found backend process: PID {backend_process.pid}")
    
    while True:
        try:
            # Memory usage
            memory_mb = backend_process.memory_info().rss / 1024 / 1024
            cpu_percent = backend_process.cpu_percent()
            
            # Test API connection
            try:
                response = requests.get('http://127.0.0.1:5000/', timeout=5)
                api_status = "✅ OK" if response.status_code == 200 else f"❌ {response.status_code}"
            except:
                api_status = "❌ DOWN"
            
            print(f"📊 Memory: {memory_mb:.1f}MB | CPU: {cpu_percent:.1f}% | API: {api_status}")
            
            # Alert if memory too high
            if memory_mb > 500:
                print(f"⚠️ HIGH MEMORY WARNING: {memory_mb:.1f}MB")
            
            time.sleep(5)
            
        except psutil.NoSuchProcess:
            print("❌ Backend process died!")
            break
        except KeyboardInterrupt:
            print("\n👋 Monitoring stopped")
            break

if __name__ == "__main__":
    monitor_backend()