import { unwrapResolverError } from '@apollo/server/errors';
import type { GraphQLFormattedError } from 'graphql';
import { ArgumentValidationError } from 'type-graphql';

import type { ValidationError as ClassValidatorValidationError } from 'class-validator';
import { GraphQLError } from 'graphql';
import { Error } from 'mongoose';
type IValidationError = Pick<ClassValidatorValidationError, 'property' | 'value' | 'constraints' | 'children'> | Error.ValidatorError;

function formatValidationErrors(validationError: IValidationError): IValidationError {
  if (validationError instanceof Error.ValidatorError) {
    return {
      property: validationError.path,
      value: validationError.value,
      message: validationError.message
    };
  }

  return {
    property: validationError.property,
    ...(validationError.value && { value: validationError.value }),
    ...(validationError.constraints && {
      constraints: validationError.constraints
    }),
    ...(validationError.children &&
      validationError.children.length !== 0 && {
        children: validationError.children.map((child) => formatValidationErrors(child))
      })
  };
}

export class ValidationError extends GraphQLError {
  public constructor(validationErrors: (ClassValidatorValidationError | Error.ValidatorError)[]) {
    super('Validation Error', {
      extensions: {
        code: 'BAD_USER_INPUT',
        validationErrors: validationErrors.map((validationError) => formatValidationErrors(validationError))
      }
    });

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class DuplicateKeyError extends GraphQLError {
  public constructor(originalError: any) {
    super(`Duplicate Error, these values are taken: ${Object.keys(originalError.keyValue).join(', ')}`, {
      extensions: {
        code: 'BAD_USER_INPUT',
        keys: Object.keys(originalError.keyValue)
      }
    });

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export function formatError(formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError {
  const originalError = unwrapResolverError(error) as unknown | any;

  if (originalError instanceof ArgumentValidationError) {
    return new ValidationError(originalError.validationErrors);
  }

  if (originalError instanceof Error.ValidationError) {
    return new ValidationError(Object.values(originalError.errors) as Error.ValidatorError[]);
  }

  // Handle duplicate key error
  if ('code' in originalError && originalError.code === 11000) {
    return new DuplicateKeyError(originalError);
  }

  return formattedError;
}
