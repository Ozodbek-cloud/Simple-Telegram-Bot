import { Action, Ctx, Hears, On, Update } from "nestjs-telegraf";
import { userState } from "src/Common/user-state";
import { PrismaService } from "src/database/prisma.service";
import { Context } from "telegraf";



@Update()

export class RegisterService {
    constructor(private prismaService: PrismaService) { }


    @On('text')
    async onText(@Ctx() ctx: Context) {
        const state = userState.get(ctx.from!.id)
        if (!state) {
            ctx.reply("Iltimos /start ni bosing")
        }
        if ("text" in ctx.message!) {
            const text = ctx.message.text

            switch (state?.step) {

                case 'firstname':

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
                    if (!age && isNaN(age)) {
                        ctx.reply("Yoshingizni tog'ri kiriting")
                    }
                    state.data.age = age

                    state.step = "country"

                    ctx.reply("Vilyotni kiriting:", {
                        reply_markup: {
                            inline_keyboard: [
                                
                                    [{ text: "Andijon", callback_data: "Andijon" }],
                                    [{ text: "Buxoro", callback_data: "Buxoro" }],
                                    [{ text: "Fargona", callback_data: "Fargona" }],
                                    [{ text: "Jizzax", callback_data: "Jizzax" }],
                                    [{ text: "Xorazm", callback_data: "Xorazm" }],
                                    [{ text: "Namangan", callback_data: "Namangan" }],
                                    [{ text: "Navoiy", callback_data: "Navoiy" }],
                                    [{ text: "Qashqadaryo", callback_data: "Qashqadaryo" }],
                                    [{ text: "Qoraqalpogiston", callback_data: "Qoraqalpogiston" }],
                                    [{ text: "Samarqand", callback_data: "Samarqand" }],
                                    [{ text: "Sirdaryo", callback_data: "Sirdaryo" }],
                                    [{ text: "Surxondaryo", callback_data: "Surxondaryo" }],
                                    [{ text: "Toshkent", callback_data: "Toshkent" }]

                            ],

                        }

                    })

            }
        }
    }
    @On("callback_query")
    async countryInfo(@Ctx() ctx: Context) {
         let state = userState.get(ctx.from!.id)
         if ("data" in ctx.callbackQuery!) {
            state!.data.country = ctx.callbackQuery!.data
            state!.step = 'contact'
            
            await ctx.answerCbQuery()

            await ctx.reply("Contactingizni kiriting", {
                    reply_markup: {
                        keyboard: [
                            [
                                { text: "📱 Raqamingizni kiriting", request_contact: true },
                            ]
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                })
         }
    }


    @On('contact')
    async onContact(@Ctx() ctx: Context) {
        const state = userState.get(ctx.from!.id)
        if ('contact' in ctx.message!) {
            let phone = ctx.message.contact.phone_number
            let { firstname, lastname, age, country } = state!.data
            await this.prismaService.user.create({
                data: {
                    firstname: firstname!,
                    lastname: lastname!,
                    age: age!,
                    contact: phone,
                    telegramId: ctx.from!.id,
                    country: country!
                }
            })



            ctx.reply('✅ Malumot Saqlandi', {
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
        console.log(ctx.from!.id)
    }
}