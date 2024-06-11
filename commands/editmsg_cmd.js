const {
    prefix,
} = require('../config.json');

module.exports = {
    name: 'edit-message',
    aliases: ['edit', 'edit-msg','e-msg','e-message'],
    description: 'Edit a message by its ID.',
    async execute(message, args) {
        // Check if the command starts with the prefix and is "edit"
        if (message.content.startsWith(prefix + "edit")) {
            // Split the content into arguments
            const args = message.content.slice(prefix.length + "edit".length).trim().split(' ');
            // Extract the message ID from the arguments
            const messageId = args.shift();
            // Join the remaining arguments to get the new content
            const newContent = args.join(' ');

            // Check if both message ID and new content are provided
            if (!messageId || !newContent) {
                const errorMessage = await message.reply("Please provide a message ID and the new content to edit! ⚠️");
                // Delete the error message after 5 seconds
                setTimeout(() => {
                    errorMessage.delete().catch(console.error);
                }, 5000);
                return;
            }

            try {
                // Fetch the message by its ID
                const fetchedMessage = await message.channel.messages.fetch(messageId);

                // Check if the message is fetched successfully
                if (fetchedMessage) {
                    // Edit the message with the new content
                    await fetchedMessage.edit(newContent);
                    const successMessage = await message.reply("Message edited successfully! ✅");
                    // Delete the success message after 5 seconds
                    setTimeout(() => {
                        successMessage.delete().catch(console.error);
                    }, 5000);
                } else {
                    const notFoundMessage = await message.reply("Message not found or unable to edit! ⚠️");
                    // Delete the not found message after 5 seconds
                    setTimeout(() => {
                        notFoundMessage.delete().catch(console.error);
                    }, 5000);
                }
            } catch (error) {
                console.error("Error editing message:", error);
                const errorMessage = await message.reply("An error occurred while editing the message! ⚠️");
                // Delete the error message after 5 seconds
                setTimeout(() => {
                    errorMessage.delete().catch(console.error);
                }, 5000);
            }
        }
    },
};
