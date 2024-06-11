module.exports = {
    name: 'say',
    description: 'Make the bot say something.',
    async execute(message, args) {
        // Check if there's any message provided
        if (!args.length) {
            return message.reply("Please provide me a message! ⚠️");
        }

        // Join the arguments into a single string
        const content = args.join(" ");

        // Send the provided message in the same channel
        message.channel.send(content);
    },
};
