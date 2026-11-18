# Team guide

## Work split
| Part | Who |
|---|---|
| Items 1-5: base from 07b, theme, authentication and roles, Mainpage, Database menu | Berenice |
| Items 6-9: Contact, Messages, Graph, CRUD | Partner |
| Items 10-13: Render + Atlas, GitHub, documentation | together |

The partner's menus already exist as placeholders with the right access rules. Each menu has its **own**
controller, route file and views, so the two of you rarely edit the same file (no merge conflicts).

## What the partner implements
| Menu | Access (already enforced in `routes/`) | Files to work in |
|---|---|---|
| Contact | everybody | `controllers/contactController.js`, `routes/contact.js` (add `router.post("/", ...)`), new `models/Message.js`, new `views/contact.ejs` |
| Messages | logged in (user + admin) | `controllers/messagesController.js`, new `views/messages.ejs`; newest first: `.sort({ createdAt: -1 })`, show the time |
| Graph | logged in (user + admin) | `controllers/graphController.js`, new `views/graph.ejs` (Chart.js from the CDN; numbers from `Notebook.aggregate`) |
| CRUD | admin only | `controllers/crudController.js`, `routes/crud.js`, new `views/crud/*.ejs`; model `models/Notebook.js` already exists |

Handy things that exist already:
- Every view starts with `<%- include("partials/header") %>` and ends with `<%- include("partials/footer") %>` (from `views/crud/x.ejs`: `../partials/header`).
- One-time messages: `setFlash(req, "success", "Saved!")` from `utils/flash.js`, shown by the header.
- Always read form values as strings with `str()` from `utils/params.js`, and validate on the server.
- `fmtPrice`, `fmtMemory`, `fmtDisk` are available in every view.
- `npm test` must still pass (it checks the menus of the three roles).

## Git workflow (task 11 and 12)
- Both of you use your **own GitHub account and your real name** (`git config user.name` / `user.email`).
- The partner clones the repo, works on a branch (`git switch -c feature/contact`), pushes it and opens a **pull request**; you merge it.
  Use GitHub Issues for the tasks, so it is visible who did what (task 12).
- Commit often with clear messages. At least 5 separate steps are required – never upload only the finished application.

## Suggested commits for items 1-5
Commit in this order (intermediate commits do not have to start on their own, but each one is a real step):

1. `git add package.json .gitignore .env.example config utils` → "Project setup: config and helpers"
2. `git add models seed seed.js` → "Mongoose models and notebook seed data (3 collections)"
3. `git add middleware controllers/authController.js routes/auth.js views/login.ejs views/register.ejs` → "Registration, login, logout and roles"
4. `git add views/partials public config/site.js` → "Bootswatch Cosmo theme, footer with creators"
5. `git add controllers/homeController.js routes/home.js views/home.ejs` → "Mainpage"
6. `git add controllers/databaseController.js routes/database.js views/database` → "Database menu"
7. `git add .` → "Menu placeholders for Contact, Messages, Graph, CRUD; docs; tests"
