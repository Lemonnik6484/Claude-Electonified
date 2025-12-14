const { contextBridge } = require('electron');
const Chat = require("./chat");

async function generate(prompt) {
    const anthropic = new Anthropic();

    const msg = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        messages: [
            {
                role: "user",
                content: "What should I search for to find the latest developments in renewable energy?"
            }
        ]
    });
    console.log(msg);
}

contextBridge.exposeInMainWorld("claude", {
    createChat: (prompt) => {
        const chat = Chat.create();
        chat.sendMessage(prompt);
    },

    sendMessage: async (chatId, prompt) => {
        const chat = Chat.load(chatId);
        if (!chat) throw new Error("Chat not found");

        return await chat.send(prompt);
    }
});
