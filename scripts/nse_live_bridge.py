import requests
import json
import time
from datetime import datetime

# NSE requires headers to simulate a normal browser visit
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.5",
}

# NSE URLs
BASE_URL = "https://www.nseindia.com"
MARKET_STATUS_URL = f"{BASE_URL}/api/marketStatus"
OPTION_CHAIN_URL = f"{BASE_URL}/api/option-chain-indices?symbol="

class NSEDataBridge:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(headers)
        # Hit the base page to set the cookies required for API calls
        print("Initializing session and fetching cookies...")
        self.session.get(BASE_URL, timeout=10)
        
    def fetch_market_status(self):
        try:
            response = self.session.get(MARKET_STATUS_URL, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return data
            else:
                print(f"Error fetching market status: {response.status_code}")
        except Exception as e:
            print(f"Exception fetching market status: {e}")
        return None

    def fetch_option_chain(self, symbol="NIFTY"):
        try:
            url = OPTION_CHAIN_URL + symbol
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return data
            else:
                # If cookie is stale (401), we can renew it
                if response.status_code == 401:
                    print("Cookie expired. Renewing...")
                    self.session.get(BASE_URL, timeout=10)
                    response = self.session.get(url, timeout=10)
                    if response.status_code == 200:
                        return response.json()
                print(f"Error fetching option chain for {symbol}: {response.status_code}")
        except Exception as e:
            print(f"Exception fetching option chain for {symbol}: {e}")
        return None
        
    def bridge_data_to_website(self, firebase_db_project_id=None):
        """
        In a real production environment, you would push this data to 
        your Firebase Firestore or a WebSocket server that your React frontend listens to.
        Since the applet is built on AI Studio, Firestore is recommended.
        To use Firestore in Python, install firebase-admin: `pip install firebase-admin`
        """
        nifty_data = self.fetch_option_chain("NIFTY")
        banknifty_data = self.fetch_option_chain("BANKNIFTY")
        
        updates = {}
        
        if nifty_data and "records" in nifty_data:
            spot_price = nifty_data["records"]["underlyingValue"]
            updates["NIFTY"] = spot_price
            print(f"[{datetime.now().strftime('%H:%M:%S')}] NIFTY 50: {spot_price}")
            
        if banknifty_data and "records" in banknifty_data:
            spot_price = banknifty_data["records"]["underlyingValue"]
            updates["BANKNIFTY"] = spot_price
            print(f"[{datetime.now().strftime('%H:%M:%S')}] BANKNIFTY: {spot_price}")
            
        # Example of how to send to a backend NodeJS REST API
        # if updates:
        #     try:
        #         requests.post("http://localhost:3000/api/update-live-prices", json=updates)
        #     except Exception as e:
        #         pass

def run_bridge():
    bridge = NSEDataBridge()
    
    print("Starting Live NSE Data Bridge...")
    while True:
        # Avoid hitting NSE too fast, they will block the IP.
        # Fetch every 5 seconds
        bridge.bridge_data_to_website()
        time.sleep(5)

if __name__ == "__main__":
    run_bridge()
