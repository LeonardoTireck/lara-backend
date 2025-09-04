export class Password {
    private _value: string;

    constructor(value: string) {
        if (!this.isValid(value))
            throw new Error('Password does not meet criteria.');
        this._value = value;
    }

    private isValid(value: string) {
        const minLength = /.{8,}/;
        const hasUpperCase = /[A-Z]/;
        const hasLowerCase = /[a-z]/;
        const hasNumber = /[0-9]/;
        const hasSymbol = /[^A-Za-z0-9]/;

        return (
            minLength.test(value) &&
            hasUpperCase.test(value) &&
            hasLowerCase.test(value) &&
            hasNumber.test(value) &&
            hasSymbol.test(value)
        );
    }
    get value() {
        return this._value;
    }
}
