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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorsController = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
let ErrorsController = class ErrorsController {
    referenceError() {
        console.log(user.name);
    }
    typeError() {
        const user = null;
        return user.name;
    }
    jsonError() {
        JSON.parse('{bad json}');
    }
    async asyncError() {
        return await Promise.reject(new Error('Async operation failed'));
    }
    databaseError() {
        const error = new Error('connect ECONNREFUSED 127.0.0.1:5432');
        error.code = 'ECONNREFUSED';
        throw error;
    }
    envError() {
        if (!process.env.MISSING_SECRET) {
            throw new Error('Configuration Error: MISSING_SECRET is not defined');
        }
        return { secret: process.env.MISSING_SECRET };
    }
    filesystemError() {
        (0, fs_1.readFileSync)('missing-file.txt');
    }
};
exports.ErrorsController = ErrorsController;
__decorate([
    (0, common_1.Get)('reference'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ErrorsController.prototype, "referenceError", null);
__decorate([
    (0, common_1.Get)('type'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ErrorsController.prototype, "typeError", null);
__decorate([
    (0, common_1.Get)('json'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ErrorsController.prototype, "jsonError", null);
__decorate([
    (0, common_1.Get)('async'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ErrorsController.prototype, "asyncError", null);
__decorate([
    (0, common_1.Get)('database'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ErrorsController.prototype, "databaseError", null);
__decorate([
    (0, common_1.Get)('env'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ErrorsController.prototype, "envError", null);
__decorate([
    (0, common_1.Get)('filesystem'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ErrorsController.prototype, "filesystemError", null);
exports.ErrorsController = ErrorsController = __decorate([
    (0, common_1.Controller)('errors')
], ErrorsController);
//# sourceMappingURL=errors.controller.js.map