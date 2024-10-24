import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  
  @ValidatorConstraint({ name: 'matchValue', async: false })
  export class MatchValueConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
      const [relatedPropertyName] = args.constraints;
      const relatedValue = (args.object as any)[relatedPropertyName];
      return value === relatedValue;
    }
  
    defaultMessage(args: ValidationArguments) {
      const [relatedPropertyName] = args.constraints;
      return `${relatedPropertyName} does not match`;
    }
  }
  
  export function MatchValue(property: string, validationOptions?: ValidationOptions) {
    return (object: Record<string, any>, propertyName: string) => {
      registerDecorator({
        target: object.constructor,
        propertyName,
        options: validationOptions,
        constraints: [property],
        validator: MatchValueConstraint,
      });
    };
  }