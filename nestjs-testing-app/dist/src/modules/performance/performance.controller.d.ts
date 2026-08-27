import { PrismaService } from '../../prisma/prisma.service';
export declare class PerformanceController {
    private prisma;
    constructor(prisma: PrismaService);
    blockEventLoop(iterations: string): {
        message: string;
        iters: number;
        sum: number;
    };
    simulateMemoryLeak(): {
        message: string;
        leakSize: number;
        processMemory?: undefined;
    } | {
        message: string;
        leakSize: string;
        processMemory: string;
    };
    largeResponse(): {
        id: number;
        name: string;
        email: string;
        createdAt: string;
        isActive: boolean;
    }[];
    slowQuery(): Promise<{
        message: string;
        result: unknown;
    }>;
}
