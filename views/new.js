const layout = require("./layout");
const userForm = require("./userForm");

module.exports = function newView(user = {}, errors = {}) {
    return layout("New user", `<h2>New user</h2>
  ${userForm({ action: "/insert", user, errors })}
  <p><a href="/">Back</a></p>`);
};
