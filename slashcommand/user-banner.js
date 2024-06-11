module.exports = {
    name: 'user-banner',
    description: 'View the banner of a user.',
    options: [
        {
            name: 'target',
            description: 'Select the user whose banner you want to view',
            type: 'USER',
            required: false,
        },
    ],
    async execute(interaction) {
        let user = interaction.options.getUser('target');

        // If user is not specified, default to the user who invoked the command
        if (!user) {
            user = interaction.user;
        }

        // Fetch the user to ensure banner is available
        await user.fetch();

        const bannerURL = user.bannerURL({ dynamic: true, size: 4096 });

        if (!bannerURL) {
            return interaction.reply({ content: 'This user does not have a banner.', ephemeral: true });
        }

        return interaction.reply({ content: `Here is the banner for By One:`, files: [bannerURL] });
    },
};
