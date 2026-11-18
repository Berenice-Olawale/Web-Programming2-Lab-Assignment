# ReNew Notebooks – Web-programming-2 seminar project

Express + EJS + Mongoose (MVC) web shop for refurbished notebooks, with session authentication
(visitor / registered visitor / admin), deployed on Render with MongoDB Atlas.
It is developed further from the teacher's **07b-Authentication** solution.

**Theme:** Bootswatch *Cosmo* (free, responsive, Bootstrap 5.3) – <https://bootswatch.com/cosmo/>

## Roles and menus

| Role | Menus |
|---|---|
| Visitor (not logged in) | Mainpage, Database, Contact, Login, Registration |
| Registered visitor (`user`) | + Graph, Messages, Logout |
| Admin (`admin`) | + CRUD |

## Run locally
1. `npm install`
2. `cp .env.example .env` and fill in `MONGODB_PASSW`, `SESSION_SECRET`, `ADMIN_PASSWORD`
3. `npm run seed` – loads the notebook data (processors, operating systems, notebooks) and creates the admin account
4. `npm start` → <http://localhost:3000>
5. `npm test` – offline smoke test (renders all views, checks the menu of each role)

The database is called `renew` (change it with `DB_NAME`). Collections: `users`, `sessions`,
`processors`, `opsystems`, `notebooks`.

## Deploy (Render)
Build command `npm install`, start command `npm start`. Environment variables on Render:
`MONGODB_PASSW` and `SESSION_SECRET`. In Atlas, Network Access must allow `0.0.0.0/0`.
Run `npm run seed` once from your computer (it fills the same Atlas database that Render uses).

## Where is what (useful for the documentation)

| Task | Files |
|---|---|
| Base: 07b Authentication solution | `app.js`, `models/User.js`, `controllers/authController.js`, `middleware/auth.js`, `routes/auth.js`, `views/login.ejs`, `views/register.ejs` |
| Responsive theme + creators in the footer | `views/partials/header.ejs`, `views/partials/footer.ejs`, `public/css/site.css`, `config/site.js` |
| Authentication and roles | `controllers/authController.js` (register, login, logout), `middleware/auth.js` (`isLoggedIn`, `isAdmin`, `isGuest`), role-dependent menu in `views/partials/header.ejs` |
| Mainpage | `controllers/homeController.js`, `views/home.ejs` |
| Database menu (3 collections, ODM) | `models/Notebook.js`, `models/Processor.js`, `models/OpSystem.js`, `controllers/databaseController.js`, `views/database/*.ejs` |
| Contact, Messages, Graph, CRUD | placeholders: `controllers/contactController.js`, `messagesController.js`, `graphController.js`, `crudController.js` (+ `routes/*.js`) |

See `docs/TEAM-GUIDE.md` for the work split and the git workflow.
