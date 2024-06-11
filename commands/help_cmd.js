const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require('discord.js');
const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    aliases: ['h'],
    description: 'List commands.',
    async execute(message, args) {

        let zap = "\`⚡\` Lightning Response.";
        let green = "\`🟢\` Good Response.";
        let yellow = "\`🟡\` Moderate Response.";
        let red = "\`🔴\` Bad Response.";

        var botState = zap;
        var apiState = zap;
        var timediff = zap;

        let apiPing = message.client.ws.ping;
        let botPing = Math.floor(Date.now() - message.createdTimestamp);

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

        const embed = new MessageEmbed()
            .setColor('#2c2c34')
            .setTimestamp()
            .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setAuthor({ name: `Welcome TO BOT ${message.client.user.username}`, iconURL: message.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) })
            .setDescription(`> **🤖 Rules For Using Bot Commands**\n\n1. 🚫 Limit commands to appropriate channels to maintain conversation flow.\n2. ⚠️ Avoid spamming commands for bot performance and server stability.\n3. 📌 Command Status. \`🟢\` : General | \`🟠\` : Administrator |  \`🔴\` : Testing.\n4. 🛠 If you encounter a problem, please talk to the developer : <@803873969168973855>\n5. 🛑 Respect server rules avoid disruptive or offensive commands.\n6. 🔗 For inquiries, join us on the **[Discord Server](https://discord.gg/AU5bWvnFsV)** \n7. 🔧 Perfix for using bot commands : \` ${prefix} \`.\n8. 🎛 BOT Status : ${botState}\n9. 📚 All Commands : \` 40 \``);

        const selectMenu = new MessageSelectMenu()
            .setCustomId('help-menu')
            .setPlaceholder('Choose a command category')
            .addOptions([
                {
                    label: '💬 General Command',
                    description: '📜 General commands for all users',
                    value: 'general_command',
                    emoji: '🌐'
                },
                {
                    label: '🛠️ Admin Command',
                    description: '📜 Commands for administrators only',
                    value: 'admin_command',
                    emoji: '🛡️'
                },
                {
                    label: '🎮 Leveling System',
                    description: '📜 Commands related to leveling system',
                    value: 'leveling_system',
                    emoji: '📈'
                },
                {
                    label: '↩️ Return to Main Menu',
                    description: '📜 Go back to the main menu',
                    value: 'main_menu',
                    emoji: '🏠'
                },
            ]);

        const row = new MessageActionRow().addComponents(selectMenu);

        const messageReply = await message.reply({ embeds: [embed], components: [row] });

        const filter = interaction => interaction.customId === 'help-menu' && interaction.user.id === message.author.id;
        const collector = messageReply.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async interaction => {
            if (interaction.values[0] === 'general_command') {
                const updatedEmbed = new MessageEmbed()
                    .setAuthor({ name: `General Commands`, iconURL: message.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) })
                    .addFields(
                        { name: `>  💬 Commands:`, value: `\u2003`, inline: true },
                        { name: `📜 Description:`, value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟢\` \`server-banner\`\n`, value: `\u2003`, inline: true },
                        { name: 'Displays the server banner image.\n', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟢\` \`message-info\`\n\`🟢\` \`channel-info\`\n\`🟢\` \`member-list\``, value: `\u2003`, inline: true },
                        { name: 'Displays information about a message.\nShows detailed channel information.\nDisplays the list of server members.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟢\` \`user-banner\`\n\`🟢\` \`user-avatar\`\n\`🟢\` \`server-info\``, value: `\u2003`, inline: true },
                        { name: 'Fetches the banner of a user.\nRetrieves the avatar of a user.\nProvides detailed server information.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟢\` \`emoji-list\`\n\`🟢\` \`user-info\`\n\`🟢\` \`role-info\``, value: `\u2003`, inline: true },
                        { name: 'Lists all available emojis on the server.\nRetrieves detailed user information summary.\nProvides information about a specific role.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟢\` \`role-list\`\n\`🟢\` \`profile\`\n\`🟢\` \`ping\``, value: `\u2003`, inline: true },
                        { name: 'Provides detailed information about a role.\nShow your Profile in the server.\nCheck the bot and API latency.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\n\`🟢\` \`tax\`\n\`🟢\` \`bot\``, value: `\u2003`, inline: true },
                        { name: 'Calculate ProBot credit tax\nDisplay information about the bot.', value: `\u2003`, inline: true },
                    );

                await interaction.update({ embeds: [updatedEmbed] });
            } else if (interaction.values[0] === 'admin_command') {
                const updatedEmbed = new MessageEmbed()
                    .setAuthor({ name: `Admin Command`, iconURL: message.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) })
                    .addFields(
                        { name: `>  💬 Commands:`, value: `\u2003`, inline: true },
                        { name: `📜 Description:`, value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟠\` \`test-welcome\`\n\`🟠\` \`edit-message\`\n\`🟠\` \`say\``, value: `\u2003`, inline: true },
                        { name: 'Simulates a welcome message test.\nEdits an existing message content.\nRepeats your text.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟠\` \`rename-system\`\n\`🟠\` \`report-system\`\n\`🟠\` \`rules-system\``, value: `\u2003`, inline: true },
                        { name: 'Server name change system.\nServer reporting system.\nThe server rules system.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟠\` \`suggestions-system\`\n\`🟠\` \`broadcast-system\`\n\`🟠\` \`time-system\``, value: `\u2003`, inline: true },
                        { name: 'Server suggestion system.\nServer Broadcast System.\nServer Time System.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🔴\` \`user-data\`\n\`🔴\` \`user-kick\`\n\`🔴\` \`user-ban\``, value: `\u2003`, inline: true },
                        { name: 'Display the person data on the server\nKicking someone from the server\nBan someone from the server.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🔴\` \`show-room\`\n\`🔴\` \`hide-room\`\n\`🔴\` \`look-room\``, value: `\u2003`, inline: true },
                        { name: 'To show the channel.\nTo hide the channel.\nDisable sending messages in channels.', value: `\u2003`, inline: true },
                    );

                await interaction.update({ embeds: [updatedEmbed] });
            } else if (interaction.values[0] === 'leveling_system') {
                const updatedEmbed = new MessageEmbed()
                    .setAuthor({ name: `Leveling System`, iconURL: message.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) })
                    .addFields(
                        { name: `>  💬 Commands:`, value: `\u2003`, inline: true },
                        { name: `📜 Description:`, value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🔴\` \`reset-leveling-server\`\n\`🟠\` \`reset-level-membe\`\n\`🟠\` \`add-level\``, value: `\u2003`, inline: true },
                        { name: 'Zeroing all member levels in the server.\nZeroing someone level.\nTo add a level to someone with me.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟠\` \`add-xp\`\n\`🟢\` \`rank\`\n\`🟢\` \`top\``, value: `\u2003`, inline: true },
                        { name: 'To add a xp to someone with me.\nTo view your rank in the server.\nDisplays the most active members on the server.', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false },
                        { name: `\`🟢\` \`xp\``, value: `\u2003`, inline: true },
                        { name: 'To view your xp in the server..', value: `\u2003`, inline: true },
                        { name: `\u2003`, value: `\u2003`, inline: false }
                    );

                await interaction.update({ embeds: [updatedEmbed] });
            } else if (interaction.values[0] === 'main_menu') {
                await interaction.update({ embeds: [embed] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                messageReply.edit({ components: [] });
            }
        });
    },
};

