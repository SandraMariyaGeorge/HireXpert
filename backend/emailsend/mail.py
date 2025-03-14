

from fastapi import FastAPI, UploadFile, File, HTTPException
import csv
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
import io

app = FastAPI()

# Load environment variables from .env file
load_dotenv()

# Email configuration
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

def extract_emails_from_csv(file: UploadFile):
    """Extract email addresses from an uploaded CSV file."""
    try:
        contents = file.file.read().decode("utf-8")
        file.file.seek(0)  # Reset file pointer
        reader = csv.reader(io.StringIO(contents))
        emails = []
        
        for row in reader:
            if row:  # Ensure row is not empty
                emails.append(row[0])  # Assuming emails are in the first column
        
        return emails
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading CSV file: {e}")

def send_email(receivers):
    """Send email to multiple recipients."""
    if not receivers:
        return "No recipients found."
    
    msg = MIMEMultipart()
    msg['From'] = EMAIL_SENDER
    msg['To'] = ", ".join(receivers)
    msg['Subject'] = "Test Email from FastAPI"
    
    body = "Hello, this is a test email sent via FastAPI using an uploaded CSV file!"
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_SENDER, receivers, msg.as_string())
        server.quit()
        
        return "Emails sent successfully!"
    except Exception as e:
        return f"Error: {e}"

@app.post("/send-emails")
async def send_emails(file: UploadFile = File(...)):
    """API endpoint to receive a CSV file, extract emails, and send emails."""
    try:
        emails = extract_emails_from_csv(file)
        if not emails:
            raise HTTPException(status_code=400, detail="No email addresses found in the CSV file.")
        
        result = send_email(emails)
        return {"message": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))