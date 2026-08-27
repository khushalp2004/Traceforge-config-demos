"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const nestjs_1 = __importDefault(require("usetraceforge/nestjs"));
async function test() {
    console.log("Initializing...");
    nestjs_1.default.init({
        apiKey: process.env.TRACEFORGE_API_KEY,
        endpoint: process.env.TRACEFORGE_INGEST_URL,
        autoCapture: false
    });
    console.log("Config loaded. Endpoint:", process.env.TRACEFORGE_INGEST_URL);
    console.log("Capturing test error...");
    try {
        throw new Error("Direct test error from NestJS testing app!");
    }
    catch (e) {
        const promise = nestjs_1.default.captureException(e, { tags: { framework: 'nestjs' } });
        console.log("Promise returned from captureException:", promise);
        await promise;
        console.log("Awaited captureException successfully!");
    }
}
test().catch(e => console.error("Test script failed:", e));
//# sourceMappingURL=test-sdk.js.map