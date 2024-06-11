const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'server-info',
    description: 'Display information about the server.',
    async execute(interaction) {
        try {
            const guild = interaction.guild;

            // الحصول على عدد الأعضاء بناءً على حالتهم
            const onlineMembers = guild.members.cache.filter(m => m.presence?.status === 'online').size;
            const idleMembers = guild.members.cache.filter(m => m.presence?.status === 'idle').size;
            const dndMembers = guild.members.cache.filter(m => m.presence?.status === 'dnd').size;
            const offlineMembers = guild.members.cache.filter(m => !m.presence || m.presence.status === 'offline').size;

            // الحصول على عدد الأعضاء البشريين والروبوتات
            const botCount = guild.members.cache.filter(m => m.user.bot).size;
            const humanCount = guild.memberCount - botCount;

            // الحصول على عدد القنوات النصية والصوتية
            const textChannels = guild.channels.cache.filter(ch => ch.type === 'GUILD_TEXT').size;
            const voiceChannels = guild.channels.cache.filter(ch => ch.type === 'GUILD_VOICE').size;
            const totalChannels = textChannels + voiceChannels;
            const owner = await guild.fetchOwner();

            // الحصول على الطابع الزمني لتاريخ إنشاء السيرفر
            const createdAtTimestamp = Math.floor(guild.createdAt.getTime() / 1000);

            // تحويل مستوى التحقق إلى نص
            const verificationLevels = {
                NONE: '0',
                LOW: '1',
                MEDIUM: '2',
                HIGH: '3',
                VERY_HIGH: '4'
            };
            const verificationLevel = verificationLevels[guild.verificationLevel] || 'Unknown';

            // الحصول على عدد الإيموجيات الثابتة والمتحركة في السيرفر
            const staticEmojiCount = guild.emojis.cache.filter(e => !e.animated).size;
            const animatedEmojiCount = guild.emojis.cache.filter(e => e.animated).size;
            const totalEmojiCount = staticEmojiCount + animatedEmojiCount;

            // إنشاء رسالة الـ embed
            const serverEmbed = new MessageEmbed()
                .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .addFields(
                    { name: '🆔 Server ID', value: `\`${guild.id}\``, inline: true },
                    { name: '📆 Created On', value: `<t:${createdAtTimestamp}:R>`, inline: true },
                    { name: '👑 Owner', value: `<@${owner.id}>`, inline: true },
                    { 
                        name: `👥 Members`, 
                        value: `Online:\`${onlineMembers}\`|Idle:\`${idleMembers}\`\nDND:\`${dndMembers}\`|Offline:\`${offlineMembers}\``, 
                        inline: true 
                    },
                    { name: `💬 Channels (${totalChannels})`, value: `Text: \`${textChannels}\` | Voice: \`${voiceChannels}\``, inline: true },
                    { name: '✨ Boosts Server', value: `Boosts: \`${guild.premiumSubscriptionCount}\``, inline: true },
                    { name: '🌍 Others', value: `Language: \`${guild.preferredLocale}\`\nVerif. Level: \`${verificationLevel}\``, inline: true },
                    { name: '📜 Rules Channel', value: `<#1144343379505860741>`, inline: true },
                    { name: '🛠 Developer', value: `<@803873969168973855>`, inline: true },
                    { name: `🧩 Emojis (${totalEmojiCount})`, value: `</emojilist:1242761880817369118>`, inline: true },
                    { name: `🔐 Roles (${guild.roles.cache.size})`, value: '</rolelist:1244221039106461717>', inline: true },
                    { name: `👤 Members (${guild.memberCount})`, value: '</memberlist:1244222856166903931>', inline: true }
                )
                .setThumbnail(guild.iconURL({ dynamic: true, size: 4096 }));

            // إرسال رسالة الـ embed
            interaction.reply({ embeds: [serverEmbed] });
        } catch (error) {
            console.error('حدث خطأ:', error);
        }
    },
};
