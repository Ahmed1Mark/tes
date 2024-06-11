module.exports = {
    name: 'test-welcome',
    description: 'Simulate a new member joining the guild.',
    async execute(interaction) {
        // Check if the user has ADMINISTRATOR permission
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });
        }

        // Emit the guildMemberAdd event with the interaction's member
        interaction.client.emit('guildMemberAdd', interaction.member);

        interaction.reply({ content: 'Simulated a new member joining the guild!', ephemeral: true });
    },
};
