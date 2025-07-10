import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { RegisterService } from './registration.update';

@Module({
    imports: [PrismaModule],
    providers: [RegisterService]
})
export class RegistrationModule {}
