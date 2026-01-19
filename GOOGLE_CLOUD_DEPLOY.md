# Deploying to Google Cloud Run

This guide will help you deploy your API (database) to Google Cloud Run. This service is serverless, scales automatically, and includes a free tier.

## Prerequisites

1.  A **Google Cloud Project** with billing enabled.
2.  Your project pushed to a **GitHub repository**.

## Steps to Deploy

### 1. Open Google Cloud Console
Go to the [Google Cloud Console](https://console.cloud.google.com/).

### 2. Go to Cloud Run
Search for **"Cloud Run"** in the top search bar and select it.

### 3. Create Service
Click **"CREATE SERVICE"**.

### 4. Configure Source
*   **Source:** Select **"Continuously deploy new revisions from a source repository"**.
*   Click **"SET UP CLOUD BUILD"**.
*   **Repository Provider:** Select **GitHub**.
*   **Repository:** Select your repository (e.g., `SILICO-DASHBORD`).
*   **Branch:** `main` (or your working branch).
*   **Build Type:** Select **"Dockerfile"** (it should detect the `Dockerfile` we just created).
*   Click **"SAVE"**.

### 5. Configure Service Settings
*   **Service Name:** `silico-db` (or whatever you prefer).
*   **Region:** Choose a region close to you (e.g., `us-central1`, `asia-south1`).
*   **Authentication:** Select **"Allow unauthenticated invocations"**. (This makes your API public so your frontend can access it).

### 6. Create
Click **"CREATE"**.

Google Cloud will now:
1.  Build your Docker container.
2.  Deploy it to a URL.

### 7. Get Your URL
Once deployment is complete (green checkmark), you will see a URL at the top (e.g., `https://silico-db-xyz-uc.a.run.app`).

**Test it:** Open `https://silico-db-xyz-uc.a.run.app/projects` in your browser.

## Map Your Custom Domain

1.  In the Cloud Run service details page, click the **"MANAGE CUSTOM DOMAINS"** tab (or "Integrations" -> "Custom Domains").
2.  Click **"ADD MAPPING"**.
3.  Select option **"Cloud Run Domain Mapping"**.
4.  Select your verified domain (you may need to verify ownership via DNS TXT record if not done already).
5.  Follow the instructions to add the `A` and `AAAA` records to your domain's DNS settings (Google Domains, GoDaddy, etc.).

## Connect Frontend

Don't forget to update your frontend code (`src/services/api.ts`) to use your new Google Cloud URL!

```typescript
const API_URL = 'https://silico-db-xyz-uc.a.run.app'; // Your new URL
```
