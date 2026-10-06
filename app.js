// PR Stack Navigator Application

const defaultStack = [
  {
    id: "pr-1",
    branch: "feat/user-model",
    base: "main",
    title: "feat(user): define database model and validation schema",
    description: "Initial user schema with UUID, email validation, and timestamps.",
    status: "approved",
    reviewer: "@octocat",
    number: 101
  },
  {
    id: "pr-2",
    branch: "feat/auth-endpoints",
    base: "feat/user-model",
    title: "feat(auth): implement signup and login API endpoints",
    description: "JWT-based authentication handlers and bcrypt password hashing.",
    status: "review_needed",
    reviewer: "@monalisa",
    number: 102
  },
  {
    id: "pr-3",
    branch: "feat/auth-ui",
    base: "feat/auth-endpoints",
    title: "feat(ui): add responsive login and registration forms",
    description: "Client-side forms with real-time feedback and state persistence.",
    status: "in_progress",
    reviewer: "@hubot",
    number: 103
  }
];

class PRStackApp {
  constructor() {
    this.storageKey = "pr_stack_navigator_data";
    this.themeKey = "pr_stack_theme";
    this.prs = this.loadData();
    this.selectedPrId = this.prs.length > 0 ? this.prs[0].id : null;

    this.initElements();
    this.initEventListeners();
    this.initTheme();
    this.render();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Could not read from localStorage", e);
    }
    return JSON.parse(JSON.stringify(defaultStack));
  }

  saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.prs));
    } catch (e) {
      console.warn("Could not write to localStorage", e);
    }
  }

  initElements() {
    this.stackContainer = document.getElementById("stackContainer");
    this.totalPrsCount = document.getElementById("totalPrsCount");
    this.readyReviewCount = document.getElementById("readyReviewCount");
    this.readyMergeCount = document.getElementById("readyMergeCount");
    this.cliOutput = document.getElementById("cliOutput");

    // Modals
    this.prModal = document.getElementById("prModal");
    this.cheatsheetModal = document.getElementById("cheatsheetModal");
    this.prForm = document.getElementById("prForm");
    this.baseBranchSelect = document.getElementById("baseBranch");

    // Buttons
    this.newPrBtn = document.getElementById("newPrBtn");
    this.closeModalBtn = document.getElementById("closeModalBtn");
    this.cancelModalBtn = document.getElementById("cancelModalBtn");
    this.resetDemoBtn = document.getElementById("resetDemoBtn");
    this.themeToggleBtn = document.getElementById("themeToggleBtn");
    this.cliCheatsheetBtn = document.getElementById("cliCheatsheetBtn");
    this.closeCheatsheetBtn = document.getElementById("closeCheatsheetBtn");
    this.dismissCheatsheetBtn = document.getElementById("dismissCheatsheetBtn");
    this.copyCliBtn = document.getElementById("copyCliBtn");
  }

  initEventListeners() {
    this.newPrBtn.addEventListener("click", () => this.openAddModal());
    this.closeModalBtn.addEventListener("click", () => this.closeAddModal());
    this.cancelModalBtn.addEventListener("click", () => this.closeAddModal());
    this.prForm.addEventListener("submit", (e) => this.handleFormSubmit(e));

    this.cliCheatsheetBtn.addEventListener("click", () => this.openCheatsheet());
    this.closeCheatsheetBtn.addEventListener("click", () => this.closeCheatsheet());
    this.dismissCheatsheetBtn.addEventListener("click", () => this.closeCheatsheet());

    this.resetDemoBtn.addEventListener("click", () => {
      this.prs = JSON.parse(JSON.stringify(defaultStack));
      this.selectedPrId = this.prs[0].id;
      this.saveData();
      this.render();
    });

    this.themeToggleBtn.addEventListener("click", () => this.toggleTheme());
    this.copyCliBtn.addEventListener("click", () => this.copyCommands());

    // Close modal on click outside
    window.addEventListener("click", (e) => {
      if (e.target === this.prModal) this.closeAddModal();
      if (e.target === this.cheatsheetModal) this.closeCheatsheet();
    });
  }

  initTheme() {
    const savedTheme = localStorage.getItem(this.themeKey) || "dark";
    document.body.setAttribute("data-theme", savedTheme);
    this.updateThemeIcon(savedTheme);
  }

  toggleTheme() {
    const current = document.body.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    document.body.setAttribute("data-theme", next);
    localStorage.setItem(this.themeKey, next);
    this.updateThemeIcon(next);
  }

  updateThemeIcon(theme) {
    const icon = this.themeToggleBtn.querySelector(".theme-icon");
    if (icon) {
      icon.textContent = theme === "light" ? "☀️" : "🌙";
    }
  }

  openAddModal() {
    this.populateBaseSelect();
    this.prForm.reset();
    this.prModal.style.display = "flex";
  }

  closeAddModal() {
    this.prModal.style.display = "none";
  }

  openCheatsheet() {
    this.cheatsheetModal.style.display = "flex";
  }

  closeCheatsheet() {
    this.cheatsheetModal.style.display = "none";
  }

  populateBaseSelect() {
    this.baseBranchSelect.innerHTML = '<option value="main">main (Root base)</option>';
    this.prs.forEach((pr) => {
      const opt = document.createElement("option");
      opt.value = pr.branch;
      opt.textContent = `${pr.branch} (#${pr.number || "new"})`;
      this.baseBranchSelect.appendChild(opt);
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const branch = document.getElementById("branchName").value.trim();
    const base = document.getElementById("baseBranch").value;
    const title = document.getElementById("prTitle").value.trim();
    const description = document.getElementById("prDescription").value.trim();
    const status = document.getElementById("prStatus").value;
    const reviewer = document.getElementById("prReviewer").value.trim() || "@teammate";

    const newPr = {
      id: "pr-" + Date.now(),
      branch,
      base,
      title,
      description,
      status,
      reviewer,
      number: 100 + this.prs.length + 1
    };

    this.prs.push(newPr);
    this.selectedPrId = newPr.id;
    this.saveData();
    this.closeAddModal();
    this.render();
  }

  deletePr(id, e) {
    e.stopPropagation();
    if (confirm("Remove this PR from your stack?")) {
      this.prs = this.prs.filter((p) => p.id !== id);
      if (this.selectedPrId === id) {
        this.selectedPrId = this.prs.length > 0 ? this.prs[0].id : null;
      }
      this.saveData();
      this.render();
    }
  }

  changeStatus(id, newStatus, e) {
    e.stopPropagation();
    const pr = this.prs.find((p) => p.id === id);
    if (pr) {
      pr.status = newStatus;
      this.saveData();
      this.render();
    }
  }

  selectPr(id) {
    this.selectedPrId = id;
    this.render();
  }

  getStatusBadge(status) {
    const labels = {
      in_progress: "In Progress",
      review_needed: "Needs Review",
      approved: "Approved",
      merged: "Merged"
    };
    return `<span class="badge badge-status-${status}">${labels[status] || status}</span>`;
  }

  updateStats() {
    this.totalPrsCount.textContent = this.prs.length;
    const reviewNeeded = this.prs.filter((p) => p.status === "review_needed").length;
    const approved = this.prs.filter((p) => p.status === "approved").length;

    this.readyReviewCount.textContent = reviewNeeded;
    this.readyMergeCount.textContent = approved;
  }

  generateCliCommands(pr) {
    if (!pr) {
      return "# No PR selected. Click on a stacked PR card to generate CLI instructions.";
    }

    return `# ========================================================
# Git & GitHub CLI Commands for [${pr.branch}]
# Base branch: ${pr.base}
# Title: "${pr.title}"
# ========================================================

# 1. Checkout and switch to your feature branch
git checkout -b ${pr.branch}

# 2. Stage changes and make an atomic conventional commit
git add .
git commit -m "${pr.title}"

# 3. Push branch to remote
git push -u origin ${pr.branch}

# 4. Open Pull Request via GitHub CLI targeting ${pr.base}
gh pr create \\
  --base ${pr.base} \\
  --head ${pr.branch} \\
  --title "${pr.title}" \\
  --body "${pr.description || 'Changes for ' + pr.branch}"

# 5. Review PR status via CLI
gh pr status
gh pr checks

# 6. When approved, merge with merge commit (--no-ff) and clean up
gh pr merge ${pr.branch} --merge --delete-branch
git checkout main
git pull origin main`;
  }

  copyCommands() {
    const code = this.cliOutput.textContent;
    navigator.clipboard.writeText(code).then(() => {
      const originalText = this.copyCliBtn.textContent;
      this.copyCliBtn.textContent = "Copied!";
      setTimeout(() => {
        this.copyCliBtn.textContent = originalText;
      }, 2000);
    });
  }

  render() {
    this.updateStats();

    // Render stack list
    this.stackContainer.innerHTML = "";

    // Base main node
    const baseNode = document.createElement("div");
    baseNode.className = "stack-node is-base";
    baseNode.innerHTML = `
      <div class="node-left">
        <div class="node-title-row">
          <span class="node-title">Stack Anchor (Production Base)</span>
          <span class="branch-tag">main</span>
        </div>
        <div class="node-meta">
          <span>Target baseline for all feature branches</span>
        </div>
      </div>
      <div class="node-right">
        <span class="badge badge-accent">Base Branch</span>
      </div>
    `;
    this.stackContainer.appendChild(baseNode);

    // Render PR layers
    this.prs.forEach((pr, index) => {
      const isSelected = pr.id === this.selectedPrId;
      const card = document.createElement("div");
      card.className = `stack-node ${isSelected ? "is-active" : ""}`;
      card.addEventListener("click", () => this.selectPr(pr.id));

      card.innerHTML = `
        <div class="connector-line"></div>
        <div class="node-left">
          <div class="node-title-row">
            <span class="node-title">#${pr.number || index + 1} ${pr.title}</span>
            <span class="branch-tag">${pr.branch}</span>
            ${this.getStatusBadge(pr.status)}
          </div>
          <div class="node-meta">
            <span><strong>Base:</strong> <code>${pr.base}</code></span>
            <span><strong>Reviewer:</strong> ${pr.reviewer}</span>
            <span>${pr.description || "No description"}</span>
          </div>
        </div>
        <div class="node-right">
          <select class="btn btn-xs btn-outline" onchange="window.app.changeStatus('${pr.id}', this.value, event)">
            <option value="in_progress" ${pr.status === "in_progress" ? "selected" : ""}>In Progress</option>
            <option value="review_needed" ${pr.status === "review_needed" ? "selected" : ""}>Review Needed</option>
            <option value="approved" ${pr.status === "approved" ? "selected" : ""}>Approved</option>
            <option value="merged" ${pr.status === "merged" ? "selected" : ""}>Merged</option>
          </select>
          <button class="btn btn-xs btn-ghost" onclick="window.app.deletePr('${pr.id}', event)" title="Delete PR">✕</button>
        </div>
      `;
      this.stackContainer.appendChild(card);
    });

    // Render Terminal output
    const activePr = this.prs.find((p) => p.id === this.selectedPrId) || this.prs[0];
    this.cliOutput.textContent = this.generateCliCommands(activePr);
  }
}

// Instantiate on load
document.addEventListener("DOMContentLoaded", () => {
  window.app = new PRStackApp();
});
