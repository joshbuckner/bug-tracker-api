"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const is_empty_1 = __importDefault(require("is-empty"));
const validator_1 = __importDefault(require("validator"));
function validateRegisterInput(data) {
    const errors = {};
    // Convert empty fields to an empty string so we can use validator functions
    data.name = !is_empty_1.default(data.name) ? data.name : "";
    data.email = !is_empty_1.default(data.email) ? data.email : "";
    data.password = !is_empty_1.default(data.password) ? data.password : "";
    data.password2 = !is_empty_1.default(data.password2) ? data.password2 : "";
    // Name checks
    if (validator_1.default.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }
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
    if (validator_1.default.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
    }
    if (!validator_1.default.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }
    if (!validator_1.default.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }
    return {
        errors,
        isValid: is_empty_1.default(errors),
    };
}
exports.default = validateRegisterInput;
//# sourceMappingURL=register.js.map