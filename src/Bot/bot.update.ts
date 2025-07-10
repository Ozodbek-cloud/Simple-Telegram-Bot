import { Injectable } from '@nestjs/common';
import { sendMessage } from 'for-bot';
import { Ctx, Start, Update, Message, Hears, On, Command, Action } from 'nestjs-telegraf';
import { userState } from 'src/Common/user-state';
import { PrismaService } from 'src/database/prisma.service';
import { checkUser, subscriptionInlineKeyboard } from 'src/subscription/user-subscription';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class BotUpdate {
  constructor(private prismaService: PrismaService) { }

  @Hears("🆘Help")
  async onHelp(@Ctx() ctx: Context) {
    ctx.reply(
      "🆘 *Yordam bo‘limi*\n\n" +
      "Quyidagi buyruqlar orqali botdan foydalanishingiz mumkin:\n\n" +
      "➡️ /start - Ro'yxatdan o'tishni boshlaydi\n" +
      "ℹ️ Info - O'zingiz kiritgan ma'lumotlarni ko‘rish\n" +
      "Sertification - Sertifikatlar bilan bog‘liq bo‘lim (tez orada)\n" +
      "🚩 Others - Qo‘shimcha imkoniyatlar (tez orada)\n\n" +
      "Agar ro'yxatdan o'tmagan bo‘lsangiz, /start buyrug‘ini bosing va ismingizni kiriting.\n\n" +
      "Qo‘shimcha yordam kerak bo‘lsa, admin bilan bog‘laning: @admin_username",
    );
  }

  @Hears("ℹ️Info")
  async oldUser(@Ctx() ctx: Context) {
    let telegramId = await ctx.from!.id
    let olduser = await this.prismaService.user.findFirst({ where: { telegramId } })
    if (!olduser) ctx.reply("bu foydalanuvchi hali ro'yxatdan o'tmagan /start ni bosing")

    ctx.reply(`Ro'yxat:
          🙋‍♂️Ism: ${olduser!.firstname}
          ✅Familiya: ${olduser!.lastname}
          🎂Yosh:${olduser!.age}
          📲Tel: ${olduser!.contact}`)


  }

  @Start()
  async start(@Ctx() ctx: Context) {
    let id_user = ctx.from!.id
    
    let exists = await this.prismaService.user.findFirst({ where: { telegramId: id_user } })
    if (exists) {
      ctx.reply("Siz royxatdan otgansiz", {
        reply_markup: {
          keyboard: [
            [
              { text: "ℹ️Info" }, { text: "🆘Help" }
            ],
            [
              { text: 'Sertification' }, { text: "🚩 Others" }
            ]
          ],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      })
    }
    else if (!exists) {
      await subscriptionInlineKeyboard(ctx)
      
    }
    // await sendMessage();
  }

   @Action("check_subscription") 
   async checkMember(@Ctx() ctx: Context) {
    await checkUser(ctx)

   }

}
