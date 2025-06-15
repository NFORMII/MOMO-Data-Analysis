from http.server import HTTPServer, BaseHTTPRequestHandler
import sqlite3
import json

class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/transactions":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Origin", "*")  # So browser can fetch
            self.end_headers()

            conn = sqlite3.connect("sms_data.db")
            cursor = conn.cursor()
            cursor.execute("SELECT transaction_id, amount, date, category FROM transactions")
            rows = cursor.fetchall()
            conn.close()

            result = []
            for row in rows:
                result.append({
                    "transaction_id": row[0],
                    "amount": row[1],
                    "date": row[2],
                    "category": row[3]
                })

            self.wfile.write(json.dumps(result).encode())

# Start the server
httpd = HTTPServer(("localhost", 8000), MyServer)
print("✅ Server running at http://localhost:5000")
httpd.serve_forever()
