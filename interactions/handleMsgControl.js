// interactions/msg_control.js

const { MessageActionRow, MessageButton } = require('discord.js');

// Function to handle the msg_control interaction
async function handleMsgControl(interaction, hasClaimPermission) {
    if (!hasClaimPermission(interaction.member)) {
        await interaction.reply({ content: 'You do not have the authority to perform this action', ephemeral: true });
        return;
    }
    // Send a message to specify the desired action
    await interaction.reply({
        content: 'Select the desired action',
        ephemeral: true,
        components: [
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('sendowntick').setLabel('Send Message to Ticket Owner').setStyle('SECONDARY'),
                new MessageButton().setCustomId('sendmemberid').setLabel('Send Message to Specific User').setStyle('SECONDARY')
            ),
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('sendmsgpost').setLabel('Send Regular Message').setStyle('SECONDARY'),
                new MessageButton().setCustomId('sendmsgembed').setLabel('Send Message with Embed').setStyle('SECONDARY')
            ),
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('msgdeleted').setLabel('Delete Message').setStyle('DANGER'),
                new MessageButton().setCustomId('sendmsgdisabled').setLabel('Disable Ticket Message Sending').setStyle('DANGER')
            )
        ]
    });
}

// Export the function to handle the msg_control interaction
module.exports = {
    handleMsgControl
};
