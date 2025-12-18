const settingsBtn = document.getElementById('settings-btn');
const settingsDialog = document.getElementById('settings-dialog');

const settingsForm = document.getElementById("settings-form");
const settingsKeyInput = document.getElementById("settings-key");

function showNotification(message, type = "success", timeout = 3000) {
    const notif = document.createElement("div");
    notif.classList.add("notification", type);
    notif.textContent = message;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, timeout);
}


settingsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    settingsDialog.showModal();
})

settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const apiKey = settingsKeyInput.value.trim();

    if (!apiKey || !/^sk-ant-[A-Za-z0-9_-]{20,}$/.test(apiKey)) {
        showNotification("Invalid API key", "error");
        return;
    } else {
        showNotification("API key saved successfully", "success");
        return;
    }
});