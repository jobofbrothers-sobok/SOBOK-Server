"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.mainController = exports.managerController = exports.ownerController = exports.customerController = void 0;
var customerController_1 = require("./customerController");
Object.defineProperty(exports, "customerController", { enumerable: true, get: function () { return __importDefault(customerController_1).default; } });
var ownerController_1 = require("./ownerController");
Object.defineProperty(exports, "ownerController", { enumerable: true, get: function () { return __importDefault(ownerController_1).default; } });
var managerController_1 = require("./managerController");
Object.defineProperty(exports, "managerController", { enumerable: true, get: function () { return __importDefault(managerController_1).default; } });
var mainController_1 = require("./mainController");
Object.defineProperty(exports, "mainController", { enumerable: true, get: function () { return __importDefault(mainController_1).default; } });
var authController_1 = require("./authController");
Object.defineProperty(exports, "authController", { enumerable: true, get: function () { return __importDefault(authController_1).default; } });
//# sourceMappingURL=index.js.map