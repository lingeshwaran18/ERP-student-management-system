# 🎓 ERP Student Management System

A full-stack Enterprise Resource Planning (ERP) system for educational institutions, featuring role-based dashboards for **Students**, **Faculty**, **Admin**, and **Parents** — with a built-in AI Assistant chatbot.

---

## ✨ Features

### 🔐 Role-Based Access Control
| Role | Capabilities |
|------|-------------|
| **Admin** | Student & faculty directory, department management, fee overview, support tickets |
| **Faculty** | Record attendance, enter exam marks, manage class assignments |
| **Student** | View attendance (monthly calendar), grades, fee status, library catalog, AI predictor |
| **Parent** | Monitor child's attendance, grades, and academic progress |

### 🤖 AI Assistant
- Built-in ERP chatbot with a curated knowledge base
- 3-stage precision matcher for accurate Q&A (no hallucinations)
- Always-visible panel on the right side of every dashboard

### 📊 Student Dashboard Highlights
- **Clickable stat cards** — tap to expand detailed views:
  - 📅 Monthly attendance calendar (June & July) with color-coded days
  - 📈 Subject-wise marks with grade letters and progress bars
  - 🧾 Fee payment history with invoice details
  - 📚 Library catalog with book availability status
- AI SGPA performance predictor

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend (Prototype)** | HTML5, Tailwind CSS, Lucide Icons, Vanilla JS |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | PostgreSQL (via Prisma ORM) / SQLite (for quick testing) |
| **Auth** | JWT (JSON Web Tokens) |
| **ORM** | Prisma |

---

## 📁 Project Structure

```
ERP student management/
├── index.html              # Full SPA prototype (standalone, no build needed)
├── .gitignore
├── README.md
│
├── client/                 # React frontend (TypeScript)
│   ├── src/
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
└── server/                 # Express backend (TypeScript)
    ├── src/
    │   └── controllers/
    │       └── aiController.ts
    ├── prisma/
    │   └── schema.prisma
    ├── .env.example        # Copy to .env and fill in values
    ├── package.json
    └── tsconfig.json
```

---

## 🚀 Quick Start

### Option 1 — Open Prototype (No setup needed)
Just open `index.html` in your browser. All features work offline.

**Demo Login Credentials:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@erp.com | admin123 |
| Faculty | faculty1@erp.com | faculty123 |
| Student | student1@erp.com | student123 |
| Parent | parent1@erp.com | parent123 |

---

### Option 2 — Full Stack Setup

#### Prerequisites
- Node.js 18+
- PostgreSQL (or use SQLite for quick testing)

#### 1. Clone the repository
```bash
git clone https://github.com/lingeshwaran18/ERP-student-management.git
cd ERP-student-management
```

#### 2. Setup the backend
```bash
cd server
cp .env.example .env
# Edit .env with your database credentials

npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

#### 3. Setup the frontend
```bash
cd client
npm install
npm run dev
```

---

## 🎨 UI Design

- **3-column layout**: Left sidebar → Main content → AI chatbox (always expanded)
- **Role-colored badges**: Blue (Student), Green (Faculty), Red (Admin), Amber (Parent)
- **Animated cards** with hover lift effects
- **Fade-in transitions** on every tab switch
- **Custom slim scrollbars** throughout

---

## 👥 Sample Indian Names Used

| Role | Name |
|------|------|
| Admin | Rajesh Kumar |
| Faculty | Dr. Ramesh Krishnan, Dr. Anitha Subramaniam, Dr. Vijay Patel |
| Student | Arjun Sharma, Priya Nair, Rahul Verma |
| Parent | Suresh Sharma |

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

> Built with ❤️ for educational institutions
