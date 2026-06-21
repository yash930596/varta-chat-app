# Varta 💬

**Varta** (वार्ता — "conversation" in Hindi) is a full-stack real-time chat application supporting one-on-one messaging, group chats, online presence, and image sharing — built with the MERN stack and Socket.io.

🔗 **Live Demo:** [varta-chat-app-orpin.vercel.app](https://varta-chat-app-orpin.vercel.app/)

---

## ✨ Features

- 🔐 **User Authentication** — secure registration and login with JWT and bcrypt password hashing
- 💬 **One-on-One Chat** — real-time private messaging powered by Socket.io
- 👥 **Group Chat** — create groups, add members, and chat together in real time
- 🟢 **Online/Offline Status** — see who's online instantly with live status updates
- 📷 **Image Sharing** — send images in chat, hosted via Cloudinary
- ⚡ **Real-Time Everything** — messages, presence, and group activity update instantly with no refresh

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router
- Socket.io Client
- Axios

**Backend**
- Node.js
- Express
- Socket.io
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Cloudinary for image storage

---

## 📂 Project Structure

```
varta/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (ChatBox, Sidebar, modals)
│   │   ├── pages/          # Route-level pages (Login, Register, Chat)
│   │   ├── context/        # Auth & Socket context providers
│   │   └── assets/         # Static assets
│   └── vite.config.js
│
└── server/                 # Node.js + Express backend
    ├── models/              # Mongoose schemas (User, Message, Group)
    ├── routes/               # API routes (auth, users, messages, groups)
    ├── middleware/           # JWT auth middleware
    ├── config/               # Cloudinary config
    └── index.js              # Entry point + Socket.io server
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- A free [Cloudinary](https://cloudinary.com) account

### 1. Clone the repository
```bash
git clone https://github.com/your-username/varta.git
cd varta
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the server:
```bash
npm run dev
```

### 3. Set up the frontend
```bash
cd ../client
npm install
npm run dev
```

The app will be running at `http://localhost:5173`, with the API on `http://localhost:5000`.

---

## 🔑 API Overview

| Method | Endpoint                          | Description                  |
|--------|------------------------------------|-------------------------------|
| POST   | `/api/auth/register`              | Register a new user           |
| POST   | `/api/auth/login`                 | Login and receive a JWT       |
| GET    | `/api/users`                      | Get all users (contacts)      |
| GET    | `/api/messages/:userId`           | Get messages with a user      |
| POST   | `/api/messages/:userId`           | Send a message to a user      |
| GET    | `/api/groups`                     | Get groups for logged-in user |
| POST   | `/api/groups`                     | Create a new group            |
| GET    | `/api/groups/:groupId/messages`   | Get messages in a group       |
| POST   | `/api/groups/:groupId/messages`   | Send a message to a group     |

All routes except `/register` and `/login` require a Bearer token in the `Authorization` header.

---

## 🔌 Socket.io Events

| Event              | Direction        | Description                          |
|---------------------|------------------|----------------------------------------|
| `addUser`           | client → server  | Registers a user as online             |
| `getOnlineUsers`     | server → client  | Broadcasts the current online users    |
| `sendMessage`        | client → server  | Sends a 1-on-1 message                 |
| `getMessage`          | server → client  | Delivers an incoming 1-on-1 message    |
| `joinGroup`           | client → server  | Joins a group's socket room            |
| `sendGroupMessage`     | client → server  | Sends a message to a group             |
| `getGroupMessage`       | server → client  | Delivers an incoming group message     |

---

## 🎨 Design

Varta uses a **Modern Dark** theme — black backgrounds with cyan neon (`#00D4FF`) accents, gradient avatars, and a clean, minimal interface inspired by modern messaging apps.

---

## 📌 Roadmap / Possible Improvements

- [ ] Typing indicators
- [ ] Message read receipts
- [ ] Push notifications
- [ ] Voice/video calling
- [ ] Message search
- [ ] Dark/light theme toggle

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

Built by **[Yash Giri]** — feel free to connect or contribute!
