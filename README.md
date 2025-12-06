# WishperWall

**An anonymous, real-time digital bulletin board for your thoughts.**

WishperWall is a MERN stack application that reimagines the classic sticky note experience for the web. It allows users to post anonymous thoughts, react to others, and watch the wall evolve in real-time—all without signing up.

<a href="https://wishper-wall.vercel.app/">WishperWall</a>

## Key Features

### Real-Time Interaction
*   **Live Updates**: Powered by **Socket.io**, new notes appear instantly on everyone's screen without refreshing.
*   **Reactions**: React to notes with stickers (🔥, ❤️, 😂, etc.). Updates are broadcasted in real-time.

### Immersive UI/UX
*   **Sticky Note Aesthetic**: Notes look and feel like physical paper, with random rotations and "tape" effects.
*   **Freshness Indicators**:
    *   **New Notes**: Crisp and bright.
    *   **Aged Notes**: Notes older than 3 days fade and develop a sepia tone, visually representing the passage of time.
*   **Sound Effects**: Satisfying audio feedback for posting, reacting, and deleting (local only).
*   **Infinite Scroll**: Seamlessly browse through history without pagination clicks.
*   **Dark Mode**: Fully supported theme switching.

### Safety & Moderation
*   **Profanity Filter**: Integrated `bad-words` filter automatically cleans offensive language from titles and content before saving.
*   **No Public Delete**: To prevent vandalism, users cannot delete others' notes.
*   **Reporting System**: Community-driven moderation allows users to flag inappropriate content.

### Performance & Control
*   **Rate Limiting**: Built-in protection against spam. The API limits the number of requests a single IP can make within a specific timeframe, ensuring the service remains stable and fair for everyone.
*   **Custom TTL (Time-to-Live)**: Users choose how long their note survives:
    *   24 Hours
    *   3 Days
    *   7 Days
    *   *Notes are automatically removed from the database after expiration.*

## Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Socket.io Client
*   **Backend**: Node.js, Express, Socket.io
*   **Database**: MongoDB (Mongoose)
*   **Tools**: `bad-words` (Filtering), `react-intersection-observer` (Infinite Scroll), `use-sound` (Audio)

## Getting Started

### Prerequisites
*   Node.js (v14+)
*   MongoDB Atlas URI

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/wishperwall.git
    cd wishperwall
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in `backend/`:
    ```env
    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    NODE_ENV=development
    ```
    Start the server:
    ```bash
    npm start
    ```

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    ```
    Create a `.env` file in `frontend/`:
    ```env
    VITE_API_URL=http://localhost:5001
    ```
    Start the client:
    ```bash
    npm run dev
    ```
