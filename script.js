// LocalStorage se data load karo ya empty array rakho
let internships = JSON.parse(localStorage.getItem("internships")) || [];

// DOM elements pick karo
const internshipForm = document.getElementById("internship-form");
const internshipList = document.getElementById("internship-list");
const totalAppsElem = document.getElementById("total-applications");

// Data save karne ke liye function
function saveData() {
  localStorage.setItem("internships", JSON.stringify(internships));
  updateStats();
}

// Dashboard stats update karne ka function
function updateStats() {
  if (totalAppsElem) {
    totalAppsElem.innerText = internships.length;
  }
}

// UI par internships render (show) karne ka function
function renderInternships() {
  if (!internshipList) return;
  
  internshipList.innerHTML = "";

  internships.forEach((internship, index) => {
    const item = document.createElement("div");
    item.className = "internship-card";
    item.style.border = "1px solid #333";
    item.style.padding = "10px";
    item.style.marginBottom = "10px";
    item.style.borderRadius = "8px";
    item.style.display = "flex";
    item.style.justifyContent = "space-between";
    item.style.alignItems = "center";

    const details = document.createElement("div");
    details.innerHTML = `
      <h4 style="margin: 0; color: #fff;">${internship.company}</h4>
      <p style="margin: 4px 0; color: #aaa;">Role: ${internship.role}</p>
      <span style="font-size: 12px; background: #007acc; color: #fff; padding: 2px 6px; border-radius: 4px;">${internship.status}</span>
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.style.background = "#ff4d4d";
    deleteBtn.style.color = "#fff";
    deleteBtn.style.border = "none";
    deleteBtn.style.padding = "6px 10px";
    deleteBtn.style.borderRadius = "4px";
    deleteBtn.style.cursor = "pointer";

    deleteBtn.addEventListener("click", function() {
      internships.splice(index, 1);
      saveData();
      renderInternships();
    });

    item.appendChild(details);
    item.appendChild(deleteBtn);
    internshipList.appendChild(item);
  });

  updateStats();
}

// Form Submission Event Listener
if (internshipForm) {
  internshipForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const company = document.getElementById("company") ? document.getElementById("company").value.trim() : "";
    const role = document.getElementById("role") ? document.getElementById("role").value.trim() : "";
    const status = document.getElementById("application-status") ? document.getElementById("application-status").value : "Applied";

    if (!company || !role) return;

    const newInternship = { company, role, status };
    internships.push(newInternship);

    saveData();
    renderInternships();

    internshipForm.reset();
  });
}

// Page load hone par sab initial render karo
document.addEventListener("DOMContentLoaded", () => {
  renderInternships();
});