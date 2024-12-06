# uSocial Web App

Welcome to the uSocial Web App! This is the frontend for uSocial, a platform that connects influencers and users. The web app allows users to purchase gems, message influencers, and interact with the platform in real-time. This app is built with React, Vite, TypeScript, TanStack Query, and integrates with services like Stripe and CometChat.

## Features

- User authentication.
- Purchase gems via Stripe.
- Send and receive messages with influencers using CometChat.
- Real-time chat with influencers.
- TanStack Query for efficient data fetching and state management.
- Responsive design using Tailwind CSS.

## Technologies

- **React**: Frontend framework for building user interfaces.
- **Vite**: Fast and optimized build tool for React.
- **TypeScript**: TypeScript for strong typing and enhanced development experience.
- **Stripe**: For secure payments and gem transactions.
- **CometChat**: For real-time messaging between users and influencers.
- **TanStack Query**: For efficient and scalable data fetching and caching.
- **Tailwind CSS**: Utility-first CSS framework for styling.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or later)
- npm or Yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/emre88tosun/usocial-web.git
   cd usocial-web
   ```

2. Install the dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root of the project with the following environment variables (replace with your actual values):

   ```bash
   VITE_REACT_APP_REST_API_BASE=http://127.0.0.1:80/api
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173` to view the app.
