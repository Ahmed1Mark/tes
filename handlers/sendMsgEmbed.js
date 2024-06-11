const { Modal, MessageActionRow, TextInputComponent, MessageEmbed } = require('discord.js');

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === 'sendmsgembed') {
        const modal = new Modal()
          .setCustomId('send-msg-modal')
          .setTitle('Send Message Embed')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('send-msg-input')
                .setLabel('Add Title / Not Required')
                .setStyle('SHORT')
                .setMinLength(1)
                .setMaxLength(200)
                .setPlaceholder('Enter Title Here')
                .setRequired(false),
            ),
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('2send-msg-input')
                .setLabel('Add Title / Yes Required')
                .setStyle('PARAGRAPH')
                .setMinLength(1)
                .setMaxLength(4000)
                .setPlaceholder('Enter Description Here')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'send-msg-modal') {
        const response = interaction.fields.getTextInputValue('send-msg-input');
        const response2 = interaction.fields.getTextInputValue('2send-msg-input');

        interaction.reply({ content: `Message Has Been Sent Successfully`, ephemeral: true })
          .then(() => {
            const embed = new MessageEmbed()
              .setColor('#2c2c34')
              .setTitle(`${response}`)
              .setDescription(`${response2}`);

            interaction.channel.send({ embeds: [embed] });
          })
          .catch(error => console.error('حدث خطأ في الرد:', error));
      }
    }
  });
};
