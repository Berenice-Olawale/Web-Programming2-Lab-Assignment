// Offline smoke test: checks the controller + views with a fake User model.
// (No database, Express or Mongoose needed.)  Run:  npm test
const path = require("path");
const assert = require("assert");

const modelPath = require.resolve(path.join(__dirname, "..", "models", "userModel.js"));

// ---- fake model that mimics the schema rules (required, min 3 chars) ----
function validate(data) {
    const errors = {};
    for (const f of ["firstname", "lastname", "login", "password"]) {
        const v = typeof data[f] === "string" ? (f === "password" ? data[f] : data[f].trim()) : "";
        if (!v) errors[f] = { message: f + " is required!" };
        else if (v.length < 3) errors[f] = { message: f + " must be at least 3 characters long!" };
    }
    if (Object.keys(errors).length) {
        const err = new Error("ValidationError");
        err.name = "ValidationError";
        err.errors = errors;
        throw err;
    }
}
const db = [{ _id: "aaaaaaaaaaaaaaaaaaaaaaaa", firstname: "Tibor", lastname: "Nagy", login: "nagyt", password: "1234" }];
class FakeDoc {
    constructor(d) { Object.assign(this, d); }
    set(data) { Object.assign(this, data); }
    async save() { validate(this); const i = db.findIndex(x => x._id === this._id); db[i] = { ...this }; }
}
const FakeUser = {
    find: () => ({ sort: async () => db.map(d => new FakeDoc(d)) }),
    create: async data => { validate(data); db.push({ _id: "b".repeat(23) + db.length, ...data }); },
    findById: async id => {
        if (id === "bad") { const e = new Error("cast"); e.name = "CastError"; throw e; }
        const d = db.find(x => x._id === id);
        return d ? new FakeDoc(d) : null;
    },
    findByIdAndDelete: async id => { const i = db.findIndex(x => x._id === id); if (i >= 0) db.splice(i, 1); }
};
require.cache[modelPath] = { id: modelPath, filename: modelPath, loaded: true, exports: FakeUser };
const ctrl = require("../controllers/userController");

function fakeRes() {
    return { code: 200, body: "", location: null,
        status(c) { this.code = c; return this; },
        send(b) { this.body = b; return this; },
        redirect(l) { this.code = 302; this.location = l; return this; } };
}

(async () => {
    let r = fakeRes(); await ctrl.index({}, r);
    assert.ok(r.body.includes("Tibor") && r.body.includes("Nagy"), "list shows users");
    assert.ok(!r.body.includes("1234"), "password is not shown in the list");

    // insert: invalid -> form again with messages and typed values kept
    r = fakeRes(); await ctrl.insert({ body: { firstname: "AB", lastname: "", login: "ab", password: "" } }, r);
    assert.strictEqual(r.code, 400);
    assert.ok(r.body.includes("firstname must be at least 3 characters long!"));
    assert.ok(r.body.includes("lastname is required!"));
    assert.ok(r.body.includes('value="AB"'), "typed values are kept");

    // insert: valid -> redirect
    r = fakeRes(); await ctrl.insert({ body: { firstname: "Judit", lastname: "Kovacs", login: "kovacsj", password: "abcd" } }, r);
    assert.strictEqual(r.location, "/"); assert.strictEqual(db.length, 2);

    // edit validation (the practice homework)
    r = fakeRes(); await ctrl.update({ body: { id: db[0]._id, firstname: "Ti", lastname: "Nagy", login: "nagyt", password: "1234" } }, r);
    assert.strictEqual(r.code, 400);
    assert.ok(r.body.includes("firstname must be at least 3 characters long!"));
    assert.ok(r.body.includes('name="id" value="' + db[0]._id + '"'), "hidden id kept on error");
    assert.strictEqual(db[0].firstname, "Tibor", "invalid update is not saved");

    r = fakeRes(); await ctrl.update({ body: { id: db[0]._id, firstname: "Tibi", lastname: "Nagy", login: "nagyt", password: "1234" } }, r);
    assert.strictEqual(r.location, "/"); assert.strictEqual(db[0].firstname, "Tibi");

    // html is escaped (no script injection)
    r = fakeRes(); await ctrl.insert({ body: { firstname: "<script>x</script>", lastname: "Nagy", login: "a", password: "1" } }, r);
    assert.ok(!r.body.includes("<script>x</script>") && r.body.includes("&lt;script&gt;"));

    // bad / missing ids
    r = fakeRes(); await ctrl.editForm({ params: { id: "bad" } }, r); assert.strictEqual(r.code, 404);
    r = fakeRes(); await ctrl.editForm({ params: { id: "zzz" } }, r); assert.strictEqual(r.code, 404);
    r = fakeRes(); await ctrl.remove({ params: { id: "bad" } }, r); assert.strictEqual(r.location, "/");

    // delete
    const before = db.length;
    r = fakeRes(); await ctrl.remove({ params: { id: db[0]._id } }, r);
    assert.strictEqual(db.length, before - 1);

    console.log("All checks passed.");
})().catch(e => { console.error("TEST FAILED:", e.message); process.exit(1); });
