import { getId } from './Main(OnLoad)';
import { global, player } from './Player';

export const setTheme = (themeNumber: number, initial = false) => {
    const { theme } = global;

    if (initial) {
        theme.default = true;
        localStorage.removeItem('theme');
    } else {
        theme.default = false;
        theme.stage = themeNumber;
        localStorage.setItem('theme', String(themeNumber));
    }
    switchTheme();
};

export const switchTheme = () => {
    const { stage } = player;
    const { stageInfo, theme } = global;
    const body = document.body.style;

    body.setProperty('--transition', '1s');
    //Buttons are ignored //Font size doesn't have enough time to stretch
    if (theme.default) {
        theme.stage = stage;
        getId('currentTheme').textContent = 'Default';
    } else {
        getId('currentTheme').textContent = stageInfo.word[theme.stage - 1];
    }
    if (stage === 1) {
        body.removeProperty('--border-image');
    } else {
        body.setProperty('--border-image', `url(Used%20files%20%28Image%27s%29/Stage${stage}%20border.png)`);
    }

    switch (theme.stage) {
        case 1:
            body.removeProperty('--background-color');
            body.removeProperty('--window-color');
            body.removeProperty('--window-border');
            body.removeProperty('--footer-color');
            body.removeProperty('--button-main-color');
            body.removeProperty('--button-main-border');
            body.removeProperty('--button-main-hover');
            body.removeProperty('--button-delete-color');
            body.removeProperty('--button-delete-hover');
            body.removeProperty('--stage-text-color');
            body.removeProperty('--cyan-text-color');
            getId('upgradeEffect').style.color = '';
            break;
        case 2:
            body.setProperty('--background-color', '#070026');
            body.setProperty('--window-color', '#000052');
            body.setProperty('--window-border', 'blue');
            body.setProperty('--footer-color', '#0000db');
            body.setProperty('--button-main-color', 'blue');
            body.setProperty('--button-main-border', '#427be1');
            body.setProperty('--button-main-hover', '#1515cf');
            body.setProperty('--button-delete-color', '#ce0000');
            body.setProperty('--button-delete-hover', 'firebrick');
            body.setProperty('--stage-text-color', 'dodgerblue');
            body.setProperty('--cyan-text-color', 'cyan');
            getId('upgradeEffect').style.color = '#82cb3b';
            break;
    }
    setTimeout(() => { body.removeProperty('--transition'); }, 1000);
};

export const Alert = (text: string) => {
    const blocker = getId('blocker');
    if (getId('blocker').style.display === 'block') {
        return;
    }

    getId('alertText').textContent = text;
    const confirm = getId('confirmBtn');

    blocker.style.display = 'block';
    const close = () => {
        blocker.style.display = 'none';
        confirm.removeEventListener('click', close);
    };
    confirm.addEventListener('click', close);
};

/* I have no idea how it works... I just did what was in comments: https://dev.to/ramonak/javascript-how-to-access-the-return-value-of-a-promise-object-1bck */
export const Confirm = async(text: string): Promise<boolean> => {
    return await new Promise((resolve) => {
        const blocker = getId('blocker');
        if (blocker.style.display === 'block') {
            resolve(false);
        }

        getId('alertText').textContent = text;
        const cancel = getId('cancelBtn');
        const confirm = getId('confirmBtn');

        blocker.style.display = 'block';
        cancel.style.display = 'block';
        const yes = async() => {
            blocker.style.display = 'none';
            cancel.style.display = 'none';
            confirm.removeEventListener('click', yes);
            cancel.removeEventListener('click', no);
            resolve(true);
        };
        const no = async() => {
            blocker.style.display = 'none';
            cancel.style.display = 'none';
            confirm.removeEventListener('click', yes);
            cancel.removeEventListener('click', no);
            resolve(false);
        };
        confirm.addEventListener('click', yes);
        cancel.addEventListener('click', no);
    });
};

export const Prompt = async(text: string): Promise<string | false> => {
    return await new Promise((resolve) => {
        const blocker = getId('blocker');
        if (blocker.style.display === 'block') {
            resolve(false);
        }

        getId('alertText').textContent = text;
        const input = getId('inputArea') as HTMLInputElement;
        let inputValue = '';
        const cancel = getId('cancelBtn');
        const confirm = getId('confirmBtn');

        blocker.style.display = 'block';
        cancel.style.display = 'block';
        input.style.display = 'block';
        const getValue = () => {
            inputValue = input.value;
        };
        const yes = async() => {
            blocker.style.display = 'none';
            cancel.style.display = 'none';
            input.style.display = 'none';
            input.value = '';
            confirm.removeEventListener('click', yes);
            cancel.removeEventListener('click', no);
            input.removeEventListener('blur', getValue);
            resolve(inputValue);
        };
        const no = async() => {
            blocker.style.display = 'none';
            cancel.style.display = 'none';
            input.style.display = 'none';
            input.value = '';
            confirm.removeEventListener('click', yes);
            cancel.removeEventListener('click', no);
            input.removeEventListener('blur', getValue);
            resolve(false);
        };
        confirm.addEventListener('click', yes);
        cancel.addEventListener('click', no);
        input.addEventListener('blur', getValue);
    });
};

/* This is a pain, I had to remove animation for it to play again... Though I still think it's better that adding a class... */
export const hideFooter = () => {
    const footer = getId('footer');
    const hide = getId('footerColor');
    const toggle = getId('hideToggle');
    const text = getId('hideText');
    const arrow = getId('hideArrow');

    global.footer = !global.footer;
    toggle.removeEventListener('click', hideFooter);
    if (global.footer) {
        hide.style.display = '';
        arrow.style.transform = '';
        footer.style.animation = 'hide 1s forwards reverse';
        arrow.style.animation = 'rotate 1s forwards reverse';
        text.textContent = 'Hide';
    } else {
        footer.style.animation = 'hide 1s backwards';
        arrow.style.animation = 'rotate 1s backwards';
        text.textContent = 'Show';
        setTimeout(() => {
            hide.style.display = 'none';
            arrow.style.transform = 'rotate(180deg)';
        }, 1000);
    }
    setTimeout(() => {
        footer.style.animation = '';
        arrow.style.animation = '';
        toggle.addEventListener('click', hideFooter);
    }, 1000);
};

export const changeFontSize = (change = false) => {
    const { toggles } = player;
    const body = document.body.style;
    const input = getId('customFontSize') as HTMLInputElement;
    let size = localStorage.getItem('fontSize');

    if (!toggles[3]) {
        body.setProperty('--font-size', '1em');
        localStorage.removeItem('fontSize');
    } else {
        if (size === null || Number(size) < 10 || Number(size) > 32 || change) {
            size = String(Math.min(Math.max(Math.trunc(Number(input.value) * 10) / 10, 10), 32));
            localStorage.setItem('fontSize', size);
        }
        body.setProperty('--font-size', `${size}px`);
        input.value = size;
    }
};
