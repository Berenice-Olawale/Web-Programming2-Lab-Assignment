const layout = require("./layout");

module.exports = function notFoundView() {
    return layout("Not found", `<h2>Not found</h2>
  <p>The page or the user does not exist.</p>
  <p><a href="/">Back to the list</a></p>`);
};
