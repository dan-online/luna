import { isAscii, isDate, isEmail, isString, isStrongPassword, isURL, maxLength, minLength } from "class-validator";
import { usernameRegex } from "./regex";

export const validateString = {
	validator: isString,
	message: "value must be a string",
};

export const validateAscii = {
	validator: isAscii,
	message: "value must be valid letters",
};

export const validateEmail = {
	validator: (value: string) => isEmail(value),
	message: "value must be a valid email",
};

export const validateDate = {
	validator: isDate,
	message: "value must be a valid date",
};

export const validateDomain = {
	validator: (value: string) => isURL(value),
	message: "value must be a valid domain",
};

export const validatePassword = {
	validator: (value: string) => isStrongPassword(value),
	message: "value must be a strong password, must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol",
};

export const validateUsername = {
	validator: (value: string) => usernameRegex.test(value),
	message: "value must be a valid username",
};

export const validateStrLength = (min: number, max: number) => ({
	validator: (value: string) => minLength(value, min) && maxLength(value, max),
	message: `value must be between ${min} and ${max} characters`,
});
