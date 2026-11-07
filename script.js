// LocalStorage se data load karo
let internships = JSON.parse(localStorage.getItem("internships")) || [];

// Data save karne ka function
function saveData() {
  localStorage.setItem("internships", JSON.stringify(internships));
}

// UI par internships render karne ka function
let internshipList = null;

function renderInternships() {
  if (!internshipList) {
    internshipList = document.getElementById("internship-list") || document.querySelector(".internship-list") || document.querySelector("#internships-list");
  }

  // Agar list container nahi mila, toh form ke neeche khud bana do
  const formElem = document.querySelector("form") || document.getElementById("internship-form");
  if (formElem && !document.getElementById("dynamic-internship-list")) {
    const listContainer = document.createElement("div");
    listContainer.id = "dynamic-internship-list";
    listContainer.style.marginTop = "20px";
    formElem.parentNode.appendChild(listContainer);
    internshipList = listContainer;
  }

  if (!internshipList) return;
  
  internshipList.innerHTML = "";

  if (internships.length === 0) {
    internshipList.innerHTML = `<p style="color: #aaa; font-size: 14px; text-align: center; margin-top: 10px;">No internships tracked yet.</p>`;
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
    internshipList.appendChild(item);
  });
}

// Add button click logic (No Page Refresh / No Jump)
document.addEventListener("DOMContentLoaded", () => {
  const internshipForm = document.querySelector("form") || document.getElementById("internship-form");
  const addBtn = document.querySelector("button[type='submit']") || document.querySelector("#add-btn") || (internshipForm ? internshipForm.querySelector("button") : null);

  if (internshipForm) {
    internshipForm.addEventListener("submit", function(e) {
      e.preventDefault(); // Form reload rokne ke liye
    });
  }

  if (addBtn) {
    addBtn.addEventListener("click", function(event) {
      event.preventDefault(); // Page upar jaane se rokne ke liye

      const inputs = internshipForm ? internshipForm.querySelectorAll("input") : document.querySelectorAll("input");
      const select = internshipForm ? internshipForm.querySelector("select") : document.querySelector("select");

      let company = inputs[0] ? inputs[0].value.trim() : "";
      let role = inputs[1] ? inputs[1].value.trim() : "";
      let status = select ? select.value : "Wishlist";

      inputs.forEach(input => {
        if (input.placeholder && input.placeholder.toLowerCase().includes("company")) {
          company = input.value.trim();
        }
        if (input.placeholder && input.placeholder.toLowerCase().includes("role")) {
          role = input.value.trim();
        }
      });

      if (!company || !role) {
        alert("Please fill in both Company name and Job role!");
        return;
      }

      const newInternship = { company, role, status };
      internships.push(newInternship);

      saveData();
      renderInternships();

      if (internshipForm) internshipForm.reset();
    });
  }

  renderInternships();
});