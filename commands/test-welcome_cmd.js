module.exports = {
    name: 'test-welcome',
    description: 'Simulate a new member joining the guild.',
    async execute(message, args) {
        // Check if the user has ADMINISTRATOR permission
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply({ content: 'You do not have permission to use this command!', ephemeral: true });
        }

        // Emit the guildMemberAdd event with the interaction's member
        message.client.emit('guildMemberAdd', message.member);

        message.reply({ content: 'Simulated a new member joining the guild!', ephemeral: true });
    },
};
