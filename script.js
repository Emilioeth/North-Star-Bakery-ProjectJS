const products = [
    { id: "signature-loaf", name: "Signature Loaf" },
    { id: "whole-wheat", name: "Whole Wheat Bread" },
    { id: "baguette", name: "Baguette" },
    { id: "croissant", name: "Butter Croissant" },
    { id: "cinnamon-roll", name: "Cinnamon Roll" },
    { id: "cookie", name: "Chocolate Chip Cookie" },
    { id: "vanilla-cake", name: "Vanilla Cake" },
    { id: "chocolate-cake", name: "Chocolate Cake" },
    { id: "carrot-cake", name: "Carrot Cake" }
];

let favorites = [];
const storageKey = "northStarBakeryFavorites";
const favoritesSection = document.getElementById("favorites");
const requestForm = document.getElementById("request-form");

function loadFavorites() {
    const saved = localStorage.getItem(storageKey);

    if (saved !== null) {
        favorites = JSON.parse(saved);
    }
}

function saveFavorites() {
    localStorage.setItem(storageKey, JSON.stringify(favorites));
}

function updateFavorites() {
    const list = document.getElementById("favorites-list");
    list.replaceChildren();

    for (const product of products) {
        const saved = favorites.includes(product.id);
        const button = document.getElementById("save-" + product.id);

        button.textContent = saved ? "Remove favorite" : "Save favorite";
        button.setAttribute("aria-pressed", String(saved));
        button.setAttribute("aria-label", button.textContent + ": " + product.name);

        if (saved) {
            const item = document.createElement("li");
            item.textContent = product.name;
            list.appendChild(item);
        }
    }

    document.getElementById("favorites-status").textContent = favorites.length === 0
        ? "No favorites saved yet. Choose an item above to start your list."
        : "Saved favorites: " + favorites.length + ".";
}

function toggleFavorite(productId) {
    if (favorites.includes(productId)) {
        favorites = favorites.filter(id => id !== productId);
    } else {
        favorites.push(productId);
    }

    saveFavorites();
    updateFavorites();
}

function setupFavorites() {
    for (const product of products) {
        const item = document.getElementById(product.id);
        const button = document.createElement("button");
        button.type = "button";
        button.id = "save-" + product.id;
        button.className = "favorite-button";
        button.addEventListener("click", () => toggleFavorite(product.id));
        item.appendChild(button);
    }

    favoritesSection.hidden = false;
    loadFavorites();
    updateFavorites();
}

function validateField(field) {
    let message = "";
    const value = field.value.trim();

    if (field.id === "name" && value === "") {
        message = "Please enter your name.";
    } else if (field.id === "email") {
        if (value === "") {
            message = "Please enter your email address.";
        } else if (field.validity.typeMismatch) {
            message = "Please enter a valid email address, such as name@example.com.";
        }
    } else if (field.id === "request-type" && value === "") {
        message = "Please choose preorder or general question.";
    } else if (field.id === "details" && value === "") {
        message = "Please enter your item details or question.";
    }

    document.getElementById(field.id + "-error").textContent = message;
    field.setAttribute("aria-invalid", String(message !== ""));
    return message === "";
}

function submitRequest(event) {
    event.preventDefault();
    const fields = requestForm.querySelectorAll("[required]");
    const status = document.getElementById("form-status");
    let firstInvalidField = null;
    status.textContent = "";

    for (const field of fields) {
        if (!validateField(field) && firstInvalidField === null) {
            firstInvalidField = field;
        }
    }

    if (firstInvalidField !== null) {
        firstInvalidField.focus();
        return;
    }
}

function setupForm() {
    requestForm.noValidate = true;
    requestForm.addEventListener("submit", submitRequest);

    for (const field of requestForm.querySelectorAll("input, select, textarea")) {
        field.addEventListener("input", () => {
            document.getElementById("form-status").textContent = "";

            if (field.getAttribute("aria-invalid") === "true") {
                validateField(field);
            }
        });
    }
}

if (favoritesSection) {
    setupFavorites();
}

if (requestForm) {
    setupForm();
}
