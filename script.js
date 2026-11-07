// LocalStorage se data load karo
let internships = JSON.parse(localStorage.getItem("internships")) || [];
let activeFilter = "All"; // Default filter

function saveData() {
  localStorage.setItem("internships", JSON.stringify(internships));
  updateDashboardStats();
}

// Dashboard par count update karne ka function
function updateDashboardStats() {
  const totalCountElem = document.getElementById("application-count") || document.getElementById("total-applications") || document.querySelector(".applications-count");
  const total = internships.length;
  if (totalCountElem) {
    totalCountElem.innerText = total;
  }
}

// Filter Buttons Render Karne Ka Function
function renderFilterButtons() {
  const listContainer = document.getElementById("internship-list");
  if (!listContainer) return;

  // Pehle se bane hue filter container ko check karo ya naya banao
  let filterContainer = document.getElementById("status-filter-container");
  if (!filterContainer) {
    filterContainer = document.createElement("div");
    filterContainer.id = "status-filter-container";
    filterContainer.style.marginBottom = "15px";
    filterContainer.style.display = "flex";
    filterContainer.style.gap = "8px";
    filterContainer.style.flexWrap = "wrap";
    listContainer.parentNode.insertBefore(filterContainer, listContainer);
  }

  const statuses = ["All", "Wishlist", "Applied", "Interview", "Offer", "Rejected"];
  filterContainer.innerHTML = "";

  statuses.forEach(status => {
    const btn = document.createElement("button");
    btn.innerText = status;
    btn.style.padding = "6px 12px";
    btn.style.borderRadius = "20px";
    btn.style.border = "1px solid #007acc";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "13px";
    btn.style.transition = "0.2s";

    if (activeFilter === status) {
      btn.style.background = "#007acc";
      btn.style.color = "#fff";
    } else {
      btn.style.background = "transparent";
      btn.style.color = "#ccc";
    }

    btn.addEventListener("click", () => {
      activeFilter = status;
      renderFilterButtons();
      renderInternships();
    });

    filterContainer.appendChild(btn);
  });
}

function renderInternships() {
  let listContainer = document.getElementById("internship-list");
  if (!listContainer) return;
  
  listContainer.innerHTML = "";

  // Filter ke hisab se data select karo
  const filteredList = activeFilter === "All" 
    ? internships 
    : internships.filter(item => item.status.toLowerCase() === activeFilter.toLowerCase());

  if (filteredList.length === 0) {
    listContainer.innerHTML = `<p style="color: #aaa; font-size: 14px; text-align: center; margin-top: 15px;">No applications found in '${activeFilter}'.</p>`;
    updateDashboardStats();
    return;
  }

  filteredList.forEach((internship) => {
    // Original index dhoondo delete karne ke liye
    const originalIndex = internships.indexOf(internship);

    const item = document.createElement("div");
    item.className = "internship-card";
    item.style.border = "1px solid #444";
    item.style.padding = "14px";
    item.style.marginBottom = "12px";
    item.style.borderRadius = "8px";
    item.style.display = "flex";
    item.style.justifyContent = "space-between";
    item.style.alignItems = "center";
    item.style.background = "#1a1a1a";

    const details = document.createElement("div");
    details.innerHTML = `
      <h4 style="margin: 0 0 4px 0; color: #fff; font-size: 16px;">🏢 Company: ${internship.company}</h4>
      <p style="margin: 2px 0; color: #ccc; font-size: 14px;">Role: ${internship.role}</p>
      <span style="display: inline-block; margin-top: 6px; font-size: 11px; background: #007acc; color: #fff; padding: 3px 8px; border-radius: 4px;">Status: ${internship.status}</span>
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.style.background = "#ff4d4d";
    deleteBtn.style.color = "#fff";
    deleteBtn.style.border = "none";
    deleteBtn.style.padding = "6px 12px";
    deleteBtn.style.borderRadius = "4px";
    deleteBtn.style.cursor = "pointer";

    deleteBtn.addEventListener("click", function() {
      internships.splice(originalIndex, 1);
      saveData();
      renderInternships();
    });

    item.appendChild(details);
    item.appendChild(deleteBtn);
    listContainer.appendChild(item);
  });

  updateDashboardStats();
}

// Button click par data add karne ka logic
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

      const newInternship = { company, role, status };
      internships.push(newInternship);

      saveData();
      renderFilterButtons();
      renderInternships();

      if (inputs[0]) inputs[0].value = "";
      if (inputs[1]) inputs[1].value = "";
    });
  }

  renderFilterButtons();
  renderInternships();
});