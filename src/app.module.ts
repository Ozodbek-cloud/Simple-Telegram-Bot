import { Module } from '@nestjs/common';
import { BotModule } from './Bot/bot.module';
import { PrismaModule } from './database/prisma.module';
import { RegistrationModule } from './registration/registration.module';

@Module({
  imports: [BotModule, PrismaModule, RegistrationModule],
})
export class AppModule {}
