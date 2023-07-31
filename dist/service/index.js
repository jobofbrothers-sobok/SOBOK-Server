"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.mainService = exports.managerService = exports.ownerService = exports.customerService = void 0;
var customerService_1 = require("./customerService");
Object.defineProperty(exports, "customerService", { enumerable: true, get: function () { return __importDefault(customerService_1).default; } });
var ownerService_1 = require("./ownerService");
Object.defineProperty(exports, "ownerService", { enumerable: true, get: function () { return __importDefault(ownerService_1).default; } });
var managerService_1 = require("./managerService");
Object.defineProperty(exports, "managerService", { enumerable: true, get: function () { return __importDefault(managerService_1).default; } });
var mainService_1 = require("./mainService");
Object.defineProperty(exports, "mainService", { enumerable: true, get: function () { return __importDefault(mainService_1).default; } });
var authService_1 = require("./authService");
Object.defineProperty(exports, "authService", { enumerable: true, get: function () { return __importDefault(authService_1).default; } });
//# sourceMappingURL=index.js.map