import { Injectable } from '@nestjs/common';
import { Ctx, Start, Update, Message, Hears, On } from 'nestjs-telegraf';
import { userState } from 'src/Common/user-state';
import { Context } from 'telegraf';
import { keyboard } from 'telegraf/typings/markup';

@Update()
@Injectable()
export class BotUpdate {
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


  @On('contact')
  async onContact(@Ctx() ctx: Context) {
    const state = userState.get(ctx.from!.id)
    if('contact' in ctx.message!) {
          let phone = ctx.message.contact.phone_number
          let {firstname, lastname, age} = state!.data

          ctx.reply('✅ Malumot Saqlandi')
    }
  }
}
