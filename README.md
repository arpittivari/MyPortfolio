# MyPortfolio - MERN Stack ECE/AI Portfolio with CMS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A full-stack MERN (MongoDB, Express, React, Node.js) application built to showcase projects and expertise in Electronics & Communication Engineering (ECE), focusing on Embedded Systems, IoT, Edge AI, and Machine Learning. Includes a secure admin panel for content management, interactive demos, and an AI assistant.

## Live Demo

* **Frontend (Vercel):** [https://my-portfolio-eta-beige-68.vercel.app/](https://my-portfolio-eta-beige-68.vercel.app/) _(Replace with your actual Vercel URL if different)_
* **Backend API (Render):** [https://myportfolio-xqyd.onrender.com/](https://myportfolio-xqyd.onrender.com/) _(Replace with your actual Render URL if different)_

## Features

**Public Facing Portfolio:**

* **Modern UI:** Responsive design with a dark/light theme toggle and ECE/PCB aesthetic.
* **Interactive Terminal:** Homepage features a simulated terminal interface for navigation and info.
* **Project Showcase:** Dynamically loads projects from the database with detailed views.
* **Interactive Demos:**
    * **AI Assistant:** Uses Google Gemini API via the backend to answer questions about projects.
    * **ML Hyperparameter Tuner:** Simulates model training adjustments.
    * **IoT Dashboard:** Simulates live sensor data visualization using Recharts.
* **Skills & Bio:** Displays categorized technical skills fetched from the database.
* **Blog Section:** Renders technical articles written in Markdown.
* **Contact Form:** Submits messages to the backend API.

**Admin Panel (Content Management System):**

* **Secure Authentication:** JWT-based login/registration for the administrator.
* **Protected Routes:** Ensures only authenticated users can access management pages.
* **CRUD Operations:** Full Create, Read, Update, Delete functionality for:
    * Projects (including interactive demo settings and engineering decisions)
    * Skill Categories
    * Blog Posts (with Markdown editor support)
* **Analytics Dashboard:** Displays total project views and content counts.
* **Detailed Analytics:** Shows a ranked list of projects based on view counts.

## Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Axios, React Router, Lucide Icons, Recharts, React Markdown
* **Backend:** Node.js, Express.js, Mongoose
* **Database:** MongoDB Atlas
* **Authentication:** JWT (jsonwebtoken), bcryptjs
* **AI Integration:** Google Gemini API (via backend fetch)
* **Deployment:**
    * Frontend: Vercel
    * Backend: Render

## Project Structure

This repository follows a monorepo structure:

* `/client`: Contains the React frontend application (built with Vite).
* `/server`: Contains the Node.js/Express backend API.

## Getting Started (Local Development)

### Prerequisites

* Node.js (v18 or higher recommended)
* npm or yarn
* Git
* MongoDB Atlas Account (for database connection string)
* Google AI Studio Account (for Gemini API key)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/arpittivari/MyPortfolio.git](https://github.com/arpittivari/MyPortfolio.git)
    cd MyPortfolio
    ```

2.  **Environment Variables:** Create `.env` files in both the `server` and `client` directories based on the examples below.

    * **`server/.env`:**
        ```env
        # Server Port
        PORT=5001

        # MongoDB Connection String (Replace with your Atlas URI)
        MONGO_URI="mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER_ADDRESS>/portfolio?appName=Cluster0"

        # JWT Secret (Use a long, random string)
        JWT_SECRET=YOUR_VERY_LONG_RANDOM_SECRET_KEY_HERE

        # Google Gemini API Key (Get from Google AI Studio)
        GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

        # Node Environment (optional, defaults to development)
        # NODE_ENV=development 
        ```

    * **`client/.env`:** (Used only for local development)
        ```env
        # URL for your locally running backend server
        VITE_API_BASE_URL=http://localhost:5001/api 
        ```
    * **Important:** Replace placeholders like `<USERNAME>`, `<PASSWORD>`, `YOUR_ACTUAL_PASSWORD_HERE`, etc., with your actual credentials. Ensure `JWT_SECRET` is strong and random.

3.  **Install Dependencies:** From the **root** (`MyPortfolio/`) directory, run the concurrent install script:
    ```bash
    npm install # Installs concurrently in the root
    npm run install-all # Installs dependencies for client and server
    ```

4.  **Run Development Servers:** From the **root** directory, start both client and server concurrently:
    ```bash
    npm run dev
    ```
    * Frontend will be available at `http://localhost:5174` (or the next available port).
    * Backend API will be available at `http://localhost:5001`.

5.  **Register Admin User:**
    * Navigate to `http://localhost:5174/admin/register` in your browser.
    * Create your administrator account. This is required to access the admin panel.

6.  **Login and Add Content:**
    * Go to `http://localhost:5174/admin/login` and log in.
    * Use the Admin Panel sidebar to navigate and add your Skills, Projects, and Blog Posts.

## Deployment

* **Frontend:** Deployed on [Vercel](https://vercel.com/). Connect your GitHub repository, set the **Root Directory** to `client`, and add the `VITE_API_BASE_URL` environment variable pointing to your deployed backend API URL.
* **Backend:** Deployed on [Render](https://render.com/). Connect your GitHub repository, set the **Build Command** (usually `npm install`), and the **Start Command** (usually `node server.js`). Add `MONGO_URI`, `JWT_SECRET`, and `GEMINI_API_KEY` as environment variables in Render's dashboard. Ensure CORS is correctly configured in `server/server.js` for your Vercel URL.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file (you would need to create this file if you want one) for details.

---

_This README provides a guide to setting up and running the MERN Portfolio application._