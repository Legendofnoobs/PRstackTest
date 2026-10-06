# PR Stack Test Sandbox

A sandbox project designed for practicing and exploring **Stacked Pull Requests** with Git and the **GitHub CLI (`gh`)**.

---

## 🛠 Prerequisites & Setup

### 1. GitHub CLI (`gh`)
The GitHub CLI is installed and ready. Verify your installation and authentication status:

```bash
gh --version
gh auth status
```

If not logged in, authenticate using:
```bash
gh auth login
```

---

## 🌐 StackFlow Web App

An interactive web application is included to help visualize stacked branches and generate exact `git` / `gh` CLI commands:

- [`index.html`](file:///c:/rashed_temp/projects/PRstackTest/index.html) - Application UI & Stack visualizer
- [`style.css`](file:///c:/rashed_temp/projects/PRstackTest/style.css) - Responsive dark/light theme styling
- [`app.js`](file:///c:/rashed_temp/projects/PRstackTest/app.js) - State management, stack nodes, and command generator

To run locally, you can open `index.html` directly in your browser or serve it using a local HTTP server:
```bash
# Using Python
python -m http.server 8000

# Using Node / npx
npx serve .
```

---

## 🚀 Recommended Workflow for Stacked PRs

Following the workspace git workflow policies:

### Step 1: Branch from `main`
```bash
git checkout main
git pull origin main
git checkout -b feat/web-scaffolding
```

### Step 2: Make Atomic Conventional Commits
```bash
git add .
git commit -m "feat(ui): add stack visualizer application"
```

### Step 3: Push and Open PR
```bash
git push -u origin feat/web-scaffolding

gh pr create \
  --base main \
  --head feat/web-scaffolding \
  --title "feat(ui): add stack visualizer application" \
  --body "Initial implementation of the PR stack visualizer app."
```

### Step 4: Merge via PR with Merge Commit (`--no-ff`)
```bash
gh pr merge feat/web-scaffolding --merge --delete-branch
git checkout main
git pull origin main
```
