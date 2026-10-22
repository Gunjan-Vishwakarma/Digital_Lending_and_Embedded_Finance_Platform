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
import { Controller, Post, Body } from '@nestjs/common';
import { BNPLService } from './bnpl.service.js';
let BNPLController = class BNPLController {
    bnplService;
    constructor(bnplService) {
        this.bnplService = bnplService;
    }
    async prequalify(body) {
        return this.bnplService.prequalify(body);
    }
    async checkout(body) {
        return this.bnplService.checkout(body);
    }
};
__decorate([
    Post('prequalify'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BNPLController.prototype, "prequalify", null);
__decorate([
    Post('checkout'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BNPLController.prototype, "checkout", null);
BNPLController = __decorate([
    Controller('bnpl'),
    __metadata("design:paramtypes", [BNPLService])
], BNPLController);
export { BNPLController };
//# sourceMappingURL=bnpl.controller.js.map