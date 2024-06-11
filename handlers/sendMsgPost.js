const { Modal, MessageActionRow, TextInputComponent } = require('discord.js');

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === 'sendmsgpost') {
        const modal = new Modal()
          .setCustomId('send-msg-modal')
          .setTitle('Send Message Post')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('send-msg-input')
                .setLabel('Answer')
                .setStyle('SHORT')
                .setMinLength(1)
                .setMaxLength(2000)
                .setPlaceholder('Enter Message Here')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'send-msg-modal') {
        const response = interaction.fields.getTextInputValue('send-msg-input');

        // الرد بطريقة مؤقتة
        interaction.reply({ content: `Message Has Been Sent Successfully`, ephemeral: true })
          .then(() => {
            // إرسال رسالة إلى القناة
            interaction.channel.send(`${response}`);
          })
          .catch(error => console.error('حدث خطأ في الرد:', error));
      }
    }
  });
};
