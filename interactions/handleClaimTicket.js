const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');

// Function to handle the claim_ticket interaction
async function handleClaimTicket(interaction, hasClaimPermission) {
    // Check if the member has permission to claim
    const member = interaction.member;
    if (!hasClaimPermission(member)) {
        await interaction.reply({ content: 'You do not have the authority to take this action', ephemeral: true });
        return;
    }
    let currentTime = new Date();

    // إضافة ساعة واحدة
    currentTime.setHours(currentTime.getHours() + 1);

    // Get the user who clicked the button
    const claimTicket = interaction.user;
    const startTimestamp = Math.floor(Date.now() / 1000) - 35;
    const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
    const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });

    // Send a confirmation message in the chat
    // Send a confirmation message in the chat with embed
    const customEmbed  = new MessageEmbed()
        .setDescription(`> **<:arrow:1233807080796983376>Ticket Received By : ${claimTicket} <:mention:1235238066550079569>** \n > **<:arrow:1233807080796983376> Ticket Received Since : <t:${startTimestamp}:R> <:TIME:1230615425834811454>**`)
        .addFields(
            { name: 'Ticket Receipt Date', value: `**\`\`\`${egyptianDate}\`\`\`**`, inline: true },
            { name: 'Ticket Receipt Time', value: `**\`\`\`${egyptianDate2}\`\`\`**`, inline: true },
            { name: '\u2003', value: `\`\`\`diff\n!ㅤ✅ㅤSupport Is Available Nowㅤ✅ㅤ!\`\`\``, inline: false }
        );
    await interaction.channel.send({ embeds: [customEmbed ] });


    // Defer the interaction to prevent timeout
    await interaction.deferUpdate();

    // Send a confirmation message and edit the existing embed
    const embed = interaction.message.embeds[0];
    embed.fields.find(field => field.name === 'Claimed By').value = `${claimTicket}`; // Update the value of 'Ticket claimed By' field
    await interaction.editReply({ embeds: [embed], ephemeral: true });

    // Disable the claim button to prevent further claims
    const components = interaction.message.components; // Get existing components
    const rowIdx = components.findIndex(row => row.components.some(component => component.customId === 'claim_ticket')); // Find the row index containing the claim button
    if (rowIdx !== -1) {
        const row = components[rowIdx];
        const buttons = row.components.map(component => { // Map over components to update claim button
            if (component.customId === 'claim_ticket') {
                return new MessageButton()
                    .setCustomId('claim_ticket')
                    .setLabel('🛡️ Done Claimed')
                    .setStyle('SUCCESS') // Change button style to secondary (greyed out)
                    .setDisabled(true); // Disable the button
            } else {
                return component;
            }
        });
        components[rowIdx] = new MessageActionRow().addComponents(...buttons); // Create a new row with updated buttons
        await interaction.editReply({ components });
    }

    return;
}

// Export the function to handle claim_ticket interaction
module.exports = {
    handleClaimTicket
};
