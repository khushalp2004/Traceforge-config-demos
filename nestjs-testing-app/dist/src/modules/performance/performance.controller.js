"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PerformanceController = class PerformanceController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    blockEventLoop(iterations) {
        const iters = parseInt(iterations || '10000000', 10);
        let sum = 0;
        for (let i = 0; i < iters; i++) {
            sum += Math.sqrt(i);
        }
        return { message: 'Event loop blocked and released', iters, sum };
    }
    simulateMemoryLeak() {
        if (!global.memoryLeak) {
            global.memoryLeak = [];
        }
        const leakStr = 'A'.repeat(1024 * 1024 * 10);
        global.memoryLeak.push(leakStr);
        if (global.memoryLeak.length > 50) {
            global.memoryLeak = [];
            return { message: 'Memory leak cleared to prevent crash', leakSize: 0 };
        }
        return {
            message: 'Memory leaked by 10MB',
            leakSize: global.memoryLeak.length * 10 + 'MB',
            processMemory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB'
        };
    }
    largeResponse() {
        const data = [];
        for (let i = 0; i < 100000; i++) {
            data.push({
                id: i,
                name: `User ${i}`,
                email: `user${i}@example.com`,
                createdAt: new Date().toISOString(),
                isActive: i % 2 === 0,
            });
        }
        return data;
    }
    async slowQuery() {
        const result = await this.prisma.querySimulated(5000, false);
        return { message: 'Slow query completed', result };
    }
};
exports.PerformanceController = PerformanceController;
__decorate([
    (0, common_1.Get)('cpu'),
    __param(0, (0, common_1.Query)('iterations')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PerformanceController.prototype, "blockEventLoop", null);
__decorate([
    (0, common_1.Get)('memory'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PerformanceController.prototype, "simulateMemoryLeak", null);
__decorate([
    (0, common_1.Get)('large-response'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PerformanceController.prototype, "largeResponse", null);
__decorate([
    (0, common_1.Get)('slow-query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "slowQuery", null);
exports.PerformanceController = PerformanceController = __decorate([
    (0, common_1.Controller)('performance'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PerformanceController);
//# sourceMappingURL=performance.controller.js.map