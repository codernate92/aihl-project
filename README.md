# The AIHL Project

Static website for [www.aihlproject.org](https://www.aihlproject.org), published from `main` by GitHub Pages. No build step or external JavaScript dependencies.

## Preview

Run `python3 -m http.server 8766` in this directory and open http://127.0.0.1:8766/.

## Structure

- `index.html`: page content, research references, biographies, and metadata.
- `assets/site.css`: responsive styles; self-hosted DM Sans and Instrument Serif.
- `assets/site.js`: casebook, accessible tabs, navigation, and data rendering.
- `assets/content.js`: research data; the three hypothetical cases and their qualitative ratings.
- `assets/copy.json`: editorial source material retained for future revisions. HTML is the published copy.
- `assets/brand`: vector identity, favicon, and social-sharing artwork.
- `assets/art`: original editorial artwork for Article 13.
- `assets/people`: portraits extracted from the preceding website.

The scenarios are hypothetical. Ratings describe research judgments, not measured probabilities or legal findings. Preserve these qualifications when revising the data. Primary legal and MAESTRO sources are linked on the website.

Font licenses accompany the fonts in `assets/fonts`. Keep `CNAME` unchanged when deploying to the existing domain.
