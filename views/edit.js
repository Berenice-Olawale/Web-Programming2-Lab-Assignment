const layout = require("./layout");
const userForm = require("./userForm");

module.exports = function editView(user, errors = {}) {
    return layout("Update user", `<h2>Update user</h2>
  ${userForm({ action: "/update", user, errors, hiddenId: String(user._id) })}
  <p><a href="/">Back</a></p>`);
};
