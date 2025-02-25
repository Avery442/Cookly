const ollama = require('ollama').default;

async function AskFollowUp(messages) {
    return new Promise(async (resolve, reject) => {
        try {
            let serverMessagesProcessed = [
                {
                    "role" : "system",
                    "content" : "You are an follow up agent, your name is Cookly Follow Up 'Dale'. You will be given a recipe and you will follow up what the user requests. Do NOTHING else."
                }
            ]

            // Ensure 'messages' is an array, where each element is a message object
            if (!Array.isArray(messages)) {
                return reject("Messages should be an array.");
            }

            // Start a chat with the Ollama model
            const chat = await ollama.chat({
                model: "llama3.2",
                messages: messages // Pass the entire conversation history
            });

            const chat_title = await ollama.chat({
                model: "llama3.2",
                messages: [
                    {
                        "role" : "system",
                        "content" : "Your job is to create a response header such as 'Here you go!', 'Hmm, heres how I can help.', responses like that. The user will provide you with a chat for you to create a header for. Please try to keep them shorter than 15 words. YOU DO THIS AND NOTHING ELSE"
                    },
                    {
                        "role" : "user",
                        "content" : chat.message.content
                    }
                ]
            }) 

            // Resolve with the response from the assistant
            resolve({
                "response_content" : chat.message.content,
                "response_title" : chat_title.message.content
            });
        } catch (error) {
            // Handle any errors
            reject(error);
        }
    });
}

module.exports = {
    AskFollowUp
};
