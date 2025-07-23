

# Hirexpert  
AI-Powered Intelligent Hiring Platform

---

**Hirexpert** is a powerful, AI-enhanced recruiting platform built to simplify hiring for companies.  
It automates resume parsing, skill matching, and generates customized interview questions using AI models.

This project showcases practical implementation of **Next.js**, **Python FastAPI**, **MongoDB**, and **OpenAI's GPT APIs**, serving as a full-stack real-world application for intelligent hiring.

---

# 📂 Navigation

| Level | Concept                  |
|:-----:|---------------------------|
| 1     | Frontend (Next.js)     |
| 2     | Backend (Python FastAPI)   |
| 3     | Database (MongoDB Setup)   |
| 4     | AI Integration (OpenAI API)|

### Folder Structure:
- `/frontend/` → Next.js frontend app
- `/backend/` → Python FastAPI server
- `.env` files → OpenAI API Key, MongoDB URI configurations
- `/models/` → Backend models for candidate and job data
- `/routes/` → API endpoints for candidate upload, parsing, matching

---
![Dashboard](https://github.com/vishnuhari17/HireXpert/blob/main/frontend/public/dashboard.png?raw=true)
![Interview Simulation](https://github.com/vishnuhari17/HireXpert/blob/main/frontend/public/interview%20(2).png?raw=true)



# ⚙️ Prerequisites

Before running Hirexpert, ensure you have the following installed:

- **Node.js** (v18+ recommended)
- **Python** (v3.8+)
- **MongoDB** (local or Atlas cloud database)
- **OpenAI Account** (for API key)

Also recommended:
- Postman or any API testing tool (for backend testing)

---

# 📥 Installation and Running the Project

## 1️⃣ Clone the Repository

```bash
https://github.com/vishnuhari17/HireXpert.git
cd hirexpert
```

---

## 2️⃣ Setting Up the Backend (Python FastAPI)

1. Navigate to the backend folder:

```bash
cd backend
```

2. Create a virtual environment (optional but recommended):

```bash
python -m venv env
source env/bin/activate     # Linux/Mac
env\Scripts\activate        # Windows
```

3. Install required Python packages:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file inside the backend directory:

```bash
MONGO_URI=your_mongo_db_uri
OPENAI_API_KEY=your_openai_api_key
```

5. Run the backend server:

```bash
uvicorn main:app --reload
```

- The backend will be available at `http://localhost:8000`

---

## 3️⃣ Setting Up the Frontend (Next.js)

1. Open a new terminal and navigate to the frontend:

```bash
cd frontend
```

2. Install frontend dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

4. Run the frontend server:

```bash
npm run dev
```

- The frontend will be available at `http://localhost:3000`

---

# 🧠 How Hirexpert Works 

- 📝 User uploads a candidate's resume (PDF/Docx).
- 🔍 Backend parses the resume using Python and extracts skills, experience, and education.
- 🧠 Backend sends extracted details to OpenAI API to generate personalized interview questions.
- 🎯 Frontend displays matching job roles and custom interview questions.
- 📈 Admin dashboard shows candidates and hiring insights.
