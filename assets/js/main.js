let currentLanguage = 'it'; // Default to 'it' as per html lang attribute

// Function to set the default language state
function setDefaultLanguage() {
    currentLanguage = 'it';
    const toggleButton = document.getElementById('languageToggle');
    if (toggleButton) { // Ensure button exists
        toggleButton.textContent = 'English';
    }

    document.querySelectorAll('.lang-en').forEach(el => { el.style.display = 'none'; });
    document.querySelectorAll('.lang-it').forEach(el => { el.style.display = 'block'; });
}

// Language toggle function
function toggleLanguage() {
    const toggleButton = document.getElementById('languageToggle');
    if (currentLanguage === 'it') {
        currentLanguage = 'en';
        if (toggleButton) {
            toggleButton.textContent = 'Italiano';
        }
        document.querySelectorAll('.lang-it').forEach(el => { el.style.display = 'none'; });
        document.querySelectorAll('.lang-en').forEach(el => { el.style.display = 'block'; });
    } else {
        currentLanguage = 'it';
        if (toggleButton) {
            toggleButton.textContent = 'English';
        }
        document.querySelectorAll('.lang-en').forEach(el => { el.style.display = 'none'; });
        document.querySelectorAll('.lang-it').forEach(el => { el.style.display = 'block'; });
    }
}

// Skill highlight logic (remains unchanged)
const skills = document.querySelectorAll('.skill');
skills.forEach(skill => {
    skill.addEventListener('mouseover', () => {
        skills.forEach(s => {
            if (s !== skill) {
                s.style.opacity = '0.5';
            }
        });
    });
    skill.addEventListener('mouseout', () => {
        skills.forEach(s => {
            s.style.opacity = '1';
        });
    });
});

// Collapsible section and initial language setup
document.addEventListener('DOMContentLoaded', function() {
    // Set default language after DOM is loaded
    setDefaultLanguage();

    const collapsibles = document.querySelectorAll('.section.collapsible');
    collapsibles.forEach(section => section.addEventListener('click', () => {
        section.classList.toggle('active');
    }));

    // Add event listener for the language toggle button
    const languageToggleButton = document.getElementById('languageToggle');
    if (languageToggleButton) {
        languageToggleButton.addEventListener('click', toggleLanguage);
    }
});
