// interactions/msg_sendcontrol.js

// Import necessary libraries
const { MessageActionRow, MessageButton } = require('discord.js');

// Function to handle the msg_sendcontrol interaction
async function handleMsgSendControl(interaction, hasClaimPermission) {
    if (!hasClaimPermission(interaction.member)) {
        await interaction.reply({ content: 'You do not have the authority to perform this action', ephemeral: true });
        return;
    }
    // Send a message to specify the desired action
    await interaction.reply({
        content: 'Select the desired action', ephemeral: true,
        components: [
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('sendowntick').setLabel('Send a message to the ticket owner').setStyle('SECONDARY'),
                new MessageButton().setCustomId('sendmemberid').setLabel('Send a message to a specific user').setStyle('SECONDARY')
            )
        ]
    });
}

// Export the function to handle the msg_sendcontrol interaction
module.exports = {
    handleMsgSendControl
};
