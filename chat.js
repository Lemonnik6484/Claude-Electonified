const fs = require("fs");
const path = require("path");
const { Anthropic } = require("@anthropic-ai/sdk");

const HISTORY_PATH = path.join(__dirname, "history.json");

function loadHistory() {
    if (!fs.existsSync(HISTORY_PATH)) {
        fs.writeFileSync(HISTORY_PATH, JSON.stringify({}, null, 2));
    }
    return JSON.parse(fs.readFileSync(HISTORY_PATH, "utf8"));
}

function saveHistory(history) {
    fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2));
}

class Chat {
    constructor({
        id,
        title,
        model = "claude-sonnet-4-5",
        max_tokens = 1000,
        messages = []
    }) {
        this.id = id;
        this.title = title;
        this.model = model;
        this.max_tokens = max_tokens;
        this.messages = messages;

        this.anthropic = new Anthropic();
    }

    static load(chatId) {
        const history = loadHistory();
        if (!history[chatId]) return null;

        return new Chat({
            id: chatId,
            ...history[chatId]
        });
    }

    static create() {
        const id = Date.now().toString();
        const chat = new Chat({ id, title: "New Chat" });
        chat.save();
        return chat;
    }

    addMessage(role, content) {
        this.messages.push({ role, content });
        this.save();
    }

    async send(userPrompt) {
        this.addMessage("user", userPrompt);

        const response = await this.anthropic.messages.create({
            model: this.model,
            max_tokens: this.max_tokens,
            messages: this.messages
        });

        const reply = response.content[0].text;
        this.addMessage("assistant", reply);

        return reply;
    }

    save() {
        const history = loadHistory();
        history[this.id] = {
            model: this.model,
            max_tokens: this.max_tokens,
            title: this.title,
            messages: this.messages
        };
        saveHistory(history);
    }
}

module.exports = Chat;
