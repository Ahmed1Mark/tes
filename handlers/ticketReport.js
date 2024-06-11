const { Modal, MessageActionRow, TextInputComponent, MessageEmbed, MessageButton } = require('discord.js');
const {
    TicketReportChannelId,
} = require('../config.json');

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === 'accept_sug22') {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
          return interaction.reply({ content: 'You do not have permission to do that.', ephemeral: true });
        }
        
        const memberMention = interaction.member.toString();
        const embed = interaction.message.embeds[0];
        embed.fields.find(field => field.name === 'Status').value = `┕✅ Accepted | ${memberMention}`;
        interaction.component.setDisabled(true);
        await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });
      }

      if (interaction.customId === 'unaccept_sug22') {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
          return interaction.reply({ content: 'You do not have permission to do that.', ephemeral: true });
        }
        
        const memberMention = interaction.member.toString();
        const embed = interaction.message.embeds[0];
        embed.fields.find(field => field.name === 'Status').value = `┕❌ Reject | ${memberMention}`;
        interaction.component.setDisabled(true);
        await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });
      }

      if (interaction.customId === 'ticket_rep') {
        const modal = new Modal()
          .setCustomId('ticket_rep')
          .setTitle('Submit Report to Administrators')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('report-input')
                .setLabel('Report Title')
                .setStyle('SHORT')
                .setMinLength(1)
                .setMaxLength(200)
                .setPlaceholder('Write the reason for the report here')
                .setRequired(true),
            ),
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('2report-input')
                .setLabel('Please explain the report')
                .setStyle('PARAGRAPH')
                .setMinLength(1)
                .setMaxLength(4000)
                .setPlaceholder('Write the report details here')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'ticket_rep') {
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
          .addFields(
              { name: 'Reason for the report', value: `\`\`\`${response}\`\`\``, inline: false },
              { name: 'Detailed report reason', value: `\`\`\`${response2}\`\`\``, inline: false },
              { name: 'Status', value: `┕Pending Review ⏳`, inline: true },
              { name: 'Report Source', value: `┕[Link Here](${interaction.message.url})`, inline: true },
              { name: 'Report Submitted By', value: `┕<@${userId}>`, inline: true },
              { name: 'Time Since Submission', value: `┕<t:${startTimestamp}:R>`, inline: true },
              { name: 'Date of Submission', value: `┕\`${egyptianDate}\``, inline: true },
              { name: 'Time of Submission', value: `┕\`${egyptianDate2}\`\``, inline: true },
          );
        
        const accept_sug = new MessageButton()
            .setCustomId('accept_sug22')
            .setLabel('Accept')
            .setStyle('SUCCESS');

        const unaccept_sug = new MessageButton()
            .setCustomId('unaccept_sug22')
            .setLabel('Reject')  
            .setStyle('DANGER');
        
        const row1 = new MessageActionRow()
        .addComponents(accept_sug, unaccept_sug);

        const embed = new MessageEmbed()
          .setColor('#2c2c34')
          .setTitle('> Your report has been sent successfully')
          .setDescription('Your report has been successfully submitted to the administrators \n Your report is under review')

        interaction.reply({ embeds: [embed], ephemeral: true })
          .then(() => {
            const channel = interaction.client.channels.cache.get(TicketReportChannelId);
            if (channel && channel.isText()) {
              channel.send({ embeds: [embed2], components: [row1] });
            } else {
              console.error('The channel could not be found or is invalid.');
            }
          })
          .catch(error => console.error('Error occurred in response:', error));
      }
    }
  });
};
