import { Alert } from './Special';
import { globalType, saveType, playerType } from './Types';

export const player: playerType = { //Only for information that need to be saved (cannot be calculated)
    stage: 1,
    energy: {
        current: 0,
        total: 0
    },
    discharge: {
        current: 0
    },
    time: {
        updated: Date.now(),
        started: Date.now()
    },
    buildings: [
        { //Quarks[0]
            current: 3,
            total: 3
        },
        { //Particles[1]
            current: 0,
            true: 0,
            total: 0
        },
        { //Atoms[2]
            current: 0,
            true: 0,
            total: 0
        },
        { //Molecules[3]
            current: 0,
            true: 0,
            total: 0
        }
    ],
    upgrades: [],
    researches: [],
    researchesAuto: [],
    toggles: [],
    buyToggle: {
        howMany: 1, //If more types will be added
        input: 10, //Then turn all of them
        strict: true //Into array
    }
};

export const global: globalType = { //For information that doesn't need to be saved
    tab: 'stage',
    footer: true,
    lastSave: 0,
    energyType: [0, 1, 5, 20],
    stageInfo: {
        word: ['Microworld', 'Submerged'],
        wordColor: ['#03d3d3', 'dodgerblue']
    },
    theme: {
        stage: 1,
        default: true
    },
    screenReader: {
        isOn: false,
        building: ['quarks', 'particles', 'atoms', 'molecules']
    },
    dischargeInfo: {
        next: 1
    },
    intervals: {
        main: 1000, //Min 20 max 1000, default 50
        numbers: 1000,
        visual: 1000, //Min 500 max 10000, default 1000
        autoSave: 300000 //Min 60000 Max 1800000, default 180000
    },
    intervalsId: {
        main: 0,
        numbers: 0,
        visual: 0,
        autoSave: 0
    },
    buildingsInfo: {
        cost: [0, 3, 24, 3],
        initial: [0, 3, 24, 3],
        increase: 1.4,
        producing: [0, 0, 0, 0]
    },
    upgradesInfo: {
        description: [],
        effect: [],
        effectText: [],
        cost: []
    },
    researchesInfo: {
        description: [],
        effect: [],
        effectText: [],
        cost: [],
        max: []
    },
    researchesAutoInfo: {
        description: [],
        effect: [],
        effectText: [],
        cost: [],
        max: []
    }
};

function AddUpgradeArray(name: keyof playerType, cost: number[], effect: Array<number | ''>, description: string[], effectText: string[][], max = [] as number[]) {
    Object.assign(player, { [name]: createArray(cost.length) });
    if (String(name).includes('researches')) {
        Object.assign(global, { [name + 'Info']: { description, effect, effectText, cost, max } });
    } else {
        Object.assign(global, { [name + 'Info']: { description, effect, effectText, cost } });
    }
}

const createArray = (amount: number, type = 'number') => {
    const array = [];
    for (let i = 0; i < amount; i++) {
        if (type === 'number') {
            array.push(0);
        } else {
            if (i === 4 || i === 5 || i === 6) {
                array.push(false);
            } else {
                array.push(true);
            }
        }
    }
    return array;
};

const togglesL = document.getElementsByClassName('toggle').length;
/* Offline progress[0]; Stage confirm[1]; Discharge confirm[2]; Custom font size[3]; Auto for building[1][4], [2][5], [3][6] */
Object.assign(player, { toggles: createArray(togglesL, 'toggles') });
AddUpgradeArray('upgrades',
    [9, 12, 36, 300, 800, 9999, 99999, 999999], //Cost
    [10, 10, 5, 4, 0.2, 1.1, 0.1, 0], //Effect
    [ //Description
        'Bigger electrons. Particles cost decreased.',
        'Stronger protons. Particles produce more.',
        'More neutrons. Increased particle gain.',
        'Superposition. Unlocks new reset tier.',
        'Protium. Basic.',
        'Deuterium. Heavy.',
        'Tritium. Radioactive.',
        'Nuclear fusion. More energy.'
    ], [ //Effect text: '[0]', effect[n], '[1]'
        ['Particle cost is ', ' times cheaper.'],
        ['Particles produce ', ' times more quarks.'],
        ['Atoms produce ', ' times more particles.'],
        ['Each reset cost energy and can give ', ' times production for all buildings.'],
        ['Cost scalling is decreased by ', '.'],
        ['Molecules (only bought one\'s) boost each other by ', ' times.'],
        ['Particles produce molecules. At a reduced rate. (', ')'],
        ['Placeholder ', '.']
    ]);
AddUpgradeArray('researches',
    [2000], //Cost
    [0.1], //Effect
    [ //Description
        "Effect of 'Protium' upgrade is stronger."
    ], [ //Effect text: '[0]', effect[n], '[1]'
        ['Cost scalling is -', ' smaller for each level.']
    ], [9]); //Max level
AddUpgradeArray('researchesAuto',
    [300, 999999], //Cost
    ['', ''], //Effect
    [ //Description
        'Buy toggles.',
        'Automatization for buying upgrades.'
    ], [ //Effect text: '[0]', effect[n], '[1]'
        ['Unlock abbility to buy multiple buildings at same time.', ''],
        ['Will automatically buy buildings for you.', '']
    ], [1, 3]); //Max level

/* Do not do anything like 'player.energy = playerStart.energy', because that will literally explode universe...
   Instead do 'const anyName = structuredClone(playerStart)', so far this is the only method I know to prevent playerStart from being changed (Object.freeze won't work) */
export const playerStart = structuredClone(player) as playerType;
export const globalStart = structuredClone(global) as globalType;

export const updatePlayer = (load: saveType) => {
    if (Object.prototype.hasOwnProperty.call(load, 'player') && Object.prototype.hasOwnProperty.call(load, 'global')) {
        const playerCheck = structuredClone(playerStart); //If to add 'as playerType', TS will lose its mind
        for (const i in playerStart) { //This should auto add missing information
            if (!Object.prototype.hasOwnProperty.call(load.player, i)) {
                load.player[i as keyof playerType] = playerCheck[i as keyof playerType];
            }
        }
        /* Next one's will auto add missing part of already existing information */
        if (playerStart.upgrades.length > load.player.upgrades.length) {
            for (let i = load.player.upgrades.length; i < playerStart.upgrades.length; i++) {
                load.player.upgrades[i] = 0;
            }
        }
        if (playerStart.researches.length > load.player.researches.length) {
            for (let i = load.player.researches.length; i < playerStart.researches.length; i++) {
                load.player.researches[i] = 0;
            }
        }
        if (playerStart.researchesAuto.length > load.player.researchesAuto.length) {
            for (let i = load.player.researchesAuto.length; i < playerStart.researchesAuto.length; i++) {
                load.player.researchesAuto[i] = 0;
            }
        }
        if (playerStart.toggles.length > load.player.toggles.length) {
            for (let i = load.player.toggles.length; i < playerStart.toggles.length; i++) {
                load.player.toggles[i] = playerCheck.toggles[i];
            }
        }
        Object.assign(player, load.player);
        global.intervals = load.global.intervals;
    } else {
        Alert('Save file coudn\'t be loaded as its missing important info.');
    }
};
