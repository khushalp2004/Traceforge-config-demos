import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getDashboard(): {
        service: string;
        status: string;
        environment: string;
        version: string;
    };
    getStats(): {
        uptime: string;
        requests: number;
        errors: number;
        memoryUsage: string;
        cpuUsage: string;
    };
}
