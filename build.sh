#!/bin/bash
# Builds Claudenspiel into one file, index.html, from src/. GitHub Pages serves that file from the main branch
# (https://bradfordbhill.github.io/claudenspiel/), so commit it after building.
set -e
cd "$(dirname "$0")"
{
cat <<'H'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Claudenspiel</title>
H
echo "<link rel=\"icon\" type=\"image/png\" href=\"data:image/png;base64,$(base64 -w0 assets/icon-64.png)\">"
echo "<link rel=\"apple-touch-icon\" href=\"data:image/png;base64,$(base64 -w0 assets/icon-192.png)\">"
cat <<'H'
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Tiny5&text=%E2%97%8F&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Jacquard+24&display=swap" rel="stylesheet">
<style>
H
echo ":root { --logo: url(data:image/png;base64,$(base64 -w0 assets/logo.png)); }"
cat src/style.css src/claudenspiel.css
echo '</style></head><body><div id="app"></div><script>'
cat src/data.js src/engine.js src/bots.js src/cardface.js src/cardart.js src/patchnotes.js src/deeds.js src/ui.js
echo '</script></body></html>'
} > index.html
echo "built index.html ($(wc -c < index.html) bytes)"
