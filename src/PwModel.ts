import * as words from './words/dictionary.json';

type AttributesKeys = keyof Attributes;

export interface Attributes {
    passwordLength: number;
    passwordType: 'phrase' | 'random';
    password: string;
    passwordStrength: 'poor' | 'good' | 'strong';
    passwordLetters: boolean;
    passwordNumbers: boolean;
    passwordSpecial: boolean;
    readablePassword: string;
}

export class PwModel {

    private letters: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private numbers: string = '0123456789';
    private special: string = '!;#$%&\()*+,-./:;<=>?@[]^_{|}~£';
    public error = false;
    private attributes: Attributes = {
        passwordLength: 25,
        passwordType: 'random',
        password: '',
        passwordStrength: 'poor',
        passwordLetters: true,
        passwordNumbers: true,
        passwordSpecial: true,
        readablePassword: null
    };

    get(attribute: string | number): string | number | boolean {
        return this.attributes[attribute];
    };

    set(attribute: string, value: string | number | boolean): void {
        this.attributes[attribute] = value;
    }

    generatePassword = (): void => {

        let password = '';

        if (this.attributes.passwordType === 'random') {

            const lettersArr = this.letters.split('');
            const numbersArr = this.numbers.split('');
            const specialArr = this.special.split('');

            const { passwordLetters, passwordNumbers, passwordSpecial } = this.attributes;

            let combined = [];

            if (passwordLetters) combined.push(lettersArr);
            if (passwordNumbers) combined.push(numbersArr);
            if (passwordSpecial) combined.push(specialArr);

            combined = combined.flat(2);

            if (combined.length && this.attributes.passwordType === 'random') {
                for (let i = 0; i < this.attributes.passwordLength; i++) {
                    password += combined[Math.floor(Math.random() * combined.length)];
                }
            } else {
                this.error = true;
            }
            this.set('password', password);

        } else {
            this.generatePhrase();
        }
    };

    generatePhrase(): void {
        let tmp = '';
        let tmpReadable = '';
        const ws = Object.values(words);
        const randomWords = Array.from({ length: 100 }, () => ws[Math.floor(Math.random() * ws.length)]);

        for (let i = 0; i < randomWords.length; i++) {
            if ((randomWords[i] + tmp).length <= this.attributes.passwordLength) {
                tmp += randomWords[i];
                tmpReadable += randomWords[i] + ' ';
            }
        }

        if (tmp.length < this.attributes.passwordLength) {
            this.generatePhrase();
        } else {
            this.set('password', tmp);
            this.set('readablePassword', tmpReadable);
        }
    }

    analysePassword = (): void => {

    };
}