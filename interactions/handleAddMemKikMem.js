// interactions/addmem_kikmem.js

// Import necessary libraries
const { MessageActionRow, MessageButton } = require('discord.js');

// Function to handle the addmem_kikmem interaction
async function handleAddMemKikMem(interaction, hasClaimPermission) {
    if (!hasClaimPermission(interaction.member)) {
        await interaction.reply({ content: 'You do not have the authority to perform this action', ephemeral: true });
        return;
    }
    // Send a message to specify the desired action
    await interaction.reply({
        content: 'Select the desired action', ephemeral: true,
        components: [
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('remove-mem-button').setLabel('Remove Member').setStyle('DANGER'),
                new MessageButton().setCustomId('add_member').setLabel('Add Member').setStyle('SECONDARY')
            )
        ]
    });
}

// Export the function to handle the addmem_kikmem interaction
module.exports = {
    handleAddMemKikMem
};
