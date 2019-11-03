"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const is_empty_1 = __importDefault(require("is-empty"));
const validator_1 = __importDefault(require("validator"));
function validateLoginInput(data) {
    const errors = {};
    // Convert empty fields to an empty string so we can use validator functions
    data.email = !is_empty_1.default(data.email) ? data.email : "";
    data.password = !is_empty_1.default(data.password) ? data.password : "";
    // Email checks
    if (validator_1.default.isEmpty(data.email)) {
        errors.email = "Email field is required";
    }
    else if (!validator_1.default.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }
    // Password checks
    if (validator_1.default.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }
    return {
        errors,
        isValid: is_empty_1.default(errors),
    };
}
exports.default = validateLoginInput;
//# sourceMappingURL=login.js.map