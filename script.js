const chatSendBtn = document.getElementById('chat-submit');
const chatInput = document.getElementById('chat-input');
const modelSelect = document.getElementById('model-select');

chatInput.addEventListener('change', (e) => {
    if (chatInput.length != 0) {
        chatSendBtn.classList.add('active');
    } else {
        chatSendBtn.classList.remove('active');
    }
})

chatSendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (chatInput.length != 0) {
        window.claude.send(chatInput.value, modelSelect.value);
    }
})