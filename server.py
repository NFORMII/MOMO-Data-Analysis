# from http.server import HTTPServer, BaseHTTPRequestHandler
# import sqlite3
# import json

# class MyServer(BaseHTTPRequestHandler):
#     def do_GET(self):
#         if self.path == "/transactions":
#             self.send_response(200)
#             self.send_header("Content-type", "application/json")
#             self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
#             self.send_header("Access-Control-Allow-Origin", "*")  # So browser can fetch
#             self.end_headers()

#             conn = sqlite3.connect("sms_data.db")
#             cursor = conn.cursor()
#             cursor.execute("SELECT transaction_id, amount, date, category FROM transactions")
#             rows = cursor.fetchall()
#             conn.close()

#             result = []
#             for row in rows:
#                 result.append({
#                     "transaction_id": row[0],
#                     "amount": row[1],
#                     "date": row[2],
#                     "category": row[3]
#                 })

#             self.wfile.write(json.dumps(result).encode())

# # Start the server
# httpd = HTTPServer(("localhost", 8000), MyServer)
# print("✅ Server running at http://localhost:5000")
# httpd.serve_forever()

import json
import sqlite3
from http.server import SimpleHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse
# from helpers import analyze_incoming_money_transactions, analyze__airtime_transactions

DB_PATH = 'sms_data.db'

def fetch_all(table_name):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.execute(f"SELECT * FROM {table_name}")
    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return results


class MomoHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        if path == "/get-airtime-payments":
            data = fetch_all("airtime_payments")
            self.respond_json(data)

        elif path == "/get-airtime-payments/stats":
            data = fetch_all("airtime_payments")
            stats = analyze__airtime_transactions(data)
            self.respond_json(stats)

        elif path == "/get-incoming-money":
            data = fetch_all("incoming_money")
            self.respond_json(data)

        elif path == "/get-incoming-money/stats":
            data = fetch_all("incoming_money")
            stats = analyze_incoming_money_transactions(data)
            self.respond_json(stats)

        elif path == "/get-bank-transfers":
            data = fetch_all("bank_transfers")
            self.respond_json(data)

        elif path == "/get-cash-power-bill-payments":
            data = fetch_all("cash_power_bill_payments")
            self.respond_json(data)

        elif path == "/get-transfers-to-mobile_numbers":
            data = fetch_all("transfers_to_mobile_numbers")
            self.respond_json(data)

        elif path == "/get-txns-from-third-parties":
            data = fetch_all("transactions_initiated_by_third_parties")
            self.respond_json(data)

        elif path == "/get-withdrawals-from-agents":
            data = fetch_all("withdrawals_from_agents")
            self.respond_json(data)

        else:
            # Serve HTML frontend normally
            super().do_GET()

            from urllib.parse import parse_qs

    def do_POST(self):
        try:
            if self.path == "/signup":
                content_length = int(self.headers['Content-Length'])
                body = self.rfile.read(content_length).decode()
                post_data = parse_qs(body)

                fullname = post_data.get("fullname", [""])[0]
                email = post_data.get("email", [""])[0]
                password = post_data.get("password", [""])[0]

                # 🔐 Save to DB (just store for now; you can hash password later)
                conn = sqlite3.connect(DB_PATH)
                cursor = conn.cursor()

                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        fullname TEXT,
                        email TEXT,
                        password TEXT
                    )
                """)
                cursor.execute("INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)",
                        (fullname, email, password))
                conn.commit()
                conn.close()

                # ✅ Redirect to dashboard
                self.send_response(303)  # 303 = redirect after POST
                self.send_header("Location", "/dashboard.html")
                self.end_headers()
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b"Not Found")

        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(f"Error: {str(e)}".encode())

    def respond_json(self, data):
        response = json.dumps(data).encode()
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header("Access-Control-Allow-Origin", "*")  # Allow frontend fetch
        self.end_headers()
        self.wfile.write(response)


if __name__ == "__main__":
    print("Starting server at http://localhost:5000")
    server = HTTPServer(("localhost", 5000), MomoHandler)
    server.serve_forever()
