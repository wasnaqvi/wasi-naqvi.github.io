# Wasi Naqvi — GitHub Pages Site

This repository is a **GitHub User Pages** site.

## Live site
Once Pages is enabled and built, the site is available at:

- https://wasi-naqvi.github.io/

## Deployment checklist (GitHub)
1. Go to **Repository → Settings → Pages**.
2. Under **Build and deployment**, set:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or your default branch)
   - **Folder:** `/ (root)`
3. Save and wait for the Pages build to complete.
4. Check **Actions** if the deployment fails.

## Local preview (quick)
From this repository folder:

```bash
python3 -m http.server 8000
```

Then open:

- http://127.0.0.1:8000/

> Note: this is a static preview server. GitHub runs the real Jekyll build.
