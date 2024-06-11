const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Check the bot and API latency.',
    async execute(interaction) {
        let zap = "⚡";
        let green = "🟢";
        let red = "🔴";
        let yellow = "🟡";

        var botState = zap;
        var apiState = zap;
        var timediff = zap;

        let apiPing = interaction.client.ws.ping;
        let botPing = Math.floor(Date.now() - interaction.createdTimestamp);

        if (apiPing >= 40 && apiPing < 200) {
            apiState = green;
        } else if (apiPing >= 200 && apiPing < 400) {
            apiState = yellow;
        } else if (apiPing >= 400) {
            apiState = red;
        }

        if (botPing >= 40 && botPing < 200) {
            botState = green;
        } else if (botPing >= 200 && botPing < 400) {
            botState = yellow;
        } else if (botPing >= 400) {
            botState = red;
        }

        if (botPing >= 40 && botPing < 200) {
            timediff = green;
        } else if (botPing >= 200 && botPing < 400) {
            timediff = yellow;
        } else if (botPing >= 400) {
            timediff = red;
        }

        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("📊 Bot Status")
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .addFields(
                        {
                            name: "API Latency",
                            value: `\`\`\`yml\n${apiState} | ${apiPing}ms\`\`\``,
                            inline: true,
                        },
                        {
                            name: "Bot Latency",
                            value: `\`\`\`yml\n${botState} | ${botPing}ms\`\`\``,
                            inline: true,
                        },
                        {
                            name: "Response Time",
                            value: `\`\`\`yml\n${timediff} | ${Date.now() - interaction.createdTimestamp}ms\`\`\``,
                            inline: true,
                        }
                    )
            ],
        });
    },
};
