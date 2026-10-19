# Eru Portfolio

The site supports Russian and English. Page translations are stored in
`translations/ru.json` and `translations/en.json`.

The language loader requests the JSON files without using the browser cache,
so updated translations are picked up on the next page load. When changing
`language.js`, increment the `v` query parameter on its script tags in each
HTML page to avoid serving a cached copy of the script.

Because the language switch loads JSON with `fetch`, open the site through a
local web server instead of opening an HTML file directly. In VS Code, use the
Live Server extension, or run `python -m http.server` from the project folder
and open `http://localhost:8000`.
