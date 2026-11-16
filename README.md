# Web-programming-2 Seminar – Node.js Homework

Express + Mongoose (MVC) users CRUD app, deployed on **Render** with a **MongoDB Atlas** database (`web2` database, `users` collection).

## Files

| File | Purpose |
|---|---|
| `feladat001.js` | Step 1 – Hello Express World, no database |
| `feladat01.js` | Step 2 – lists the `users` from Atlas (as in the Render/Atlas guide) |
| `app.js` + `config/ models/ controllers/ routes/ views/` | Full app: CRUD, server-side validation (new **and** edit form) |
| `seed.js` | Optional: inserts the 2 test users (Tibor Nagy, Judit Kovacs) |
| `.env.example` | Template for the secret connection string |

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env` and put your Atlas connection string in `MONGODB_PASSW`
3. `npm run seed` (optional), then `npm start` -> http://localhost:8080
4. `npm test` runs an offline smoke test (no database needed)

## Deploy
1. MongoDB Atlas: create the M0 cluster, a database user, and copy the **Drivers** connection string.
   Network Access -> add `0.0.0.0/0` (free-tier IPs change).
2. Push this folder to a **public GitHub repo** (`.env` is excluded by `.gitignore` – never commit it).
3. Render -> New -> Web Service -> your repo. Language: Node, Free instance.
   Build Command: `npm install`  Start Command: `npm start`
4. Environment -> add variable `MONGODB_PASSW` = your connection string. Save and deploy.
5. Open the `https://....onrender.com` URL (first load after inactivity takes ~1 minute).
   For the step-by-step version of the guide, use Start Command `node feladat001.js`, then `node feladat01.js`.
