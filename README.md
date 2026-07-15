# HireHelp 🚀

> **Your hiring, handled.**

HireHelp is an AI-powered recruitment platform that streamlines the complete hiring lifecycle—from job requisition and resume screening to interview scheduling, candidate evaluation, offers, and talent rediscovery.

The platform combines AI-assisted decision-making with modern web technologies to help recruiters hire faster while maintaining complete control over the recruitment process.

---

## ✨ Features

### 👤 Candidate Portal
- Candidate registration and login
- Profile management
- Resume upload
- Browse and apply for jobs
- Application status tracking

### 💼 Recruitment Management
- Create and manage job requisitions
- Approval workflow
- Publish job openings
- Candidate pipeline management

### 🤖 AI Evaluation
- Resume parsing
- Job description matching
- AI-powered fitment scoring
- Candidate evaluation insights

### 📅 Interview Management
- Interview scheduling
- Interviewer assignment
- Feedback collection
- Interview status tracking

### 📧 Communication
- Interview invitations
- Offer notifications
- Rejection emails
- Reminder notifications

### 🧠 Talent Pool
- Archive rejected candidates
- Rediscover candidates for future roles
- Candidate history management

### 📊 Analytics
- Hiring pipeline insights
- Time-to-hire metrics
- Screening statistics
- Offer acceptance rate

---

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

### Backend
- Express.js
- TypeScript
- FastAPI (AI Service)
- Drizzle ORM

### Database
- PostgreSQL
- Redis

### Messaging
- Kafka

### AI
- Python
- FastAPI
- Large Language Models (LLMs)

### DevOps
- Docker
- Docker Compose
- GitHub Actions
- Kubernetes (Planned)

---

## 📂 Project Structure

```
HireHelp/
├── frontend
├── api-gateway
├── candidate-service
├── recruitment-service
├── admin-service
├── interview-service
├── ai-evaluation-service
├── communication-service
├── talent-service
└── analytics-service
```

---

## 🔐 Authentication

HireHelp uses **JWT-based authentication** with **Role-Based Access Control (RBAC)**.

Supported roles:

- Candidate
- Recruiter
- Interviewer
- Admin

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-org/HireHelp.git
cd HireHelp
```

### Install Dependencies

```bash
npm install
```

For the AI service:

```bash
pip install -r requirements.txt
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=

DATABASE_URL=

JWT_SECRET=

KAFKA_BROKER=

REDIS_URL=

OPENAI_API_KEY=
```

---

## ▶️ Run the Project

Using Docker:

```bash
docker compose up --build
```

Or run services individually:

```bash
npm run dev
```

AI Service:

```bash
uvicorn app.main:app --reload
```

---

## 🔒 Security

- JWT Authentication
- Role-Based Access Control
- Password Hashing
- Input Validation
- Rate Limiting
- Environment-based Configuration

---

## 🎯 MVP Features

- Candidate registration
- Job requisition management
- Resume upload
- AI resume screening
- Candidate pipeline
- Interview scheduling
- Email notifications
- Feedback management
- Talent pool

---

## 🚀 Future Enhancements

- AI-powered interview rounds
- Calendar integration
- Semantic talent search
- Real-time notifications
- Advanced analytics
- Kubernetes deployment

---

## 👥 Team

- Adeela Azeez
- Archi Garg
- Anushka Berlia

---

## 📄 License

This project is developed for educational purposes.
