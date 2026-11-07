// LocalStorage se data load karo
let internships = JSON.parse(localStorage.getItem("internships")) || [];

function saveData() {
  localStorage.setItem("internships", JSON.stringify(internships));
  updateDashboardStats();
}

// Dashboard par count update karne ka function (HTML ke application-count ID ke sath matched)
function updateDashboardStats() {
  const totalCountElem = document.getElementById("application-count") || document.getElementById("total-applications") || document.querySelector(".applications-count");
  
  const total = internships.length;

  if (totalCountElem) {
    totalCountElem.innerText = total;
  }
}

function renderInternships() {
  let listContainer = document.getElementById("internship-list");
  if (!listContainer) return;
  
  listContainer.innerHTML = "";

  if (internships.length === 0) {
    listContainer.innerHTML = `<p style="color: #aaa; font-size: 14px; text-align: center; margin-top: 10px;">No internships tracked yet.</p>`;
    updateDashboardStats();
    return;
  }

  internships.forEach((internship, index) => {
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
      internships.splice(index, 1);
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

  const companyInput = document.getElementById("company");
  const roleInput = document.getElementById("role");
  const statusSelect = document.getElementById("application-status");

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
      renderInternships();

      if (inputs[0]) inputs[0].value = "";
      if (inputs[1]) inputs[1].value = "";
    });
  }

  renderInternships();
});