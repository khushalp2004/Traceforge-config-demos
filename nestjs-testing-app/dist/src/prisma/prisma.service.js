"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
let PrismaService = PrismaService_1 = class PrismaService {
    logger = new common_1.Logger(PrismaService_1.name);
    isConnected = true;
    async onModuleInit() {
        this.logger.log('Fake Prisma connection established.');
    }
    async onModuleDestroy() {
        this.logger.log('Fake Prisma connection closed.');
    }
    async querySimulated(queryTimeMs = 50, shouldFail = false) {
        if (!this.isConnected) {
            throw new Error('Database unavailable (ECONNREFUSED)');
        }
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (shouldFail) {
                    reject(new Error('Simulated query failure'));
                }
                else {
                    resolve({ status: 'success', data: [] });
                }
            }, queryTimeMs);
        });
    }
    simulateDisconnect() {
        this.isConnected = false;
    }
    simulateConnect() {
        this.isConnected = true;
    }
    user = {
        findUnique: async (args) => {
            if (!this.isConnected)
                throw new Error('Database unavailable');
            if (args.where.id === 'invalid')
                throw new Error('Invalid ID format');
            if (args.where.id === 'not-found')
                return null;
            return { id: args.where.id, email: 'test@example.com', name: 'Test User', age: 30 };
        },
        create: async (args) => {
            if (!this.isConnected)
                throw new Error('Database unavailable');
            return { id: 'new-id', ...args.data };
        },
        update: async (args) => {
            if (!this.isConnected)
                throw new Error('Database unavailable');
            return { id: args.where.id, ...args.data };
        }
    };
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map