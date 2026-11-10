# Elsewhere — a little field guide

A dependency-free, single-page parallax scrolling experience built with semantic HTML, CSS transforms, and browser-native JavaScript.

## Run locally

```sh
node server.mjs
```

Open `http://localhost:3000`. The website source and route manifest are in `public/`; `server.mjs` serves that directory and uses the `PORT` environment variable when supplied. For a static host, publish the contents of `public/` as the site root.

The three scene images use the project's managed `/manus-storage/` asset URLs so the hosted Preview and published site can serve them. If you move this code to a different host, download or replace those three image URLs before publishing there.
