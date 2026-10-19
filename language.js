const languageStorageKey = "portfolio-language";
const languageToggle = document.querySelector("[data-language-toggle]");

async function loadTranslations(language) {
    const url = new URL(`translations/${language}.json`, document.baseURI);
    url.searchParams.set("_", Date.now().toString());

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`Could not load ${language} translations: ${response.status}`);
    }

    return response.json();
}

function getTranslation(translations, key) {
    return key.split(".").reduce((value, part) => {
        if (value && typeof value === "object") {
            return value[part];
        }
        return undefined;
    }, translations);
}

async function applyLanguage(language) {
    const translations = await loadTranslations(language);
    const translatedElements = document.querySelectorAll("[data-i18n], [data-i18n-content], [data-i18n-alt], [data-i18n-aria-label]");
    for (const element of translatedElements) {
        for (const [keyAttribute, targetAttribute] of [
            ["data-i18n", "textContent"],
            ["data-i18n-content", "content"],
            ["data-i18n-alt", "alt"],
            ["data-i18n-aria-label", "aria-label"]
        ]) {
            const key = element.getAttribute(keyAttribute);
            if (!key) {
                continue;
            }

            const translation = getTranslation(translations, key);
            if (typeof translation !== "string") {
                throw new Error(`Missing "${key}" translation in ${language}.json`);
            }

            if (targetAttribute === "textContent") {
                element.textContent = translation;
            } else {
                element.setAttribute(targetAttribute, translation);
            }
        }
    }

    document.documentElement.lang = language;
    const switchLabelKey = language === "ru" ? "language.switchToEnglish" : "language.switchToRussian";
    languageToggle.setAttribute("aria-label", getTranslation(translations, switchLabelKey));
}

async function initializeLanguage() {
    const savedLanguage = localStorage.getItem(languageStorageKey);
    const initialLanguage = savedLanguage === "en" ? "en" : "ru";

    document.documentElement.lang = initialLanguage;
    await applyLanguage(initialLanguage);
    languageToggle.addEventListener("click", async () => {
        const nextLanguage = document.documentElement.lang === "ru" ? "en" : "ru";
        languageToggle.disabled = true;
        try {
            await applyLanguage(nextLanguage);
            localStorage.setItem(languageStorageKey, nextLanguage);
        } catch (error) {
            console.error("Could not change the page language.", error);
            window.alert("Не удалось переключить язык. Проверьте, что сайт открыт через локальный сервер.");
        } finally {
            languageToggle.disabled = false;
        }
    });
}

initializeLanguage().catch((error) => {
    console.error("Could not initialize page language.", error);
    const errorMessage = document.documentElement.lang === "en"
        ? "Could not load language files. Open the site through a local web server."
        : "Не удалось загрузить языковые файлы. Откройте сайт через локальный сервер.";
    window.alert(errorMessage);
});
