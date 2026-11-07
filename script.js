// LocalStorage se data load karo
let internships = JSON.parse(localStorage.getItem("internships")) || [];

function saveData() {
  localStorage.setItem("internships", JSON.stringify(internships));
}

function renderInternships() {
  const internshipList = document.getElementById("internship-list") || document.querySelector(".internship-list");
  if (!internshipList) return;
  
  internshipList.innerHTML = "";

  internships.forEach((internship, index) => {
    const item = document.createElement("div");
    item.className = "internship-card";
    item.style.border = "1px solid #444";
    item.style.padding = "12px";
    item.style.marginBottom = "10px";
    item.style.borderRadius = "8px";
    item.style.display = "flex";
    item.style.justifyContent = "space-between";
    item.style.alignItems = "center";
    item.style.background = "#1a1a1a";

    const details = document.createElement("div");
    details.innerHTML = `
      <h4 style="margin: 0 0 4px 0; color: #fff; font-size: 15px;">🏢 Company: ${internship.company}</h4>
      <p style="margin: 2px 0; color: #ccc; font-size: 13px;">Role: ${internship.role}</p>
      <span style="display: inline-block; margin-top: 6px; font-size: 11px; background: #007acc; color: #fff; padding: 2px 8px; border-radius: 4px;">Status: ${internship.status}</span>
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

document.addEventListener("DOMContentLoaded", () => {
  const internshipForm = document.querySelector("form") || document.getElementById("internship-form");

  if (internshipForm) {
    // Sabhi buttons par rok laga do taaki page upar jump na kare
    const buttons = internshipForm.querySelectorAll("button");
    buttons.forEach(btn => {
      btn.type = "button"; // Isse form submit hone ki bimaari khatam ho jayegi
      btn.addEventListener("click", function(e) {
        e.preventDefault();

        const inputs = internshipForm.querySelectorAll("input");
        const select = internshipForm.querySelector("select");

        let company = inputs[0] ? inputs[0].value.trim() : "";
        let role = inputs[1] ? inputs[1].value.trim() : "";
        let status = select ? select.value : "Wishlist";

        if (!company || !role) {
          alert("Please fill Company name and Role!");
          return;
        }

        internships.push({ company, role, status });
        saveData();
        renderInternships();
        internshipForm.reset();
      });
    });
  }

  renderInternships();
});