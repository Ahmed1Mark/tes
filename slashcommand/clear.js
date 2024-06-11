const { MessageEmbed } = require('discord.js');
const moment = require('moment');

// تعريف مخزن لتتبع آخر وقت تم فيه استخدام الأمر لكل عضو
const lastCommandTimes = new Map();

module.exports = {
    name: 'clear',
    description: 'Clear a certain number of messages.',
    options: [
        {
            name: 'number_of_messages',
            description: 'number of messages deleted.',
            type: 'INTEGER',
            required: true
        }
    ],
    async execute(interaction) {
        // التحقق من مرور 10 ثوانٍ من آخر استخدام
        const lastCommandTime = lastCommandTimes.get(interaction.user.id) || 0;
        const currentTime = Date.now();
        const difference = currentTime - lastCommandTime;

        if (difference < 10000) { // إذا مضت أقل من 10 ثوانٍ
            const remainingTime = Math.ceil((10000 - difference) / 1000); // تحديد الوقت المتبقي بالثواني
            const seconds = remainingTime % 60;

            // تنسيق الثواني بالصيغة المطلوبة
            const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

            const embed = new MessageEmbed()
                .setDescription(`\`\`\`1c
🔴 please wait ${remainingTime}.${formattedSeconds} second(s) to use the command again.
\`\`\``);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // تحديث الوقت الأخير لاستخدام الأمر
        lastCommandTimes.set(interaction.user.id, currentTime);

        // Check if the user has permission to manage messages
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Get the number of messages to delete from the user's input
        let amount = interaction.options.getInteger('number_of_messages');

        // If no amount is provided or if it's greater than 100, set it to 100
        if (!amount || amount > 100) {
            amount = 100;
        }

        try {
            // Delete the specified number of messages
            interaction.channel.bulkDelete(amount, true) // 'true' here to delete only the messages that are not older than 14 days
                .then(messages => {
                    const embed = new MessageEmbed()
                        .setDescription(`\`\`\`c++
🟢 successfully deleted ${messages.size} messages.
\`\`\``)

                    interaction.reply({ embeds: [embed], ephemeral: true });

                    // Delete the reply after 5 seconds
                    setTimeout(() => {
                        interaction.deleteReply().catch(console.error);
                    }, 5000);
                })
                .catch(error => {
                    console.error('Error deleting messages:', error);
                    interaction.reply({ content: 'An error occurred while deleting messages.', ephemeral: true });
                });
        } catch (error) {
            console.error('Error deleting messages:', error);
            interaction.reply({ content: 'An error occurred while deleting messages.', ephemeral: true });
        }
    },
};

