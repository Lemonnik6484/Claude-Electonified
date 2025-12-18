const settingsBtn = document.getElementById('settings-btn');

function createDialog(title, html) {
    const dialog = document.createElement("dialog");
    dialog.className = "dialog";
    dialog.setAttribute("closedby", "any");
    dialog.innerHTML = `
        <h2 class="dialog-title">${title}</h2>
        ${html}
    `;

    dialog.addEventListener("cancel", (e) => {
        e.preventDefault();
        dialog.classList.add("closing");

        setTimeout(() => {
            dialog.close();
            dialog.classList.remove("closing");
        }, 300);
    });

    return dialog;
}

function showNotification(message, type = "success", timeout = 3000) {
    let container = document.querySelector(".notification-container");

    if (!container) {
        container = document.createElement("div");
        container.className = "notification-container";
        document.body.appendChild(container);
    }

    const notif = document.createElement("div");
    notif.classList.add("notification", type);
    notif.textContent = message;

    container.appendChild(notif);

    requestAnimationFrame(() => {
        notif.classList.add("show");
    });

    const removeNotif = () => {
        notif.classList.remove("show");
        notif.addEventListener("transitionend", () => notif.remove(), { once: true });
    };

    if (timeout > 0) {
        setTimeout(removeNotif, timeout);
    }

    notif.addEventListener("click", removeNotif);
}

settingsBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const settingsDialogHTML = `
        <form id="settings-form">
            <section class="settings-section" id="settings-key">
                <p class="setting-desc">Claude API Key:</p>
                <div class="setting-inputs">
                    <input type="password" class="settings-input" id="settings-key" placeholder="sk-ant-...">
                    <button id="settings-save">Save</button>
                </div>
            </section>            
        </form>
    `;

    const settingsDialog = createDialog("Settings", settingsDialogHTML);

    document.body.appendChild(settingsDialog);
    settingsDialog.showModal();

    requestAnimationFrame(() => {
        dialog.classList.remove("closing");
    });

    const settingsForm = settingsDialog.querySelector("#settings-form");
    const settingsKeyInput = settingsDialog.querySelector("#settings-key");
    window.storage.loadKey().then(key => {
        settingsKeyInput.value = key ?? "";
    });

    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const apiKey = settingsKeyInput.value.trim();

        if (apiKey && !/^sk-ant-[A-Za-z0-9_-]{20,}$/.test(apiKey)) {
            showNotification("Invalid API key", "error");
        } else if (!apiKey) {
            window.storage.clearKey();
            showNotification("API key was removed", "warn");
        } else if (apiKey && /^sk-ant-[A-Za-z0-9_-]{20,}$/.test(apiKey)) {
            window.storage.saveKey(apiKey);
            showNotification("API key was saved", "success");
        }
    });

    settingsDialog.addEventListener('close', () => {
        settingsDialog.remove();
    })
})