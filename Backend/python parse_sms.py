import csv
import xml.etree.ElementTree as ET
import re


# Load and parse the XML file
tree = ET.parse("modified_sms_v2.xml")
root = tree.getroot()

# Get all SMS elements
sms_list = root.findall("sms")

# Define a function to extract data using regex
def extract_fields(body):
    # Match both "TxId: ..." and "Financial Transaction Id: ..."
    tx_id_match = re.search(r"TxId[:]? ?(\d+)", body)
    if not tx_id_match:
        tx_id_match = re.search(r"Financial Transaction Id[:]? ?(\d+)", body, re.IGNORECASE)

    amount_match = re.search(r"([0-9,]+) RWF", body)
    date_match = re.search(r"at (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})", body)

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


# Print extracted info for the first 5 messages
for i in range(5):
    body = sms_list[i].attrib.get("body", "")
    tx_id, amount, date = extract_fields(body)
    category = categorize_sms(body)

    print(f"\nSMS {i+1}")
    print("Raw Body:", body)
    print("Tx ID:", tx_id)
    print("Amount:", amount)
    print("Date:", date)
    print("Category:", category)

    processed_sms = []

# Loop through all messages (not just the first 5)
for sms in sms_list:
    body = sms.attrib.get("body", "")
    tx_id, amount, date = extract_fields(body)
    category = categorize_sms(body)

    processed_sms.append({
        "transaction_id": tx_id,
        "amount": amount,
        "date": date,
        "category": category,
        "raw_body": body
    })

# Write the data to cleaned_sms.csv
with open("cleaned_sms.csv", "w", newline='', encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["transaction_id", "amount", "date", "category", "raw_body"])
    writer.writeheader()
    writer.writerows(processed_sms)

print(f"\n✅ Finished! {len(processed_sms)} messages written to cleaned_sms.csv")