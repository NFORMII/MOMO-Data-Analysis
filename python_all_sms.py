import xml.etree.ElementTree as ET
import re
import csv

# --- Load the XML ---
tree = ET.parse("modified_sms_v2.xml")
root = tree.getroot()
sms_list = root.findall("sms")

# --- Extract details ---
def extract_fields(body):
    tx_id_match = re.search(r"TxId[:]? ?(\d+)", body)
    if not tx_id_match:
        tx_id_match = re.search(r"Financial Transaction Id[:]? ?(\d+)", body, re.IGNORECASE)

    amount_match = re.search(r"(\d[\d,]*)\sRWF", body)
    date_match = re.search(r"(?:Date:|at)\s([\d\-]+\s[\d:]+)", body)

    tx_id = tx_id_match.group(1) if tx_id_match else "N/A"
    amount = amount_match.group(1).replace(",", "") if amount_match else "N/A"
    date = date_match.group(1) if date_match else "N/A"

    return tx_id, amount, date

def categorize_sms(body):
    if "You have received" in body:
        return "Incoming Money"
    elif "Your payment of" in body and "to" in body:
        return "Payment"
    elif "transferred to" in body and "from" in body:
        return "Transfer to Mobile"
    elif "bank deposit" in body.lower():
        return "Bank Deposit"
    elif "Cash Power" in body or "token" in body:
        return "Utility Payment"
    elif "withdrawn" in body and "via agent" in body:
        return "Withdrawal"
    else:
        return "Unknown"

# --- Save all messages to CSV ---
with open("results.csv", "w", newline='', encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["transaction_id", "amount", "date", "category", "raw_body"])
    writer.writeheader()

    for sms in sms_list:
        body = sms.attrib.get("body", "")
        tx_id, amount, date = extract_fields(body)
        category = categorize_sms(body)

        writer.writerow({
            "transaction_id": tx_id,
            "amount": amount,
            "date": date,
            "category": category,
            "raw_body": body
        })

print("✅ All SMS messages saved to results.csv")
