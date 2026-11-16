const layout = require("./layout");
const escapeHtml = require("./escape");

module.exports = function indexView(users) {
    let rows = "";
    for (const u of users) {
        rows += `    <tr>
      <td>${escapeHtml(u._id)}</td>
      <td>${escapeHtml(u.firstname)}</td>
      <td>${escapeHtml(u.lastname)}</td>
      <td>${escapeHtml(u.login)}</td>
      <td>&bull;&bull;&bull;&bull;&bull;&bull;</td>
      <td>
        <a href="/edit/${escapeHtml(u._id)}">Edit</a>
        <form class="inline" method="post" action="/delete/${escapeHtml(u._id)}" onsubmit="return confirm('Are you sure you want to delete it?')">
          <button type="submit" class="link">Delete</button>
        </form>
      </td>
    </tr>
`;
    }
    if (!rows) rows = `    <tr><td colspan="6">No users yet.</td></tr>\n`;
    return layout("Users", `<h2>Users</h2>
  <p><a href="/new">New user</a></p>
  <table>
    <tr><th>ID</th><th>Firstname</th><th>Lastname</th><th>Login</th><th>Password</th><th>Action</th></tr>
${rows}  </table>
  <p class="muted">Node.js + Express + Mongoose &middot; MongoDB Atlas &middot; Render</p>`);
};
