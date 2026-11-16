const escapeHtml = require("./escape");

module.exports = function layout(title, body) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: system-ui, Arial, sans-serif; max-width: 820px; margin: 2rem auto; padding: 0 1rem; color: #222; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #bbb; padding: 6px 10px; text-align: left; }
  th { background: #f0f0f0; }
  .error { color: #c00; font-size: 0.9em; margin-left: 8px; }
  .row { margin-bottom: 10px; }
  label { display: inline-block; width: 100px; }
  input[type=text] { padding: 4px; width: 220px; }
  form.inline { display: inline; }
  button.link { background: none; border: none; color: #0645ad; cursor: pointer; padding: 0; font: inherit; text-decoration: underline; }
  .muted { color: #666; font-size: 0.9em; }
</style>
</head>
<body>
${body}
</body>
</html>`;
};
