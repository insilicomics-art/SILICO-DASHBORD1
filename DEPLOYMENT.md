# Database Deployment Guide

This guide explains how to deploy your **Mock Database** (`db.json` served via `json-server`) to a live web server so it can be accessed over the internet.

We will use **Render.com** as it is free, easy to use, and supports Node.js natively.

## Prerequisites

1.  **GitHub Account**: You need a GitHub account.
2.  **Git Repository**: Your project must be pushed to a GitHub repository.

## Step 1: Prepare Your Project

We have already updated your `package.json` to be ready for deployment:
*   `json-server` is moved to `dependencies`.
*   The `start` script is set to `node server.cjs`.
*   The `server.cjs` file is configured to use `process.env.PORT`.

## Step 2: Push to GitHub

Ensure all your latest changes (including the `package.json` update) are committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Step 3: Deploy to Render

1.  **Sign Up/Login**: Go to [dashboard.render.com](https://dashboard.render.com/) and log in with your GitHub account.
2.  **New Web Service**:
    *   Click the **"New +"** button.
    *   Select **"Web Service"**.
3.  **Connect Repository**:
    *   Find your repository (`SILICO-DASHBORD` or similar) in the list and click **"Connect"**.
4.  **Configure Service**:
    *   **Name**: Give it a name (e.g., `silico-db`).
    *   **Region**: Choose the one closest to you (e.g., Singapore or Frankfurt).
    *   **Branch**: `main` (or `master`).
    *   **Root Directory**: Leave blank (defaults to root).
    *   **Runtime**: **Node** (should be auto-detected).
    *   **Build Command**: `npm install` (default).
    *   **Start Command**: `node server.cjs` (default, detected from `package.json`).
5.  **Instance Type**: Select **"Free"**.
6.  **Create Web Service**: Click the **"Create Web Service"** button.

## Step 4: Verify Deployment

Render will start building your service. Watch the logs.
*   It will run `npm install`.
*   Then it will run `node server.cjs`.
*   You should see `JSON Server is running on port ...` in the logs.

Once the status is **Live**, you will see a URL at the top (e.g., `https://silico-db.onrender.com`).

**Test it:**
Open your browser or use curl:
`https://silico-db.onrender.com/projects`

## Step 5: Connect Frontend to Backend

Now that your database is online, you need to tell your React frontend to use this new URL instead of `localhost:3001`.

1.  Open `src/services/api.ts` (or wherever your API calls are defined).
2.  Change the base URL:
    ```typescript
    // const API_URL = 'http://localhost:3001';
    const API_URL = 'https://silico-db.onrender.com'; // Replace with your actual Render URL
    ```
3.  Commit and push this change to redeploy your frontend (if it's also deployed).

## Important Note on Data Persistence

On the **Free Tier** of Render (and most ephemeral hosting platforms):
*   **The filesystem is ephemeral.** This means if the server restarts (which happens frequently on free tiers), **any changes made to `db.json` (POST/PUT/DELETE) will be lost**, and it will revert to the original `db.json` from your Git repo.
*   **For permanent storage**, you should consider moving to a real database like **MongoDB**, **PostgreSQL**, or use a storage service like **AWS S3** or **Render Disk** (paid feature) if you stick with JSON files.

For a prototype or demo, `json-server` on Render is fine, but be aware that data resets on restart.
