import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectBot } from "nestjs-telegraf";
import { Telegraf } from "telegraf"

@Injectable()
export class BotSerivce implements OnModuleInit {
    constructor(@InjectBot() private readonly bot: Telegraf<any>) {}

    async onModuleInit() {
        this.bot.telegram.setMyCommands([
            {
                command: 'start', description: "Bot ni qayta ishlatish"
            },
            {
                command: 'help', description: "Yordam berish bot haqida"
            },
            {
                command: "info", description: "Profil haqida"
            }
        ])
    }
}