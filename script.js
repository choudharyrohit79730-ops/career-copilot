const profileForm = document.getElementById("profile-form");
const internshipForm = document.getElementById("internship-form");
const profileMessage = document.getElementById("profile-message");
const skillResults = document.getElementById("skill-results");
const internshipList = document.getElementById("internship-list");

const skillCount = document.getElementById("skill-count");
const applicationCount = document.getElementById("application-count");

const requiredSkills = {
    "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Git"],
    "Backend Developer": ["Python", "SQL", "APIs", "Git", "Testing"],
    "Full Stack Developer": ["HTML", "CSS", "JavaScript", "React", "SQL", "APIs", "Git"],
    "AI/ML Engineer": ["Python", "SQL", "Statistics", "Machine Learning", "Git"],
    "Data Analyst": ["SQL", "Python", "Excel", "Statistics", "Data Visualization"]
};

let profile = JSON.parse(localStorage.getItem("careerProfile") || "null");
let internships = JSON.parse(localStorage.getItem("careerInternships") || "[]");

function saveData() {
    localStorage.setItem("careerProfile", JSON.stringify(profile));
    localStorage.setItem("careerInternships", JSON.stringify(internships));
}

function getSkills() {
    return (profile?.skills || "")
        .split(",")
        .map(skill => skill.trim())
        .filter(Boolean);
}

function renderProfile() {
    if (!profile) return;

    document.getElementById("student-name").value = profile.name || "";
    document.getElementById("career-goal").value = profile.goal || "";
    document.getElementById("skills").value = profile.skills || "";

    const badge = document.querySelector(".profile-badge");
    badge.textContent = (profile.name || "S").charAt(0).toUpperCase();

    profileMessage.textContent = `Welcome back, ${profile.name}! Your profile is saved on this browser.`;
    updateStats();
}

function updateStats() {
    skillCount.textContent = `${getSkills().length} skills`;
    applicationCount.textContent = internships.length;
}

profileForm.addEventListener("submit", function(event) {
    event.preventDefault();

    profile = {
        name: document.getElementById("student-name").value.trim(),
        goal: document.getElementById("career-goal").value,
        skills: document.getElementById("skills").value
    };

    saveData();
    renderProfile();

    profileMessage.textContent = "Profile saved successfully! Now analyze your skills.";
    skillResults.textContent = "Click 'Analyze My Skills' to compare your skills with your career goal.";
});

document.getElementById("analyze-button").addEventListener("click", function() {
    if (!profile || !profile.goal) {
        skillResults.textContent = "First, fill in your profile and save it with a career goal.";
        return;
    }

    const currentSkills = getSkills();
    const neededSkills = requiredSkills[profile.goal] || [];

    const hasSkill = required =>
        currentSkills.some(skill => skill.toLowerCase() === required.toLowerCase());

    const matched = neededSkills.filter(hasSkill);
    const missing = neededSkills.filter(skill => !hasSkill(skill));

    skillResults.innerHTML = `
        <h3>Skills for ${profile.goal}</h3>
        <p><strong>${matched.length} of ${neededSkills.length}</strong> suggested skills matched.</p>
        <p><strong>Skills you entered:</strong></p>
        <ul>${matched.length ? matched.map(skill => `<li>${skill} ✓</li>`).join("") : "<li>No matches yet. Keep learning!</li>"}</ul>
        <p><strong>Skills to explore next:</strong></p>
        <ul>${missing.length ? missing.map(skill => `<li>${skill}</li>`).join("") : "<li>You've listed all the suggested skills!</li>"}</ul>
        <p>This is a basic checklist, not an official job-readiness score.</p>
    `;
});

function renderInternships() {
    internshipList.replaceChildren();

    internships.forEach((internship, index) => {
        const item = document.createElement("div");
        item.className = "internship-item";

        const details = document.createElement("div");
        const company = document.createElement("strong");
        company.textContent = internship.company;

        const role = document.createElement("p");
        role.textContent = internship.role;

        const status = document.createElement("p");
        status.textContent = `Status: ${internship.status}`;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Remove";
        deleteButton.addEventListener("click", function() {
            internships.splice(index, 1);
            saveData();
            renderInternships();
        });

        details.append(company, role, status, deleteButton);
        item.append(details);
        internshipList.append(item);
    });

    updateStats();
}

internshipForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const company = document.getElementById("company").value.trim();
    const role = document.getElementById("role").value.trim();
    const status = document.getElementById("application-status").value;

    if (!company || !role) return;

    internships.push({ company, role, status });
    saveData();
    renderInternships();
    internshipForm.reset();
});

renderProfile();
renderInternships();