# 🧠 Project Memory — Student-Senior Mentorship Platform

> **Purpose**: This file is our living memory. We refer to it before implementing anything and update it as we progress.
> 
> **Last Updated**: 2026-03-25

---

## 📌 Project Overview

A full-stack MERN application where students discover verified seniors, request mentorship, chat in real time via Socket.io, and book mentorship sessions.

**Tech Stack**: Node.js · Express · MongoDB · Mongoose · Socket.io · React (Vite) · JWT · bcryptjs · Multer (File Uploads)

---

## 📁 Project Structure

```
/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── middleware/auth.js         # JWT auth + role check
│   ├── models/
│   │   ├── User.js               # name, email, password, role, isVerified, skills, bio
│   │   ├── Availability.js       # senior, date, startTime, endTime, isBooked
│   │   ├── Request.js            # student, senior, message, status (pending/accepted/rejected)
│   │   ├── Chat.js               # student, senior, request ref
│   │   ├── Message.js            # chat, sender, content
│   │   └── Session.js            # student, senior, availability, status (scheduled/completed)
│   ├── controllers/
│   │   ├── authController.js     # register, login
│   │   ├── userController.js     # getVerifiedSeniors, getUserProfile, verifySenior
│   │   ├── availabilityController.js  # createSlot, getMySlots, getSlotsBySenior, deleteSlot
│   │   ├── requestController.js  # sendRequest, getMyRequests, getIncomingRequests, updateStatus
│   │   ├── chatController.js     # getMyChats, getChatMessages
│   │   └── sessionController.js  # bookSession, getMySessions, updateSessionStatus
│   ├── routes/
│   │   ├── authRoutes.js         # POST /api/auth/register, POST /api/auth/login
│   │   ├── userRoutes.js         # GET /api/users/seniors, GET /api/users/profile, PUT /api/users/verify/:id
│   │   ├── availabilityRoutes.js # POST, GET /my, GET /:seniorId, DELETE /:id
│   │   ├── requestRoutes.js      # POST, GET /my, GET /incoming, PUT /:id
│   │   ├── chatRoutes.js         # GET /api/chats, GET /api/chats/:chatId/messages
│   │   └── sessionRoutes.js      # POST, GET, PUT /:id
│   ├── socket/socketHandler.js   # Socket.io auth, joinChat, sendMessage, disconnect
│   ├── server.js                 # Entry point — Express + Socket.io + MongoDB
│   ├── package.json
│   └── .env                      # PORT, MONGO_URI, JWT_SECRET
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/               # Images, icons, global styles (Tailwind CSS)
    │   ├── components/           # Generic shared UI (Buttons, Modals, Navbar)
    │   ├── context/              # AuthContext (React Context for global state)
    │   ├── features/             # Feature-based architecture
    │   │   ├── auth/             # Login, Register (Senior flow only)
    │   │   ├── dashboard/        # Senior Dashboard main view
    │   │   ├── requests/         # Incoming Mentorship Request handling
    │   │   ├── chat/             # Socket.io chat UI (Senior perspective)
    │   │   └── availability/     # Senior availability management
    │   ├── hooks/                # Custom React hooks (e.g., useSocket, useAuth)
    │   ├── layouts/              # Main application layout wrappers
    │   ├── services/             # Axios API interceptors & config
    │   ├── utils/                # Helper functions (date formatting, etc.)
    │   ├── App.jsx               # Application routing (React Router)
    │   └── main.jsx              # React entry point
    ├── postcss.config.js         # Tailwind config
    ├── tailwind.config.js        # Tailwind config
    ├── vite.config.js
    └── package.json
```

---

## 🔑 Key Design Decisions

| Decision | Detail |
|---|---|
| **Auth** | bcryptjs for password hashing, JWT for stateless auth tokens |
| **User Roles** | `student` and `senior` — stored in User model |
| **Senior Account Creation** | Seniors register via `/api/auth/register` with `role: "senior"`. They immediately get an account and can access their dashboard instantly. |
| **Senior Verification** | Admin verification (`PUT /api/users/verify/:id`) exists in the backend API, but the frontend will allow seniors to function immediately without a pending screen. |
| **Chat creation** | A Chat document is auto-created when a mentorship request is accepted |
| **Socket.io rooms** | Each chat gets a private room (room name = chat ID) |
| **Slot booking** | Booking a session sets `isBooked: true` on the Availability slot |
| **Frontend Architecture** | React via Vite, using a **Feature-Based Folder Structure** for scalability. UI built using Tailwind CSS with glassmorphism and modern micro-animations. |

---

## 🔌 API Endpoints Summary

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user (student/senior) |
| POST | `/api/auth/login` | Login, returns JWT |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/seniors` | List verified seniors |
| GET | `/api/users/profile` | Get logged-in user profile |
| PUT | `/api/users/verify/:id` | Verify a senior |

### Availability
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/availability` | Senior creates a time slot |
| GET | `/api/availability/my` | Senior's own slots |
| GET | `/api/availability/:seniorId` | Slots for a specific senior |
| DELETE | `/api/availability/:id` | Delete a slot |

