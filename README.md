# Modern Full-Stack AI Chatbot Web Application

This project is a full-stack AI chatbot mimicking the ChatGPT interface. It uses React, Tailwind CSS on the frontend and Node.js, Express, and MongoDB on the backend. It integrates with the OpenAI / Claude API.

## Features Included
- Clean, modern UI (similar to ChatGPT) with responsive design
- User Authentication (JWT-based Login/Registration)
- Chat History saved in MongoDB
- Message bubbles with Markdown and Syntax Highlighting support
- System Prompt customization and Model Selection
- PDF and Text File Upload context extraction
- Dark/Light mode depending on system preference

## Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas)
- OpenAI API Key (or other supported API keys)

## Setup Instructions

### 1. Clone the repository
\`\`\`bash
cd coplete_chat
\`\`\`

### 2. Backend Setup
1. Navigate to the server folder:
\`\`\`bash
cd server
\`\`\`
2. Install dependencies:
\`\`\`bash
npm install
\`\`\`
3. Create a \`.env\` file in the \`server\` directory (see \`.env.example\` for details) and add your keys.
4. Start the backend:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
1. Navigate to the client folder:
\`\`\`bash
cd client
\`\`\`
2. Install dependencies:
\`\`\`bash
npm install
\`\`\`
3. Start the frontend:
\`\`\`bash
npm run dev
\`\`\`

### Docker Deployment
Create a \`Dockerfile\` and \`docker-compose.yml\` based on your target container registry. For quick services, consider Render or Railway which offer native Node.js and static site support.

### Note
- Replace the \`MONGO_URI\` with your own remote cluster connection string for production.
- Keep the API keys secure and never expose the backend \`.env\` file to version control.
