import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class PrismaService implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    private isConnected;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    querySimulated(queryTimeMs?: number, shouldFail?: boolean): Promise<unknown>;
    simulateDisconnect(): void;
    simulateConnect(): void;
    user: {
        findUnique: (args: any) => Promise<{
            id: any;
            email: string;
            name: string;
            age: number;
        } | null>;
        create: (args: any) => Promise<any>;
        update: (args: any) => Promise<any>;
    };
}