### Requests
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/requests` | Student sends mentorship request |
| GET | `/api/requests/my` | User's sent requests |
| GET | `/api/requests/incoming` | Senior's incoming requests |
| PUT | `/api/requests/:id` | Accept/reject a request (creates Chat on accept) |

### Chats
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/chats` | Get user's chats |
| GET | `/api/chats/:chatId/messages` | Get messages for a chat |

### Sessions
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/sessions` | Book a session (marks slot as booked) |
| GET | `/api/sessions` | Get user's sessions |
| PUT | `/api/sessions/:id` | Update session status |
| GET | `/api/dashboard/stats` | Get senior dashboard counts (pending requests, mentees, hours, etc.) |

---

## 🔄 Socket.io Events

| Event | Direction | Description |
|---|---|---|
| `joinChat` | Client → Server | Join private room by chat ID |
| `sendMessage` | Client → Server | Send message (saved to DB, broadcast to room) |
| `receiveMessage` | Server → Client | New message broadcast |
| `disconnect` | Auto | Cleanup on disconnect |

---

## ✅ Implementation Progress

- [x] **Phase 1**: Backend setup (Express, MongoDB, project structure)
- [x] **Phase 2**: User model + Auth (register, login, JWT middleware)
- [x] **Phase 3**: Availability management (CRUD for time slots)
- [x] **Phase 4**: Senior discovery (list verified seniors)
- [x] **Phase 5**: Mentorship requests (send, view, accept/reject)
- [x] **Phase 6**: Real-time chat (Socket.io + Chat/Message models)
- [x] **Phase 7**: Session scheduling (book slots, mark as booked)
- [x] **Phase 8: React Frontend (Senior App Only)**
- [x] **Phase 9: Integration & testing**

---

## 📝 Notes & Reminders

- Always check this file before implementing a new phase
- Update the progress checklist after completing each phase
- Update any design decisions if they change during implementation
- MongoDB must be running locally or use Atlas connection string in `.env`
- Frontend form validation rules explicitly map to our Mongoose constraints (min password length 6 char, proper email regex masking, max bio 500 length, empty fields rejection natively).
- The built-in UserProfile allows seniors to natively visualize and seamlessly edit their Name, Bio, and Skills tracking directly to the dynamic `AuthContext` via `PUT /api/users/profile`.
- Added the "Meeting Scheduling & Session Management" card stub to the Senior Dashboard layout to prepare for Phase 7 integrations.
- Created `SessionManager.jsx` placeholder connected to `/sessions` route to prevent routing fallback to the public landing page.
- Massively upgraded the Availability Management module to completely match an enterprise-grade graphical Weekly Calendar layout powered by date-fns logic with draggable-edit modal overlays.
- Seniors MUST manually input whether new Availability Blocks are 'Available' or 'Booked' physically instead of implicitly defaulting to Available.
- Active "Booked" slots are explicitly formatted in light red backgrounds on the standard availability calendar for instant visual differentiation.
- Transitioned `/sessions` from a placeholder view completely over to rendering real dynamic MongoDB `Session` objects layered over a true CSS Grid calendar implementation mapping specifically to the enterprise requirements layout design.
- Implemented high-fidelity "Creative Confirmation Modals" for both accepting and rejecting mentorship requests.
- Accepting a request now triggers a "Chat with [User]" confirmation; upon approval, the system auto-navigates the senior to the `/chat` workspace after a brief delay.
- Rejected requests are now handled via a safety confirmation to prevent accidental removals from the active list.
- Added a "Join Meeting" confirmation modal in the Session Manager, providing a professional gateway before launching external Microsoft Teams sessions.
- **System-wide Dark Mode**: Implemented a comprehensive theme engine using `ThemeContext` and Tailwind CSS `class` strategy, allowing users to toggle between Light and Dark modes with persistent `localStorage` saving.
- All core Senior dashboard components (Availability, Sessions, Requests, Cards, Navbar) are now fully theme-aware and optimized for high-contrast dark environments.
- Enhanced the Mentorship Request list with a dual-modal safety workflow: "Approve & Chat" and "Confirm Rejection" to protect critical user interactions.
- Added real-time optimistic UI update for pending mentorship requests. Accepted/Rejected requests now instantly move to the "Recent History" section.
- **Safety Gateways**: Integrated a "Confirm Logout" popup in the Navbar to prevent accidental session termination, keeping the user experience secure and intentional.
- **Visual Overhaul**: Implemented an immersive landing page and authentication background featuring the campus photography, layered with sophisticated glassmorphism and gradient overlays for a premium, unified brand experience across the Landing, Login, and Register screens.
- **Profile Photo Support**: Seniors can now optionally upload a profile photo during registration. The system handles binary image transmission via `multer`, generates unique filenames, serves assets statically via `/uploads`, and provides a high-fidelity preview UI with an integrated removal option.
- **Production Data Flow**: Successfully removed all mock data and structural preview banners from the entire project. The application is now fully integrated with the MongoDB backend, featuring a real-time dashboard statistics engine.
