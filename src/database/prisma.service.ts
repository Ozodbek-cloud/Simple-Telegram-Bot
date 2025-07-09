import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger("database")
    async onModuleInit() {
        try {
            await this.$connect()
            this.logger.log("Connected Successfully")
        } catch (error) {
            this.logger.log(error.message)
            process.exit(1)
        }
    }
    async onModuleDestroy() {
        try {
            await this.$disconnect()
            this.logger.log("Disconnted")
        } catch (error) {
            this.logger.log(error.message)
            process.exit(1)
        }
    }
}