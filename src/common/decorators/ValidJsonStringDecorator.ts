import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function ValidJsonString(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'validJsonString',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    try {
                        JSON.parse(value);
                        return true;
                    } catch (error) {
                        return false;
                    }
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a valid JSON string`;
                },
            },
        });
    };
}