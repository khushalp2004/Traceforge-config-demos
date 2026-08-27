export declare class ErrorsController {
    referenceError(): void;
    typeError(): any;
    jsonError(): void;
    asyncError(): Promise<never>;
    databaseError(): void;
    envError(): {
        secret: string;
    };
    filesystemError(): void;
}
