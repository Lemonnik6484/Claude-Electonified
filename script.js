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

settingsBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const settingsDialogHTML = `
        <form id="settings-form">
            <section class="settings-section" id="settings-key">
                <p class="setting-desc">Claude API Key:</p>
                <div class="setting-inputs">
                    <input type="password" class="settings-input" id="settings-key-input" placeholder="sk-ant-..." required>
                    <button id="settings-save" class="no-select">Save</button>
                </div>
            </section>            
        </form>
    `;

    const settingsDialog = createDialog("Settings", settingsDialogHTML);

    document.body.appendChild(settingsDialog);
    settingsDialog.showModal();

    requestAnimationFrame(() => {
        settingsDialog.classList.remove("closing");
    });

    const settingsForm = settingsDialog.querySelector("#settings-form");
    const settingsKeyInput = settingsDialog.querySelector("#settings-key-input");
    window.storage.loadKey().then(key => {
        settingsKeyInput.value = key ?? "";
    });

    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const apiKey = settingsKeyInput.value.trim();
        const regex = /^sk-ant-[A-Za-z0-9_-]{20,}$/;

        if (!apiKey) {
            return;
        } else if (!regex.test(apiKey)) {
            settingsKeyInput.setCustomValidity(
                "Invalid API key format. Expected: sk-ant-..."
            );
            settingsKeyInput.reportValidity();
            return;
        } else if (regex.test(apiKey)) {
            window.storage.saveKey(apiKey);
        }

        settingsDialog.classList.add("success");
        setTimeout(() => {
            settingsDialog.classList.remove("success");
        }, 300);
    });

    settingsDialog.addEventListener('close', () => {
        settingsDialog.remove();
    });
});