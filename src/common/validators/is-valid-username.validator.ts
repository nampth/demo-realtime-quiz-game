import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsValidUsername(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidUsername',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Add your username validation logic here 
          const usernameRegex = /^[a-zA-Z0-9_]{2,20}$/; 
          return usernameRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid username (2-20 characters, alphanumeric and underscores only)`;
        },
      },
    });
  };
}