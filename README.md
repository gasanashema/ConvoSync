# ConvoSync

ConvoSync is a modern, real-time chat application designed for seamless communication. Built with a focus on speed, security, and user experience, it offers features like real-time messaging, typing indicators, online status updates, and profile customization.

## Features

- **Real-Time Messaging**: Instant message delivery using WebSockets.
- **Typing Indicators**: See when others are typing in real-time.
- **Online Status**: Track user availability (Online/Offline).
- **Profile Customization**: Upload and update your profile picture.
- **Responsive Design**: A beautiful, adaptive UI that works on all devices.
- **Secure Authentication**: JWT-based authentication for secure access.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion, Socket.io-client
- **Backend**: NestJS, MongoDB (Mongoose), Socket.io, Multer
- **Tools**: Vite, npm

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or via Atlas)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/gasanashema/convosync.git
    cd convosync
    ```

2.  **Backend Setup:**

    ```bash
    cd backend
    npm install
    # Create a .env file with your MONGO_URI and JWT_SECRET
    npm run start:dev
    ```

3.  **Frontend Setup:**

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access the Application:**

    Open your browser and navigate to `http://localhost:5173`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.



## Author

Designed and Developed by [**Shema**](https://linktr.ee/Shema_philbert).
