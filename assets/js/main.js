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
    const backToTop = document.getElementById('backToTop');
    const isItalian = selectedLanguage === 'it';

    document.documentElement.lang = selectedLanguage;

    if (languageToggle) {
        const label = isItalian ? 'Switch to English' : 'Passa all\'italiano';
        languageToggle.textContent = isItalian ? 'EN' : 'IT';
        languageToggle.setAttribute('aria-label', label);
        languageToggle.title = label;
    }

    if (backToTop) {
        const label = isItalian ? 'Torna all\'inizio' : 'Back to top';
        backToTop.setAttribute('aria-label', label);
        backToTop.title = label;
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
    const toggleButton = section.querySelector('.section-toggle');
    const content = section.querySelector('.section-content');
    section.classList.toggle('active', expanded);
    toggleButton?.setAttribute('aria-expanded', String(expanded));
    if (content) {
        content.hidden = !expanded;
    }
}

function openSectionFromHash() {
    let targetId;
    try {
        targetId = decodeURIComponent(window.location.hash.slice(1));
    } catch (error) {
        return;
    }
    if (!targetId) return;

    const target = document.getElementById(targetId);
    const section = target?.closest('.section.collapsible');
    if (!section) return;

    toggleSection(section, true);
    window.requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
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
        const toggleButton = section.querySelector('.section-toggle');
        const content = section.querySelector('.section-content');

        if (!toggleButton || !content) {
            return;
        }

        const contentId = content.id || `section-content-${index + 1}`;
        content.id = contentId;
        toggleButton.setAttribute('aria-controls', contentId);
        toggleSection(section, section.classList.contains('active'));

        const toggle = () => toggleSection(section, !section.classList.contains('active'));
        toggleButton.addEventListener('click', toggle);
    });

    openSectionFromHash();
    window.addEventListener('hashchange', openSectionFromHash);

    const printImages = [];
    window.addEventListener('beforeprint', () => {
        document.querySelectorAll('img[loading="lazy"]').forEach(image => {
            printImages.push(image);
            image.loading = 'eager';
        });
    });
    window.addEventListener('afterprint', () => {
        printImages.splice(0).forEach(image => { image.loading = 'lazy'; });
    });

    const pageEndSentinel = document.getElementById('pageEndSentinel');
    const backToTop = document.getElementById('backToTop');
    if (pageEndSentinel && backToTop) {
        let isNearPageEnd = false;
        const updateBackToTopVisibility = () => {
            const hasScrollableContent = document.documentElement.scrollHeight > window.innerHeight + 20;
            const hasScrolled = window.scrollY > 120;
            backToTop.classList.toggle('is-visible', isNearPageEnd && hasScrollableContent && hasScrolled);
        };

        const endObserver = new IntersectionObserver(entries => {
            isNearPageEnd = entries[0].isIntersecting;
            updateBackToTopVisibility();
        }, { rootMargin: '0px 0px 35% 0px' });

        endObserver.observe(pageEndSentinel);
        window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
        window.addEventListener('resize', updateBackToTopVisibility);
    }

    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.rel = 'noopener noreferrer';
    });

    const currentYear = document.getElementById('currentYear');
    if (currentYear) {
        currentYear.textContent = String(new Date().getFullYear());
    }
});
