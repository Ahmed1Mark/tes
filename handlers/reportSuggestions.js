const { Modal, MessageActionRow, TextInputComponent, MessageEmbed } = require('discord.js');

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === 'accept_sug') {
        // Check if the user has the required role
        if (!interaction.member.roles.cache.has('1218308274852728932')) {
          return interaction.reply({ content: 'You do not have permission to do that.', ephemeral: true });
        }

        // Edit the Embed
        const embed = interaction.message.embeds[0];
        embed.fields.find(field => field.name === 'Status').value = '✅ Accepted';
        
        // Disable the button after clicking
        interaction.component.setDisabled(true);

        // Resend the message with the edits and update the button
        await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });
      }
      
      if (interaction.customId === 'unaccept_sug') {
        // Check if the user has the required role
        if (!interaction.member.roles.cache.has('1218308274852728932')) {
          return interaction.reply({ content: 'You do not have permission to do that.', ephemeral: true });
        }

        // Edit the Embed
        const embed = interaction.message.embeds[0];
        embed.fields.find(field => field.name === 'Status').value = '❌ Reject';
        
        // Disable the button after clicking
        interaction.component.setDisabled(true);

        // Resend the message with the edits and update the button
        await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });
      }

      // Check if the button is part of the voting system
      if (interaction.customId === 'report-modal22') {
        const modal = new Modal()
          .setCustomId('report-modal22')
          .setTitle('Report Proposal')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('report-input')
                .setLabel('Why are you reporting this proposal briefly?')
                .setStyle('SHORT')
                .setMinLength(1)
                .setMaxLength(200)
                .setPlaceholder('Enter the reason briefly')
                .setRequired(true),
            ),
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('2report-input')
                .setLabel('What is the reason in detail?')
                .setStyle('PARAGRAPH')
                .setMinLength(1)
                .setMaxLength(4000)
                .setPlaceholder('Write in detail')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'report-modal22') {
        const response = interaction.fields.getTextInputValue('report-input');
        const response2 = interaction.fields.getTextInputValue('2report-input');
        const startTimestamp = Math.floor(Date.now() / 1000) - 27;
        let currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 1);
        const userId = interaction.user.id;
        const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
        const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
        
        const embed2 = new MessageEmbed()
          .setColor('#2c2c34')
          .setTitle('> 📝 New Report')
          .setDescription(`**Report Title** \`\`\`${response}\`\`\` \n**Reason for Reporting** \`\`\`${response2}\`\`\``)
          .addFields(
              { name: `\u2003`, value: `\u2003`, inline: false },
              { name: 'Report Date', value: `┕\` ${egyptianDate2},${egyptianDate}\``, inline: true },
              { name: 'Reported By', value: `<@${userId}>`, inline: true },
              { name: `\u2003`, value: `\u2003`, inline: false },
              { name: 'Reported Since', value: `┕<t:${startTimestamp}:R>`, inline: true },
              { name: 'Proposal Reported', value: `┕[Link Here](${interaction.message.url})`, inline: true },
          );

        // Send a message in Embed format
        const embed = new MessageEmbed()
          .setColor('#2c2c34')
          .setDescription('> **Your report has been sent to the administrators and is being reviewed**')

        await interaction.reply({ embeds: [embed], ephemeral: true })
          .then(() => {
            // Send a message to the specified channel in Embed format
            const channel = interaction.client.channels.cache.get('1237397624039145492');
            if (channel && channel.isText()) {
              channel.send({ embeds: [embed2] });
            } else {
              console.error('Channel not found or invalid channel.');
            }
          })
          .catch(error => console.error('Error occurred in response:', error));
      }
    }
  });
};
