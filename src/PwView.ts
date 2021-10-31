import { PwModel } from "./PWModel";

export class PwView {

    model = new PwModel();

    constructor(public parent: Element) {
        this.renderHeader();
        this.renderForm();
    }

    eventsMap(): { [key: string]: (e?: Event) => void; } {
        return {
            'submit:.pwg-form': this.submitForm,
            'change:#pwg-length': this.setLength,
            'click:#pwg-phrase': this.setType,
            'click:#pwg-random': this.setType,
            'click:#pwg-letters': this.setLetters,
            'click:#pwg-numbers': this.setNumbers,
            'click:#pwg-special': this.setSpecial,
            'click:.pwg-output__copy': this.copyPassword
        };
    }

    bindEvents(fragment: DocumentFragment): void {
        const eventsMap = this.eventsMap();

        for (let eventKey in eventsMap) {
            const [eventName, selector] = eventKey.split(':');

            fragment.querySelectorAll(selector).forEach((element) => {
                element.addEventListener(eventName, eventsMap[eventKey]);
            });
        }
    }

    copyPassword = (e: Event): void => {
        const btn = e.target as HTMLButtonElement;
        const pw = document.querySelector('.pwg-output__password') as HTMLInputElement;
        if (pw) {
            navigator.clipboard.writeText(pw.value);
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>Copied`;
            setTimeout(() => {
                btn.innerHTML = 'Copy';
            }, 1300);
        }
        e.preventDefault();
    };

    setLength = (e: Event): void => {
        const input = e.target as HTMLInputElement;
        this.model.set('passwordLength', +input.value);
    };

    setType = (e: Event): void => {
        this.model.set('readablePassword', null);
        const input = e.target as HTMLInputElement;
        this.model.set('passwordType', input.value);
    };

    setLetters = (e: Event): void => {
        const input = e.target as HTMLInputElement;
        const checked = input.checked;
        this.model.set('passwordLetters', checked);
    };

    setNumbers = (e: Event): void => {
        const input = e.target as HTMLInputElement;
        const checked = input.checked;
        this.model.set('passwordNumbers', checked);
    };

    setSpecial = (e: Event): void => {
        const input = e.target as HTMLInputElement;
        const checked = input.checked;
        this.model.set('passwordSpecial', checked);
    };

    submitForm = (e: Event): void => {
        this.model.error = false;
        this.model.generatePassword();
        this.renderOutput();
        e.preventDefault();
    };

    headerTemplate = (): string => {
        return `
            <header class="pwg-header">
                <div class="pwg-header__inner">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
</svg>
                    <h1> Password Generator</h1>
                </div>
            </header>
        `;
    };

    formTemplate = (): string => {
        return `
            <form class="pwg-form">
                <div class="pwg-form__control">
                    <label for="pwg-length">Password Length</label>
                    <input type="number" id="pwg-length" name="pwg-length" value="${this.model.get('passwordLength')}" max="150">
                </div>
                <div class="pwg-form__control pwg-form__control--checkbox">
                    <h3>Password Type</h3>
                    <div>
                    <input type="radio" id="pwg-phrase" name="pwg-type" value="phrase" ${this.model.get('passwordType') === 'phrase' ? 'checked="checked"' : ''}>
                    <label for="pwg-phrase">Random Words</label>
                    </div>
                    <div>
                    <input type="radio" id="pwg-random" name="pwg-type" value="random" ${this.model.get('passwordType') === 'random' ? 'checked="checked"' : ''}>
                    <label for="pwg-random">Random</label>
                    </div>
                   
                </div>
                <div class="pwg-form__control pwg-form__control--checkbox">
                    <h3>Preferences</h3>
                    <div>
                    <input type="checkbox" id="pwg-letters" name="pwg-letters" ${this.model.get('passwordLetters') ? 'checked="checked"' : ''}>
                    <label for="pwg-letters">Include Letters?</label>
                    </div>
                    <div>
                    <input type="checkbox" id="pwg-numbers" name="pwg-numbers" ${this.model.get('passwordNumbers') ? 'checked="checked"' : ''}>
                    <label for="pwg-numbers">Include Numbers?</label>
                    </div>
                    <div>
                    <input type="checkbox" id="pwg-special" name="pwg-special" ${this.model.get('passwordSpecial') ? 'checked="checked"' : ''}>
                    <label for="pwg-special">Include Special Characters?</label>
                    </div>
                </div>
                <div class="pwg-form__control">
                    <button type="submit">Generate Password</button>
                </div>
            </form>
        `;
    };

    outputTemplate = (): string => {
        return `
            <div class="pwg-output">
            ${!this.model.error ? '<h2>Password Generated!</h2>' : ''}
            ${this.model.error ? '<p class="pwg-output__error">Please add some preferences!</p>' : ''}
            ${this.model.get('readablePassword') ? '<p class="pwg-output__phrase">Random words: ' + this.model.get('readablePassword') + '</p>' : ''}
                <input type="text" class="pwg-output__password" readonly value="${this.model.get('password')}"/>
                <button class="pwg-output__copy" type="button">Copy</button>
            </div>
        `;
    };

    render = (template: () => string): void => {
        const previousOutput = this.parent.querySelector('.pwg-output');
        if (previousOutput) {
            previousOutput.remove();
        }

        const templateElement = document.createElement('template');
        templateElement.innerHTML = template();
        this.bindEvents(templateElement.content);
        this.parent.append(templateElement.content);
    };

    renderHeader = (): void => {
        this.render(this.headerTemplate);
    };

    renderForm = (): void => {
        this.render(this.formTemplate);
    };

    renderOutput = (): void => {
        this.render(this.outputTemplate);
    };
}