const { Modal, MessageActionRow, TextInputComponent, MessageEmbed } = require('discord.js');

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    try {
      if (interaction.isButton()) {
        if (interaction.customId === 'addnote-ticket-button') {
          // Check claim permission
          if (!hasClaimPermission(interaction.member)) {
            await interaction.reply({ content: 'You do not have the authority to perform this action', ephemeral: true });
            return;
          }

          // Show the modal window
          const modal = new Modal()
            .setCustomId('addnote-ticket-modal')
            .setTitle('Add Note')
            .addComponents([
              new MessageActionRow().addComponents(
                new TextInputComponent()
                  .setCustomId('addnote-ticket-input')
                  .setLabel('Please enter your note')
                  .setStyle('PARAGRAPH')
                  .setMinLength(1)
                  .setMaxLength(900)
                  .setPlaceholder('Write the note here')
                  .setRequired(true),
              ),
            ]);

          await interaction.showModal(modal);
        }
      }

      if (interaction.isModalSubmit()) {
        if (interaction.customId === 'addnote-ticket-modal') {
          const response = interaction.fields.getTextInputValue('addnote-ticket-input');

          // Check member permissions
          if (interaction.member.permissions.has('MANAGE_CHANNELS')) {
            // Create Embed and add the note
            const embed = interaction.message.embeds[0]; // Using the existing embed
            const startTimestamp = Math.floor(Date.now() / 1000) - 42;
            embed.addFields({ name: `Note Aded`, value: `**┕[ <@${interaction.member.id}> ] - [ <t:${startTimestamp}:R> ]┓**\n\`\`\`${response}\`\`\`` });

            await interaction.update({ embeds: [embed] }); // Update the message with the new embed only
            await interaction.followUp({ content: 'The note has been successfully added', ephemeral: true }); // Using followUp instead of reply
          } else {
            await interaction.followUp({ content: "I don't have permission to add a note!", ephemeral: true }); // Using followUp instead of reply
          }
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);

      // Check if interaction is already replied or not
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'An error occurred while processing your request. Please try again later.', ephemeral: true }); // Using followUp instead of reply
      } else {
        await interaction.reply({ content: 'An error occurred while processing your request. Please try again later.', ephemeral: true }); // Using reply instead of followUp
      }
    }
  });
};

function hasClaimPermission(member) {
  // Implement your logic to check if the member has claim permission
  // For now, it returns true for testing purposes
  return true; 
}
