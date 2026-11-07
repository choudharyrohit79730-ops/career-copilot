// LocalStorage se data load karo ya empty array rakho
let internships = JSON.parse(localStorage.getItem("internships")) || [];

// Data save karne ka function
function saveData() {
  localStorage.setItem("internships", JSON.stringify(internships));
  updateStats();
}

// Dashboard stats update karne ka function
function updateStats() {
  const totalAppsElem = document.getElementById("total-applications") || document.querySelector(".applications-count");
  if (totalAppsElem) {
    totalAppsElem.innerText = internships.length;
  }
}

// UI par internships render karne ka function
function renderInternships() {
  const internshipList = document.getElementById("internship-list") || document.querySelector("#internship-list");
  if (!internshipList) return;
  
  internshipList.innerHTML = "";

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
    // Yahan company name explicitly print karwa diya hai
    details.innerHTML = `
      <h4 style="margin: 0 0 4px 0; color: #fff; font-size: 16px;">🏢 Company: ${internship.company || 'N/A'}</h4>
      <p style="margin: 2px 0; color: #ccc; font-size: 14px;">Role: ${internship.role || 'N/A'}</p>
      <span style="display: inline-block; margin-top: 6px; font-size: 11px; background: #007acc; color: #fff; padding: 3px 8px; border-radius: 4px;">Status: ${internship.status || 'Wishlist'}</span>
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
    internshipList.appendChild(item);
  });

  updateStats();
}

// Form Submission Event Listener
document.addEventListener("DOMContentLoaded", () => {
  const internshipForm = document.querySelector("form") || document.getElementById("internship-form");

  if (internshipForm) {
    internshipForm.addEventListener("submit", function(event) {
      event.preventDefault();

      // Form ke saare input fields ko pakdo
      const inputs = internshipForm.querySelectorAll("input");
      const select = internshipForm.querySelector("select");

      // Pehla input Company name aur dusra Job role ke liye fix kiya
      let company = inputs[0] ? inputs[0].value.trim() : "";
      let role = inputs[1] ? inputs[1].value.trim() : "";
      let status = select ? select.value : "Wishlist";

      // Agar pehla input khali hai toh placeholder ya type se dhoondo
      inputs.forEach(input => {
        if (input.placeholder && input.placeholder.toLowerCase().includes("company")) {
          company = input.value.trim();
        }
        if (input.placeholder && input.placeholder.toLowerCase().includes("role")) {
          role = input.value.trim();
        }
      });

      if (!company) company = "Target Company";
      if (!role) role = "Developer Intern";

      const newInternship = { company, role, status };
      internships.push(newInternship);

      saveData();
      renderInternships();

      internshipForm.reset();
    });
  }

  renderInternships();
});