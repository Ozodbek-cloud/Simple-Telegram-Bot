import { Module } from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";
import { BotUpdate } from "./bot.update";
import * as dotenv from "dotenv"
dotenv.config()

@Module({
    imports: [TelegrafModule.forRoot({
        token: process.env.TOKEN as string
    })],
    providers: [BotUpdate]
})
export class BotModule {}