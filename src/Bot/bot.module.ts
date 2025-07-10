import { Module } from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";
import { BotUpdate } from "./bot.update";
import * as dotenv from "dotenv"
import { PrismaModule } from "src/database/prisma.module";
import { BotSerivce } from "src/bot-service";
dotenv.config()

@Module({
    imports: [TelegrafModule.forRoot({
        token: process.env.TOKEN as string
    }), PrismaModule],
    providers: [BotUpdate, BotSerivce]
})
export class BotModule {}