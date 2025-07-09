import { Module } from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";
import { BotUpdate } from "./bot.update";
import * as dotenv from "dotenv"
import { PrismaModule } from "src/database/prisma.module";
dotenv.config()

@Module({
    imports: [TelegrafModule.forRoot({
        token: process.env.TOKEN as string
    }), PrismaModule],
    providers: [BotUpdate]
})
export class BotModule {}