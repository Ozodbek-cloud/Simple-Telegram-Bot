import { userState } from 'src/Common/user-state'
import { Context } from 'telegraf'

export async function subscriptionInlineKeyboard(ctx: Context) {
    userState.set(ctx.from!.id, { step: "subscription", data: {} })
    await ctx.reply("Botdan foydalanish uchun kanalga a'zo boling!", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🔊 Nasriddinov's Blog", url: "https://t.me/nasriddinov_blog_01" }],
                [{ text: "✅ Tasdiqlash", callback_data: "check_subscription" }]
            ]
        }
    })
}

export async function checkUser(ctx: Context) {
  const userId = ctx.from!.id;

  try {
    const member = await ctx.telegram.getChatMember("@nasriddinov_blog_01", userId);
    console.log("Status:", member.status);

    if (['member', 'creator', 'administrator'].includes(member.status)) {
      await ctx.answerCbQuery();
      await ctx.reply("✅ Kanalga a'zo bo'lgansiz!");

      userState.set(userId, { step: "firstname", data: {} });
      await ctx.reply("Ismingizni kiriting:");
    } else {
      await ctx.answerCbQuery("❌ Iltimos, avval kanalga a'zo bo'ling!", { show_alert: true });
    }

  } catch (error) {
    console.log("Xatolik:", error);
    await ctx.answerCbQuery("❌ A'zolikni tekshirib bo'lmadi. Kanalga a'zo bo'lganingizga ishonch hosil qiling!", { show_alert: true });
  }
}


