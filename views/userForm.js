const escapeHtml = require("./escape");

function field(name, label, user, errors) {
    const message = errors[name] ? errors[name].message : "";
    return `    <div class="row">
      <label for="${name}">${label}:</label>
      <input type="text" id="${name}" name="${name}" value="${escapeHtml(user[name])}">
      <span class="error">${escapeHtml(message)}</span>
    </div>`;
}

// Shared by the "new" and the "edit" view
module.exports = function userForm({ action, user = {}, errors = {}, hiddenId = "" }) {
    return `<form method="post" action="${action}">
${hiddenId ? `    <input type="hidden" name="id" value="${escapeHtml(hiddenId)}">\n` : ""}${field("firstname", "Firstname", user, errors)}
${field("lastname", "Lastname", user, errors)}
${field("login", "Login", user, errors)}
${field("password", "Password", user, errors)}
    <input type="submit" value="Save">
  </form>`;
};
