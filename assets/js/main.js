const STORAGE_KEYS = {
    language: 'language',
    theme: 'theme'
};

function readPreference(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

function savePreference(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        // The page still works when storage is disabled.
    }
}

function setLanguage(language) {
    const selectedLanguage = language === 'en' ? 'en' : 'it';
    const languageToggle = document.getElementById('languageToggle');
    const isItalian = selectedLanguage === 'it';

    document.documentElement.lang = selectedLanguage;

    if (languageToggle) {
        const label = isItalian ? 'Switch to English' : 'Passa all\'italiano';
        languageToggle.textContent = isItalian ? 'EN' : 'IT';
        languageToggle.setAttribute('aria-label', label);
        languageToggle.title = label;
    }

    savePreference(STORAGE_KEYS.language, selectedLanguage);
}

function setTheme(theme) {
    const selectedTheme = theme === 'dark' ? 'dark' : 'light';
    const themeToggle = document.getElementById('themeToggle');
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const isDark = selectedTheme === 'dark';
    const language = document.documentElement.lang;

    document.documentElement.dataset.theme = selectedTheme;

    if (themeToggle) {
        const label = isDark
            ? (language === 'en' ? 'Enable light mode' : 'Attiva modalità chiara')
            : (language === 'en' ? 'Enable dark mode' : 'Attiva modalità scura');
        themeToggle.setAttribute('aria-label', label);
        themeToggle.title = label;
        themeToggle.setAttribute('aria-pressed', String(isDark));
    }

    if (themeColor) {
        themeColor.content = isDark ? '#111820' : '#ecf0f1';
    }

    savePreference(STORAGE_KEYS.theme, selectedTheme);
}

function toggleSection(section, expanded) {
    const header = section.querySelector('.section-header');
    const content = section.querySelector('.section-content');
    section.classList.toggle('active', expanded);
    header?.setAttribute('aria-expanded', String(expanded));
    if (content) {
        content.hidden = !expanded;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const initialLanguage = readPreference(STORAGE_KEYS.language) || 'it';
    const initialTheme = document.documentElement.dataset.theme || 'light';
    const languageToggle = document.getElementById('languageToggle');
    const themeToggle = document.getElementById('themeToggle');

    setLanguage(initialLanguage);
    setTheme(initialTheme);

    languageToggle?.addEventListener('click', () => {
        const nextLanguage = document.documentElement.lang === 'it' ? 'en' : 'it';
        setLanguage(nextLanguage);
        setTheme(document.documentElement.dataset.theme);
    });

    themeToggle?.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
    });

    document.querySelectorAll('.section.collapsible').forEach((section, index) => {
        const header = section.querySelector('.section-header');
        const content = section.querySelector('.section-content');

        if (!header || !content) {
            return;
        }

        const contentId = content.id || `section-content-${index + 1}`;
        content.id = contentId;
        header.tabIndex = 0;
        header.setAttribute('role', 'button');
        header.setAttribute('aria-controls', contentId);
        toggleSection(section, section.classList.contains('active'));

        const toggle = () => toggleSection(section, !section.classList.contains('active'));
        header.addEventListener('click', toggle);
        header.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggle();
            }
        });
    });

    document.querySelectorAll('.skill').forEach(skill => {
        skill.addEventListener('mouseenter', () => {
            document.querySelectorAll('.skill').forEach(item => {
                item.style.opacity = item === skill ? '1' : '0.5';
            });
        });
        skill.addEventListener('mouseleave', () => {
            document.querySelectorAll('.skill').forEach(item => {
                item.style.opacity = '1';
            });
        });
    });

    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.rel = 'noopener noreferrer';
    });

    const currentYear = document.getElementById('currentYear');
    if (currentYear) {
        currentYear.textContent = String(new Date().getFullYear());
    }
});
