import isEmpty from "is-empty";
import Validator from "validator";

interface IValidation {
  date: Date;
  message: string;
  file: string;
  line: string;
  column: string;
  // error: string;
}

export default function validateRegisterInput(data: IValidation) {
  const errors: any = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.message = !isEmpty(data.message) ? data.message : "";
  data.file = !isEmpty(data.file) ? data.file : "";
  data.line = !isEmpty(data.line) ? data.line : "";
  data.column = !isEmpty(data.column) ? data.column : "";
  // data.error = !isEmpty(data.error) ? data.error : "";
  // Message checks
  if (Validator.isEmpty(data.message)) {
    errors.name = "No message specified";
  }
  // File checks
  if (Validator.isEmpty(data.file)) {
    errors.file = "No file specified";
  }
  // Line checks
  if (Validator.isEmpty(data.file)) {
    errors.file = "No file specified";
  }
  // Column checks
  if (Validator.isEmpty(data.file)) {
    errors.file = "No file specified";
  }
  // Error stack trace checks
  // if (Validator.isEmpty(data.file)) {
  //   errors.file = "No file specified";
  // }
  return {
    errors,
    isValid: isEmpty(errors),
  };
}
