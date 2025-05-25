# 🏝️ Holidaze – Booking Application

**Holidaze** is a responsive frontend booking application built as part of the Noroff Front-End Development exam. Users can register, log in, browse holiday venues, book them, and manage their profile. Venue managers can list, update, and delete venues, and view upcoming bookings.

---

## 🚀 Live Project

🔗 [Deployed App](https://holidazefromx7.netlify.app)  
📂 [GitHub Repo](https://github.com/X7-C/Holidaze-Exam)

---

## 🗂️ Project Planning

📋 [Kanban Board (Notion) + Gantt Chart (Notion)](https://motley-basement-43e.notion.site/1fefbb16216580f492cff76e8640e0d2?v=1fefbb162165809d9051000cc27725ed)  

---

## 🧰 Tech Stack

- Vite (React)
- TypeScript
- Bootstrap
- Noroff Holidaze API
- Local `.env` config

---

## 🛠 Features

- ✅ User authentication (Login/Register)
- ✅ User roles: customer / venue manager
- ✅ Book a venue
- ✅ View upcoming bookings
- ✅ Venue manager dashboard
- ✅ Create, edit & delete venues
- ✅ Filter venues by category/tag

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

git clone https://github.com/X7-C/Holidaze-Exam.git
cd Holidaze-Exam

shell
Copy
Edit

### 2. Install Dependencies

npm install

bash
Copy
Edit

### 3. Configure Environment Variables

Create a `.env` file in the root of the project:

VITE_API_URL=https://api.noroff.dev/api/v1/holidaze

shell
Copy
Edit

### 4. Run the App

npm run dev

yaml
Copy
Edit

Then visit: `http://localhost:5173` in your browser.

---

## 📁 File Structure (simplified)

/src
├── components/ # Reusable UI components
├── pages/ # Main route components
├── services/ # API service files
├── hooks/ # Custom hooks (e.g. auth, bookings)
├── assets/ # Images and icons
├── styles/ # Bootstrap and custom styling

yaml
Copy
Edit

---


## 📚 Resources

- https://docs.noroff.dev/holidaze-endpoints/
- https://vitejs.dev/
- https://getbootstrap.com/

---

## 🙋‍♂️ Author

Created by **Max** as part of the final project for the Noroff Front-End Development course.  
GitHub: https://github.com/X7-C