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
    data.message = !is_empty_1.default(data.message) ? data.message : "";
    data.file = !is_empty_1.default(data.file) ? data.file : "";
    data.line = !is_empty_1.default(data.line) ? data.line : "";
    data.column = !is_empty_1.default(data.column) ? data.column : "";
    // data.error = !isEmpty(data.error) ? data.error : "";
    // Message checks
    if (validator_1.default.isEmpty(data.message)) {
        errors.name = "No message specified";
    }
    // File checks
    if (validator_1.default.isEmpty(data.file)) {
        errors.file = "No file specified";
    }
    // Line checks
    if (validator_1.default.isEmpty(data.file)) {
        errors.file = "No file specified";
    }
    // Column checks
    if (validator_1.default.isEmpty(data.file)) {
        errors.file = "No file specified";
    }
    // Error stack trace checks
    // if (Validator.isEmpty(data.file)) {
    //   errors.file = "No file specified";
    // }
    return {
        errors,
        isValid: is_empty_1.default(errors),
    };
}
exports.default = validateRegisterInput;
//# sourceMappingURL=event.js.map