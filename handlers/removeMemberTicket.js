const { Modal, MessageActionRow, TextInputComponent, MessageEmbed } = require('discord.js');

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === 'remove-mem-button') {
        const modal = new Modal()
          .setCustomId('remove-mem-modal')
          .setTitle('Remove Member From The Ticket')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('remove-mem-input')
                .setLabel('Enter the ID to remove member from the ticket')
                .setStyle('SHORT')
                .setMinLength(4)
                .setMaxLength(30)
                .setPlaceholder('Enter The Member ID Here')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'remove-mem-modal') {
        const memberId = interaction.fields.getTextInputValue('remove-mem-input');
        
        const ticketChannel = interaction.channel;

        try {
          await ticketChannel.permissionOverwrites.delete(memberId);

          const member = await interaction.guild.members.fetch(memberId);

          const startTimestamp = Math.floor(Date.now() / 1000) - 32;
          const egyptianDate = new Date().toLocaleDateString('en-EG', { timeZone: 'Africa/Cairo' });
          const egyptianTime = new Date().toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo' });

          // Create the embed
          const embed = new MessageEmbed()
            .setColor('#2c2c34')
            .setTitle('> Ticket Member Remove Successfully.')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .addFields(
              { name: 'Remove Member', value: `**<@${memberId}>**`, inline: true },
              { name: 'ID Member', value: `**\`${memberId}\`**`, inline: true },
              { name: 'Remove Member By', value: `**<@${interaction.user.id}>**`, inline: true },
              { name: 'The Date', value: `**┕\`\`${egyptianDate}\`\`**`, inline: true },
              { name: 'The Time', value: `**┕\`\`${egyptianTime}\`\`**`, inline: true },
              { name: 'Remove Since', value: `**┕<t:${startTimestamp}:R>**`, inline: true }
            );

          // Reply with the embed
          interaction.reply({ content: `||<@${memberId}> - <@${interaction.user.id}>||`, embeds: [embed] });
        } catch (error) {
          const memberId = interaction.fields.getTextInputValue('remove-mem-input');
          
          // Create an embed to send the error message
          const embed = new MessageEmbed()
            .setColor('#2c2c34')
            .setTitle('> There Is An Error In The Member ID')
            .addFields(
              { name: 'Error ID - Member Not Found', value: `\`\`\`diff\n- ${memberId}\`\`\``, inline: true }
            );
          
          // Reply with the embed
          interaction.reply({ embeds: [embed], ephemeral: true });
        }
      }
    }
  });
};
