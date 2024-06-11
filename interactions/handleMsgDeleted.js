// interactions/msg_deleted.js

// دالة لمعالجة التفاعل msgdeleted
async function handleMsgDeleted(interaction, hasClaimPermission) {
    // التحقق من صلاحيات المستخدم
    if (!hasClaimPermission(interaction.member)) {
        await interaction.reply({ content: 'You do not have the authority to perform this action', ephemeral: true });
        return;
    }

    // قم بتنفيذ الإجراء المرتبط بحذف الرسالة
    await interaction.reply({ content: 'Enter the ID of the message you want to delete', ephemeral: true });

    // استجابة للرسالة القادمة من المستخدم
    const filter = m => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 });

    collector.on('collect', async m => {
        const messageId = m.content.trim(); // استخراج الـ ID المدخل من المستخدم
        try {
            const channel = interaction.channel;
            const message = await channel.messages.fetch(messageId);
            await message.delete(); // حذف الرسالة بعد جلبها
            await interaction.followUp({ content: 'The message has been successfully deleted', ephemeral: true });
        } catch (error) {
            console.error('An error occurred while trying to delete the message:', error);
            await interaction.followUp({ content: 'An error occurred while trying to delete the message', ephemeral: true });
        }
    });

    collector.on('end', collected => {
        if (collected.size === 0) {
            interaction.followUp({ content: 'No message ID was provided to delete the message in time', ephemeral: true });
        }
    });
}

// تصدير الدالة لمعالجة التفاعل msgdeleted
module.exports = {
    handleMsgDeleted
};
