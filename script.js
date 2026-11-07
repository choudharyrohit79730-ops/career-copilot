let internships = JSON.parse(localStorage.getItem("internships")) || [];
let activeFilter = "All";
let searchQuery = "";
let editingIndex = null;

function saveData() {
  localStorage.setItem("internships", JSON.stringify(internships));
  updateDashboardStats();
}

function updateDashboardStats() {
  const totalCountElem = document.getElementById("application-count") || document.getElementById("total-applications") || document.querySelector(".applications-count");
  const total = internships.length;
  if (totalCountElem) {
    totalCountElem.innerText = total;
  }
}

// Search Bar aur Filter Buttons Controls Setup
function setupControls() {
  const listContainer = document.getElementById("internship-list");
  if (!listContainer) return;

  let controlsWrapper = document.getElementById("controls-wrapper");
  if (!controlsWrapper) {
    controlsWrapper = document.createElement("div");
    controlsWrapper.id = "controls-wrapper";
    controlsWrapper.style.marginBottom = "16px";
    controlsWrapper.style.display = "flex";
    controlsWrapper.style.flexDirection = "column";
    controlsWrapper.style.gap = "12px";
    listContainer.parentNode.insertBefore(controlsWrapper, listContainer);
  }

  controlsWrapper.innerHTML = `
    <input type="text" id="search-input" placeholder="🔍 Search by company or role..." 
      style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #444; background: #121212; color: #fff; font-size: 14px; outline: none; box-sizing: border-box;">
    <div id="status-filter-container" style="display: flex; gap: 8px; flex-wrap: wrap;"></div>
  `;

  const searchInput = document.getElementById("search-input");
  searchInput.value = searchQuery;
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderInternships();
  });

  const filterContainer = document.getElementById("status-filter-container");
  const statuses = ["All", "Wishlist", "Applied", "Interview", "Offer", "Rejected"];

  statuses.forEach(status => {
    const btn = document.createElement("button");
    btn.innerText = status;
    btn.style.padding = "6px 14px";
    btn.style.borderRadius = "20px";
    btn.style.border = "1px solid #007acc";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "13px";
    btn.style.fontWeight = "500";
    btn.style.transition = "all 0.2s ease";

    if (activeFilter === status) {
      btn.style.background = "#007acc";
      btn.style.color = "#ffffff";
      btn.style.boxShadow = "0 2px 8px rgba(0, 122, 204, 0.4)";
    } else {
      btn.style.background = "rgba(255, 255, 255, 0.05)";
      btn.style.color = "#cccccc";
    }

    btn.addEventListener("click", () => {
      activeFilter = status;
      setupControls();
      renderInternships();
    });

    filterContainer.appendChild(btn);
  });
}

function renderInternships() {
  let listContainer = document.getElementById("internship-list");
  if (!listContainer) return;
  
  listContainer.innerHTML = "";

  // Dynamic Multi-filter: Status + Search Query
  const filteredList = internships.filter(item => {
    const matchesStatus = activeFilter === "All" || item.status.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = item.company.toLowerCase().includes(searchQuery) || item.role.toLowerCase().includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  if (filteredList.length === 0) {
    listContainer.innerHTML = `<p style="color: #888; font-size: 14px; text-align: center; margin: 20px 0;">No applications found matching your criteria.</p>`;
    updateDashboardStats();
    return;
  }

  filteredList.forEach((internship) => {
    const originalIndex = internships.indexOf(internship);

    const item = document.createElement("div");
    item.className = "internship-card";
    item.style.border = "1px solid #333";
    item.style.padding = "16px";
    item.style.marginBottom = "12px";
    item.style.borderRadius = "10px";
    item.style.display = "flex";
    item.style.justifyContent = "space-between";
    item.style.alignItems = "center";
    item.style.background = "#181818";

    const details = document.createElement("div");
    details.style.flex = "1";
    details.style.marginRight = "12px";
    details.innerHTML = `
      <h4 style="margin: 0 0 4px 0; color: #ffffff; font-size: 16px;">🏢 Company: ${internship.company}</h4>
      <p style="margin: 2px 0; color: #bbbbbb; font-size: 14px;">Role: ${internship.role}</p>
      <span style="display: inline-block; margin-top: 8px; font-size: 11px; background: #007acc; color: #ffffff; padding: 3px 10px; border-radius: 12px; font-weight: bold;">Status: ${internship.status}</span>
    `;

    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "8px";

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.style.background = "#e67e22";
    editBtn.style.color = "#ffffff";
    editBtn.style.border = "none";
    editBtn.style.padding = "6px 14px";
    editBtn.style.borderRadius = "6px";
    editBtn.style.cursor = "pointer";
    editBtn.style.fontSize = "13px";
    editBtn.style.fontWeight = "bold";

    editBtn.addEventListener("click", function() {
      const inputs = document.querySelectorAll("input");
      const select = document.querySelector("select");

      if (inputs.length >= 2) {
        inputs[0].value = internship.company;
        inputs[1].value = internship.role;
      }
      if (select) {
        select.value = internship.status;
      }

      editingIndex = originalIndex;

      const addBtn = Array.from(document.querySelectorAll("button")).find(el => el.innerText.includes("Add Application") || el.innerText.includes("Update"));
      if (addBtn) {
        addBtn.innerText = "Update Application";
        addBtn.style.background = "#27ae60";
      }
      
      window.scrollTo({ top: 300, behavior: 'smooth' });
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.style.background = "#e74c3c";
    deleteBtn.style.color = "#ffffff";
    deleteBtn.style.border = "none";
    deleteBtn.style.padding = "6px 14px";
    deleteBtn.style.borderRadius = "6px";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.fontSize = "13px";
    deleteBtn.style.fontWeight = "bold";

    deleteBtn.addEventListener("click", function() {
      internships.splice(originalIndex, 1);
      saveData();
      renderInternships();
    });

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);

    item.appendChild(details);
    item.appendChild(btnContainer);
    listContainer.appendChild(item);
  });

  updateDashboardStats();
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = Array.from(document.querySelectorAll("button")).find(el => el.innerText.includes("Add Application"));

  if (addBtn) {
    addBtn.addEventListener("click", function(e) {
      e.preventDefault();

      const trackerSection = addBtn.closest("article") || addBtn.parentElement;
      const inputs = trackerSection ? trackerSection.querySelectorAll("input") : document.querySelectorAll("input");
      const select = trackerSection ? trackerSection.querySelector("select") : document.querySelector("select");

      let company = "";
      let role = "";
      let status = select ? select.value : "Wishlist";

      if (inputs.length >= 2) {
        company = inputs[0].value.trim();
        role = inputs[1].value.trim();
      }

      if (!company || !role) {
        alert("Please fill in both Company name and Job role!");
        return;
      }

      if (editingIndex !== null) {
        internships[editingIndex] = { company, role, status };
        editingIndex = null;
        addBtn.innerText = "+ Add Application";
        addBtn.style.background = "";
      } else {
        const newInternship = { company, role, status };
        internships.push(newInternship);
      }

      saveData();
      renderInternships();

      if (inputs[0]) inputs[0].value = "";
      if (inputs[1]) inputs[1].value = "";
    });
  }

  setupControls();
  renderInternships();
});