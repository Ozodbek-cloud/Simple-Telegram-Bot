import { Injectable } from '@nestjs/common';
import { Ctx, Start, Update, Message, Hears, On } from 'nestjs-telegraf';
import { userState } from 'src/Common/user-state';
import { PrismaService } from 'src/database/prisma.service';
import { Context } from 'telegraf';
import { keyboard } from 'telegraf/typings/markup';

@Update()
@Injectable()
export class BotUpdate {
  constructor(private prismaService: PrismaService) {}
   @Start()
   async start(@Ctx() ctx: Context) {
     userState.set(ctx.from!.id, {step: "firstname", data: {}})
     ctx.reply("Ismingizni Kiriting")
     
   } 

  @On('text')
  async onText(@Ctx() ctx : Context) {
    const state = userState.get(ctx.from!.id)
    if (!state) {
        ctx.reply("Iltimos /start ni bosing")
    }
    if ("text" in ctx.message!) {
         const text = ctx.message.text

         switch(state?.step) {
            case 'firstname' :
              state.data.firstname = text
              state.step = "lastname"
              ctx.reply("Iltimos Familiynagizni kiriting")
              break
            case 'lastname':
              state.data.lastname = text
              state.step = "age"
              ctx.reply("Iltimos Yoshingizni kiriting")
              break
            case 'age':
              const age = parseInt(text)
              if(!age && isNaN(age)) {
                ctx.reply("Yoshingizni tog'ri kiriting")
              }              
              state.data.age = age
              state.step = "contact"

              ctx.reply("Contactingizni kiriting", {
                reply_markup:{
                  keyboard:[
                    [
                      {text: "📱 Raqamingizni kiriting", request_contact: true},
                    ]
                  ],
                  resize_keyboard: true,
                  one_time_keyboard: true
                }
              })
         }
    }
      
  }
 
  @Hears("Info")
  async getInfo(@Ctx() ctx: Context) {
    let data = await this.prismaService.user.findFirst({
      where: {
        telegramId: ctx.from!.id
      }
    })
    ctx.reply(`🙋‍♂️ Ism: ${data!.firstname}\n✅Familiya: ${data!.lastname}\nYosh:${data!.age}\n📲Tel: ${data!.contact}`)
  }

  @On('contact')
  async onContact(@Ctx() ctx: Context) {
    const state = userState.get(ctx.from!.id)
    if('contact' in ctx.message!) {
          let phone = ctx.message.contact.phone_number
          let {firstname, lastname, age} = state!.data
          await this.prismaService.user.create({
            data: {
              firstname: firstname!,
              lastname: lastname!,
              age: age!,
              contact: phone,
              telegramId: ctx.from!.id
            }
          })

          ctx.reply('✅ Malumot Saqlandi', {
             reply_markup: {
              keyboard: [
                [
                  {text: "ℹ️ Info"}, {text: "🆘 Help"}
                ],
                [
                  {text: '🖼 Sertification'}, {text: "🚩 Others"}
                ]
              ],
              resize_keyboard: true,
              one_time_keyboard: true
             }
          })
    }
    console.log(ctx.from!.id)
  }

}
