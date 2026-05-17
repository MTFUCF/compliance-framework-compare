const DATA_URL = "./data/compliance-frameworks.json";
const THEME_KEY = "rey-theme-compliance-framework-compare";

const frameworkOrder = [
  "nist-csf-2.0",
  "iso-27001",
  "soc2-type2",
  "cis-controls-v8",
  "pci-dss-4.0",
  "hipaa",
];

const crosswalkFieldMap = {
  "nist-csf-2.0": "nist_csf",
  "iso-27001": "iso_27001",
  "soc2-type2": "soc2",
  "cis-controls-v8": "cis_controls",
  "pci-dss-4.0": "pci_dss",
  hipaa: "hipaa",
};

const state = {
  frameworks: [],
  mappings: [],
  activeTab: "overview",
  selectedDomain: "",
  visibleFrameworkIds: new Set(frameworkOrder),
};

document.addEventListener("DOMContentLoaded", async () => {
  setupTheme();
  wireControls();

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`Failed to load ${DATA_URL}`);
    }

    const data = await response.json();
    state.frameworks = frameworkOrder
      .map((frameworkId) => (data.frameworks || []).find((framework) => framework.id === frameworkId))
      .filter(Boolean);
    state.mappings = data.crosswalk?.mappings || [];
    state.selectedDomain = state.mappings[0]?.control_domain || "";

    render();
  } catch (error) {
    renderError(error);
  }
});

function setupTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY);
  const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(storedTheme || (preferredDark ? "dark" : "light"));

  document.querySelector("#theme-toggle")?.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  });
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  const toggle = document.querySelector("#theme-toggle");
  if (toggle) {
    toggle.textContent = theme === "dark" ? "Dark mode" : "Light mode";
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
  }
}

function wireControls() {
  document.querySelector(".tab-row")?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-tab]");
    if (!button) {
      return;
    }

    state.activeTab = button.dataset.tab;
    renderTabs();
  });

  document.querySelector("#framework-filters")?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-framework-id]");
    if (!button) {
      return;
    }

    const frameworkId = button.dataset.frameworkId;
    if (state.visibleFrameworkIds.has(frameworkId) && state.visibleFrameworkIds.size === 1) {
      return;
    }

    if (state.visibleFrameworkIds.has(frameworkId)) {
      state.visibleFrameworkIds.delete(frameworkId);
    } else {
      state.visibleFrameworkIds.add(frameworkId);
    }

    renderFilters();
    renderOverview();
    renderCrosswalk();
    renderControlArea();
  });

  document.querySelector("#domain-select")?.addEventListener("change", (event) => {
    state.selectedDomain = event.target.value;
    renderControlArea();
  });
}

function render() {
  renderFilters();
  renderTabs();
  renderOverview();
  renderCrosswalk();
  renderDomainSelect();
  renderControlArea();
}

function renderFilters() {
  const container = document.querySelector("#framework-filters");
  container.innerHTML = getVisibleFrameworks(false)
    .map((framework) => {
      const isVisible = state.visibleFrameworkIds.has(framework.id);
      return `
        <button
          class="chip ${isVisible ? "is-active" : ""}"
          type="button"
          data-framework-id="${framework.id}"
          aria-pressed="${String(isVisible)}"
        >
          ${framework.name}
        </button>
      `;
    })
    .join("");
}

function renderTabs() {
  document.querySelectorAll(".tab-button").forEach((button) => {
    const isActive = button.dataset.tab === state.activeTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  document.querySelectorAll(".view-panel").forEach((panel) => {
    panel.hidden = panel.id !== `panel-${state.activeTab}`;
  });
}

function renderOverview() {
  const container = document.querySelector("#overview-grid");
  const frameworks = getVisibleFrameworks();

  container.innerHTML = frameworks
    .map((framework) => {
      const strengths = framework.strengths.map((item) => `<li>${item}</li>`).join("");
      const weaknesses = framework.weaknesses.map((item) => `<li>${item}</li>`).join("");

      return `
        <article class="framework-card">
          <div class="card-header">
            <p class="card-version">${framework.version}</p>
            <h2>${framework.name}</h2>
            <p>${framework.description}</p>
          </div>
          <dl class="framework-meta">
            <div><dt>Governing body</dt><dd>${framework.governing_body}</dd></div>
            <div><dt>Primary audience</dt><dd>${framework.primary_audience}</dd></div>
            <div><dt>Structure</dt><dd>${framework.structure}</dd></div>
            <div><dt>When required</dt><dd>${framework.when_required}</dd></div>
          </dl>
          <div class="bullet-columns">
            <div>
              <h3>Strengths</h3>
              <ul>${strengths}</ul>
            </div>
            <div>
              <h3>Weaknesses</h3>
              <ul>${weaknesses}</ul>
            </div>
          </div>
          <a class="source-link" href="${framework.source_url}" target="_blank" rel="noreferrer">Official source →</a>
        </article>
      `;
    })
    .join("");
}

function renderCrosswalk() {
  const table = document.querySelector("#crosswalk-table");
  const frameworks = getVisibleFrameworks();

  table.innerHTML = `
    <thead>
      <tr>
        <th scope="col">Control area</th>
        ${frameworks.map((framework) => `<th scope="col">${framework.name}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${state.mappings
        .map((mapping) => {
          const cells = frameworks
            .map((framework) => {
              const fieldName = crosswalkFieldMap[framework.id];
              return `
                <td>
                  <a href="${framework.source_url}" target="_blank" rel="noreferrer">${mapping[fieldName] || "—"}</a>
                </td>
              `;
            })
            .join("");

          return `
            <tr>
              <th scope="row">${mapping.control_domain}</th>
              ${cells}
            </tr>
          `;
        })
        .join("")}
    </tbody>
  `;
}

function renderDomainSelect() {
  const select = document.querySelector("#domain-select");
  select.innerHTML = state.mappings
    .map((mapping) => `<option value="${mapping.control_domain}">${mapping.control_domain}</option>`)
    .join("");
  select.value = state.selectedDomain;
}

function renderControlArea() {
  const container = document.querySelector("#control-area-grid");
  const frameworks = getVisibleFrameworks();
  const mapping = state.mappings.find((item) => item.control_domain === state.selectedDomain);

  if (!mapping) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = frameworks
    .map((framework) => {
      const fieldName = crosswalkFieldMap[framework.id];
      return `
        <article class="control-card">
          <p class="card-version">${framework.version}</p>
          <h2>${framework.name}</h2>
          <p class="control-reference">${mapping[fieldName] || "No mapping listed in dataset."}</p>
          <p class="control-context">${framework.when_required}</p>
          <a class="source-link" href="${framework.source_url}" target="_blank" rel="noreferrer">Open source →</a>
        </article>
      `;
    })
    .join("");
}

function getVisibleFrameworks(visibleOnly = true) {
  const frameworks = state.frameworks.slice();
  return visibleOnly
    ? frameworks.filter((framework) => state.visibleFrameworkIds.has(framework.id))
    : frameworks;
}

function renderError(error) {
  document.querySelector("#overview-grid").innerHTML = `
    <article class="framework-card">
      <h2>Unable to load framework data</h2>
      <p>${error.message}</p>
    </article>
  `;
}
