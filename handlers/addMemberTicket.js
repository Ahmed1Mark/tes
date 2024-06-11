const { Modal, MessageActionRow, TextInputComponent, MessageEmbed, Permissions } = require('discord.js');

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    try {
      if (interaction.isButton()) {
        if (interaction.customId === 'add_member') {
          const modal = new Modal()
            .setCustomId('add-modal')
            .setTitle('Add Member In The Ticket')
            .addComponents([
              new MessageActionRow().addComponents(
                new TextInputComponent()
                  .setCustomId('add-input1')
                  .setLabel('Enter the ID to add a member to the ticket')
                  .setStyle('SHORT')
                  .setMinLength(4)
                  .setMaxLength(30)
                  .setPlaceholder('Enter The Member ID Here')
                  .setRequired(true),
              )
            ]);

          await interaction.showModal(modal);
        }
      }

      if (interaction.isModalSubmit()) {
        if (interaction.customId === 'add-modal') {
          const memberId = interaction.fields.getTextInputValue('add-input1');
          
          const ticketChannel = interaction.channel;

          // Check if the member exists in the channel
          const memberExists = ticketChannel.members.some(member => member.id === memberId);

          if (memberExists) {
            const embed = new MessageEmbed()
              .setColor('#2c2c34')
              .setTitle('> Error')
              .addFields(
                 { name: 'This Member Is Already On The Ticket', value: `**┕\`\`${memberId}\`\`**`, inline: true },
                 { name: 'The Member', value: `**┕<@${memberId}>**`, inline: true }
              );

            interaction.reply({ embeds: [embed], ephemeral: true });
            return;
          }

          // Get the guild member
          const member = await interaction.guild.members.fetch(memberId);
          
          const startTimestamp = Math.floor(Date.now() / 1000) - 32;
          
          const egyptianDate = new Date().toLocaleDateString('en-EG', { timeZone: 'Africa/Cairo' });
          const egyptianTime = new Date().toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo' });
      
          // Check if the member exists
          if (member) {
            // Give permissions to the member
            await ticketChannel.permissionOverwrites.edit(member, { 
              VIEW_CHANNEL: true,
              SEND_MESSAGES: true,
              ADD_REACTIONS: true
            });
      
            // Create a new embed
            const embed = new MessageEmbed()
              .setColor('#2c2c34')
              .setTitle('> The person has been successfully added to the ticket')
              .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
              .addFields(
                  { name: 'Add Member', value: `**<@${memberId}>**`, inline: true },
                  { name: 'Person ID', value: `**\`${memberId}\`**`, inline: true },
                  { name: 'Added by', value: `**<@${interaction.user.id}>**`, inline: true },
                  { name: 'Date of Addition', value: `**┕\`\`${egyptianDate}\`\`**`, inline: true },
                  { name: 'Time of Addition', value: `**┕\`\`${egyptianTime}\`\`**`, inline: true },
                  { name: 'Added Since', value: `**┕<t:${startTimestamp}:R>**`, inline: true }
                );
      
            // Reply with the embed
            interaction.reply({ content: `||<@${memberId}> - <@${interaction.user.id}>||`, embeds: [embed] });

            // Hide the modal
            await interaction.update({
              components: [],
            });
          } else {
            interaction.reply({ content: "The person was not found", ephemeral: true });
          }
        }
      }
    } catch (error) {
      const memberId = interaction.fields.getTextInputValue('add-input1');
    
      // Create an embed to send the error message
      const embed = new MessageEmbed()
        .setColor('#2c2c34')
        .setTitle('> There is an error in the person ID')
        .addFields(
          { name: 'Error ID - Person not found', value: `\`\`\`diff\n- ${memberId}\`\`\``, inline: true }
        );
    
      // Reply with the embed
      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  });
};
