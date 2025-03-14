

# from fastapi import FastAPI, UploadFile, File, HTTPException
# import csv
# import smtplib
# from email.mime.multipart import MIMEMultipart
# from email.mime.text import MIMEText
# from dotenv import load_dotenv
# import os
# import io

# app = FastAPI()

# # Load environment variables from .env file
# load_dotenv()

# # Email configuration
# SMTP_SERVER = os.getenv("SMTP_SERVER")
# SMTP_PORT = int(os.getenv("SMTP_PORT"))
# EMAIL_SENDER = os.getenv("EMAIL_SENDER")
# EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

# def extract_emails_from_csv(file: UploadFile):
#     """Extract email addresses from an uploaded CSV file."""
#     try:
#         contents = file.file.read().decode("utf-8")
#         file.file.seek(0)  # Reset file pointer
#         reader = csv.reader(io.StringIO(contents))
#         emails = []
        
#         for row in reader:
#             if row:  # Ensure row is not empty
#                 emails.append(row[0])  # Assuming emails are in the first column
        
#         return emails
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Error reading CSV file: {e}")

# def send_email(receivers):
#     """Send email to multiple recipients."""
#     if not receivers:
#         return "No recipients found."
    
#     msg = MIMEMultipart()
#     msg['From'] = EMAIL_SENDER
#     msg['To'] = ", ".join(receivers)
#     msg['Subject'] = "Test Email from FastAPI"
    
#     body = "Hello, this is a test email sent via FastAPI using an uploaded CSV file!"
#     msg.attach(MIMEText(body, 'plain'))
    
#     try:
#         server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
#         server.starttls()
#         server.login(EMAIL_SENDER, EMAIL_PASSWORD)
#         server.sendmail(EMAIL_SENDER, receivers, msg.as_string())
#         server.quit()
        
#         return "Emails sent successfully!"
#     except Exception as e:
#         return f"Error: {e}"

# @app.post("/send-emails")
# async def send_emails(file: UploadFile = File(...)):
#     """API endpoint to receive a CSV file, extract emails, and send emails."""
#     try:
#         emails = extract_emails_from_csv(file)
#         if not emails:
#             raise HTTPException(status_code=400, detail="No email addresses found in the CSV file.")
        
#         result = send_email(emails)
#         return {"message": result}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))



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
    
    body="""
<!DOCTYPE html>
<html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interview Invitation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .header img {
            max-width: 150px;
            height: auto;
        }
        .content {
            padding: 20px 0;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #777;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: #007BFF;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header with Company Logo -->
        <div class="header">
            <img src="https://images.unsplash.com/photo-1529612700005-e35377bf1415?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29tcGFueSUyMGxvZ298ZW58MHx8MHx8fDA%3D" alt="Company Logo">
            <h2>Interview Invitation</h2>
        </div>

        <!-- Email Content -->
        <div class="content">
            <p><strong>Dear Candidate,</strong></p>
            <p>We are pleased to inform you that you have been shortlisted for the position of <strong>Full Stack Developer</strong> at <strong>Google</strong>. After reviewing your application, we are excited to learn more about your qualifications and experience.</p>

            <h3>Interview Details:</h3>
            <ul>
                <li><strong>Date:</strong> 16/03/2025</li>
                <li><strong>Time:</strong> 10 a.m</li>
                <li><strong>Platform:</strong> [Insert Platform Name, e.g., Zoom, Microsoft Teams]</li>
                <li><strong>Meeting Link:</strong> <a href="https://meet.google.com/wqe-rjeg-xdr">Click here to join</a></li>
                <li><strong>Interviewer(s):</strong> [Insert Name(s) and Title(s)]</li>
            </ul>

            <h3>What to Expect:</h3>
            <p>The interview will be conducted online and will last approximately 15 min. It will include a discussion of your background, skills, and how they align with the role. We may also explore your problem-solving abilities and cultural fit within our organization.</p>

            <h3>Preparation Tips:</h3>
            <ul>
                <li>Ensure you have a stable internet connection and a quiet environment.</li>
                <li>Test your camera and microphone beforehand.</li>
                <li>Have a copy of your resume and any relevant documents ready.</li>
            </ul>

            <h3>Next Steps:</h3>
            <p>Kindly confirm your availability for the scheduled interview by replying to this email. If the proposed time is inconvenient, please let us know, and we will do our best to accommodate your schedule.</p>

            <p>We look forward to speaking with you and learning more about how you can contribute to the success of <strong>[Company Name]</strong>.</p>

            <a href="https://github.com/vishnuhari17/HireXpert" class="button">Confirm Attendance</a>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Best regards,</p>
            <p><strong>Google</strong><br>
            Human Resources Department<br>
            Google<br>
            [Contact Information]</p>
            <p><img src="https://media.istockphoto.com/id/1963649343/photo/handwritten-type-lettering-of-thank-you.webp?a=1&b=1&s=612x612&w=0&k=20&c=t25IJpg75PjwWInH61AqjnGIGoKZGyevTy0xOFijSMk=" alt="Team Photo" style="border-radius: 50%;"></p>
        </div>
    </div>
</body>
</html>
"""
    msg.attach(MIMEText(body, 'html'))
    
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