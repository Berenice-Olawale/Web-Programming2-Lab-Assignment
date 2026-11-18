// Offline smoke test (no database needed): renders every view with sample data and
// checks the menu rules of the three roles.   Run:  npm test
const path = require("path");
const assert = require("assert");
const ejs = require("ejs");
const site = require("../config/site");
const fmt = require("../utils/format");

const views = path.join(__dirname, "..", "views");
function render(name, data = {}) {
    return ejs.renderFile(path.join(views, name + ".ejs"),
        { site, currentPath: "/", user: null, flash: null, ...fmt, ...data }, { views: [views] });
}

const proc = { _id: "p1", manufacturer: "AMD", type: "Athlon 64 X2 QL64" };
const os = { _id: "o1", name: "Linux" };
const nb = { _id: "n1", manufacturer: "HP", type: "COMPAQ <b>615</b>", display: 15.6, memory: 2048, harddisk: 250,
    videocontroller: "ATi Radeon", price: 95120, pieces: 3, processor: proc, opsystem: os };
const guest = null;
const regUser = { id: "u1", username: "anna", role: "user" };
const admin = { id: "u2", username: "boss", role: "admin" };

(async () => {
    // ---- menu rules (task 3) ----
    const menuOf = async user => {
        const html = await render("error", { title: "x", code: 404, message: "m", user });
        return ["/", "/database", "/contact", "/graph", "/messages", "/crud", "/login", "/register"]
            .filter(h => html.includes('href="' + h + '"'));
    };
    assert.deepStrictEqual(await menuOf(guest), ["/", "/database", "/contact", "/login", "/register"], "visitor menu");
    assert.deepStrictEqual(await menuOf(regUser), ["/", "/database", "/contact", "/graph", "/messages"], "registered visitor menu");
    assert.deepStrictEqual(await menuOf(admin), ["/", "/database", "/contact", "/graph", "/messages", "/crud"], "admin menu");

    // ---- footer on every page: names + Neptun codes (task 2) ----
    const pages = {
        home: await render("home", { title: "Mainpage", stats: { notebooks: 246, processors: 44, opsystems: 12, pieces: 500, brands: 8 }, brands: ["ASUS", "HP"], featured: [nb], dbError: false }),
        homeDown: await render("home", { title: "Mainpage", stats: { notebooks: 0, processors: 0, opsystems: 0, pieces: 0, brands: 0 }, brands: [], featured: [], dbError: true }),
        login: await render("login", { title: "Login", error: "Login failed!", form: { username: "<x>" } }),
        register: await render("register", { title: "Registration", errors: ["There is already such a user!"], form: { username: "anna" } }),
        stub: await render("stub", { title: "Contact", access: "Everybody", todo: ["a", "b"] }),
        notebooks: await render("database/notebooks", {
            title: "Database", tab: "notebooks", items: [nb], total: 41, page: 2, totalPages: 3, pageSize: 20,
            pageUrl: n => "/database?page=" + n, hasFilters: true,
            filters: { q: "hp", manufacturer: "HP", processor: "p1", os: "o1", maxPrice: "200000", stock: "1", sort: "brand" },
            manufacturers: ["HP"], processors: [proc], opsystems: [os] }),
        notebooksEmpty: await render("database/notebooks", {
            title: "Database", tab: "notebooks", items: [], total: 0, page: 1, totalPages: 1, pageSize: 20,
            pageUrl: () => "/database", hasFilters: false,
            filters: { q: "", manufacturer: "", processor: "", os: "", maxPrice: "", stock: "", sort: "brand" },
            manufacturers: [], processors: [], opsystems: [] }),
        processors: await render("database/processors", { title: "P", tab: "processors", rows: [{ ...proc, count: 2 }, { ...proc, _id: "p2", count: 0 }] }),
        opsystems: await render("database/opsystems", { title: "O", tab: "opsystems", rows: [{ ...os, count: 5 }] })
    };
    for (const [name, html] of Object.entries(pages)) {
        for (const c of site.creators) {
            assert.ok(html.includes(c.name) && html.includes(c.neptun), name + ": footer must show " + c.name);
        }
        assert.ok(html.includes("bootswatch@5.3.3/dist/" + site.theme), name + ": theme is linked");
    }

    // ---- content checks + output escaping ----
    assert.ok(pages.home.includes("COMPAQ &lt;b&gt;615&lt;/b&gt;"), "model name is escaped");
    assert.ok(pages.home.includes("95") && pages.home.includes(site.currency), "price is formatted");
    assert.ok(pages.homeDown.includes("temporarily unavailable"));
    assert.ok(pages.login.includes("Login failed!") && pages.login.includes("&lt;x&gt;"));
    assert.ok(pages.register.includes("There is already such a user!"));
    assert.ok(pages.notebooks.includes("3 pcs") && pages.notebooks.includes("AMD Athlon 64 X2 QL64") && pages.notebooks.includes("Linux"));
    assert.ok(pages.notebooks.includes("page 2 of 3") && pages.notebooks.includes("/database?page=3"));
    assert.ok(pages.notebooksEmpty.includes("No notebooks match"));
    assert.ok(pages.processors.includes("Show notebooks"));

    console.log("All checks passed.");
})().catch(e => { console.error("TEST FAILED:", e.message); process.exit(1); });
