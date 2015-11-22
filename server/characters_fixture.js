if (Characters.find().count() === 0) {

    Characters.insert({
        name: 'Grog',
        fullName: 'Grog Strongjaw',
        actor: 'Travis Willingham',
        race: 'Goliath',
        class: 'Barbarian',
        homeland: '',
        charStats: {
            level: 11,
            charisma: 13,
            constitution: 18,
            dexterity: 15,
            intelligence: 6,
            strength: 19,
            wisdom: 10
        },
        attacks: [
            {
                name: 'Fist',
                diceNum: 3,
                diceVal: 6,
                type: 'Regular'
            },
            {
                name: 'Axe',
                diceNum: 3,
                diceVal: 6,
                type: 'Regular'
            },
            {
                name: 'Hammer',
                diceNum: 2,
                diceVal: 8,
                dicePerLev: 1,
                type: 'Regular'
            }
        ],
        gameStats: {
            killCount: 22,
            koCount: 5
        },
        imageURL: '/images/grog.svg',
        submitted: new Date(),
        live: false
    });


    Characters.insert({
        name: 'Keyleth',
        fullName: "Keyleth",
        actor: "Marisha Ray",
        race: 'Half-elf',
        class: 'Druid',
        homeland: "",
        charStats: {
            level: 11,
            charisma: 10,
            constitution: 14,
            dexterity: 15,
            intelligence: 15,
            strength: 14,
            wisdom: 22
        },
        attacks: [
            {
                name: 'Call Lightning',
                diceNum: 3,
                diceVal: 6,
                type: 'Electricity'
            },
            {
                name: 'Thunder Wave',
                diceNum: 2,
                diceVal: 8,
                dicePerLev: 1,
                type: 'Normal'
            },
            {
                name: 'Thunder Wave',
                diceNum: 2,
                diceVal: 8,
                dicePerLev: 1,
                type: 'Normal'
            }
        ],
        spells: [
            {
                name: 'Alter Self'
            },
            {
                name: 'Beast Sense'
            },
            {
                name: 'Bull Strength'
            },
            {
                name: 'Commune with Nature'
            },
            {
                name: 'Control Water'
            },
            {
                name: 'Enhace Ability'
            },
            {
                name: 'Entangle'
            },
            {
                name: 'Fog Cloud'
            },
            {
                name: 'Geas'
            },
            {
                name: 'Grasping Vine'
            },
            {
                name: 'Heat Metal'
            },
            {
                name: 'Hold Person'
            },
            {
                name: 'Illusionary Terrain'
            },
            {
                name: 'Light'
            },
            {
                name: 'Pass Without a Trace'
            },
            {
                name: 'Polymorph Creature'
            },
            {
                name: 'Scrying'
            },
            {
                name: 'Speak with Animals'
            },
            {
                name: 'Stone Shape'
            },
            {
                name: 'Stone Skin'
            },
            {
                name: 'Wall of Stone'
            },
            {
                name: 'Wind Wall'
            }
        ],
        heals: [
            {
                name: 'Cure Wounds',
                diceNum: 1,
                diceVal: 8,
                dicePerLev: 8
            }
        ],
        gameStats: {
            killCount: 10,
            koCount: 0
        },
        imageURL: '/images/keyleth.svg',
        submitted: new Date(),
        live: false
    });


    Characters.insert({
        name: 'Percy',
        fullName: 'Percival Fredrickstein Von Musel Klossowski De Rolo III',
        actor: 'Tallesin Jaffe',
        race: 'Human',
        class: 'Gunslinger',
        homeland: 'Whitestone',
        charStats: {
            level: 12,
            charisma: 14,
            constitution: 14,
            dexterity: 22,
            intelligence: 16,
            strength: 12,
            wisdom: 16
        },
        attacks: [
            {
                name: 'Fire Shot',
                diceNum: 3,
                diceVal: 6,
                type: 'Ice'
            },
            {
                name: 'Fire Shot',
                diceNum: 2,
                diceVal: 8,
                type: 'Fire'
            },
            {
                name: 'Head Shot',
                diceNum: 2,
                diceVal: 8,
                dicePerLev: 1,
                type: 'Normal'
            }
        ],
        gameStats: {
            killCount: 43,
            koCount: 1
        },
        imageURL: '/images/percy.svg',
        submitted: new Date(),
        live: false
    });


    Characters.insert({
        name: 'Pike',
        fullName: 'Pike Trickfoot',
        actor: 'Ashley Johnson',
        race: 'Gnome',
        class: 'Cleric',
        homeland: '',
        charStats: {
            level: 10,
            charisma: 14,
            constitution: 12,
            dexterity: 11,
            intelligence: 13,
            strength: 13,
            wisdom: 18
        },
        attacks: [
            {
                name: 'Call Lightning',
                diceNum: 3,
                diceVal: 6,
                type: 'Electricity'
            },
            {
                name: 'Thunder Wave',
                diceNum: 2,
                diceVal: 8,
                dicePerLev: 1,
                type: 'Normal'
            },
            {
                name: 'Thunder Wave',
                diceNum: 2,
                diceVal: 8,
                dicePerLev: 1,
                type: 'Normal'
            }
        ],
        spells: [
            {
                name: 'Wind Wall'
            },
            {
                name: 'Stone Shape'
            },
            {
                name: 'Stone Skin'
            },
            {
                name: 'Wall of Stone'
            },
            {
                name: 'Control Water'
            },
            {
                name: 'Cure Wounds',
                diceNum: 1,
                diceVal: 8,
                dicePerLev: 8
            }
        ],
        gameStats: {
            killCount: 5,
            koCount: 2
        },
        imageURL: '/images/pike.svg',
        submitted: new Date(),
        live: false
    });


    Characters.insert({
        name: 'Scanlan',
        fullName: 'Scanlan Shorthalt',
        actor: 'Sam Reigel',
        race: 'Gnome',
        class: 'Bard',
        homeland: '',
        charStats: {
            level: 12,
            charisma: 20,
            constitution: 15,
            dexterity: 11,
            intelligence: 14,
            strength: 13,
            wisdom: 7
        },
        attacks: [
            {
                name: 'Call Lightning',
                diceNum: 3,
                diceVal: 6,
                type: 'Electricity'
            },
            {
                name: 'Thunder Wave',
                diceNum: 2,
                diceVal: 8,
                dicePerLev: 1,
                type: 'Normal'
            },
            {
                name: 'Thunder Wave',
                diceNum: 2,
                diceVal: 8,
                dicePerLev: 1,
                type: 'Normal'
            }
        ],
        spells: [
            {
                name: 'Wind Wall'
            },
            {
                name: 'Stone Shape'
            },
            {
                name: 'Stone Skin'
            },
            {
                name: 'Wall of Stone'
            },
            {
                name: 'Control Water'
            },
            {
                name: 'Cure Wounds',
                diceNum: 1,
                diceVal: 8,
                dicePerLev: 8
            }
        ],
        gameStats: {
            killCount: 22,
            koCount: 2,
        },
        imageURL: '/images/scanlan.svg',
        submitted: new Date(),
        live: false
    });


    Characters.insert({
        name: 'Tiberius',
        fullName: 'Tiberius Stormwind',
        actor: 'Orion Acaba',
        race: 'Dragonborn',
        class: 'Sorcerer',
        homeland: "Ty'rex, Draconia",
        charStats: {
            level: 11,
            charisma: 20,
            constitution: 16,
            dexterity: 16,
            intelligence: 14,
            strength: 12,
            wisdom: 4
        },
        attacks: [
            {
                name: 'Call Lightning',
                diceNum: 3,
                diceVal: 6,
                type: 'Electricity'
            },
            {
                name: 'Thunder Wave',
                diceNum: 2,
                diceVal: 8,
                dicePerLev: 1,
                type: 'Normal'
            },
            {
                name: 'Thunder Wave',
                diceNum: 2,
                diceVal: 8,
                dicePerLev: 1,
                type: 'Normal'
            }
        ],
        spells: [
            {
                name: 'Wind Wall'
            },
            {
                name: 'Stone Shape'
            },
            {
                name: 'Stone Skin'
            },
            {
                name: 'Wall of Stone'
            },
            {
                name: 'Control Water'
            },
            {
                name: 'Cure Wounds',
                diceNum: 1,
                diceVal: 8,
                dicePerLev: 8
            }
        ],
        gameStats: {
            killCount: 50,
            koCount: 1,
        },
        imageURL: '/images/tiberius.svg',
        submitted: new Date(),
        live: false
    });


    Characters.insert({
        name: 'Vax',
        fullName: "Vax'ildan",
        actor: "Liam O'Brien",
        race: 'Half-elf',
        class: 'Rogue',
        homeland: "",
        charStats: {
            level: 11,
            charisma: 14,
            constitution: 10,
            dexterity: 20,
            intelligence: 16,
            strength: 14,
            wisdom: 14
        },
        attacks: [
            {
                name: 'Call Lightning',
                diceNum: 3,
                diceVal: 6,
                type: 'Electricity'
            },
            {
                name: 'Thunder Wave',
                diceNum: 2,
                diceVal: 8,
                dicePerLev: 1,
                type: 'Normal'
            },
            {
                name: 'Thunder Wave',
                diceNum: 2,
                diceVal: 8,
                dicePerLev: 1,
                type: 'Normal'
            }
        ],
        gameStats: {
            killCount: 68,
            koCount: 4
        },
        imageURL: '/images/vax.svg',
        submitted: new Date(),
        live: false
    });


    Characters.insert({
        name: 'Vex',
        fullName: "Vex'ahlia",
        actor: "Laura Bailey",
        race: 'Half-elf',
        class: 'Ranger',
        homeland: "",
        charStats: {
            level: 11,
            charisma: 17,
            constitution: 10,
            dexterity: 20,
            intelligence: 14,
            strength: 7,
            wisdom: 14
        },
        attacks: [
            {
                name: 'Call Lightning',
                diceNum: 3,
                diceVal: 6,
                type: 'Electricity'
            },
            {
                name: 'Thunder Wave',
                diceNum: 2,
                diceVal: 8,
                dicePerLev: 1,
                type: 'Normal'
            },
            {
                name: 'Thunder Wave',
                diceNum: 2,
                diceVal: 8,
                dicePerLev: 1,
                type: 'Normal'
            }
        ],
        spells: [
            {
                name: 'Wind Wall'
            },
            {
                name: 'Stone Shape'
            },
            {
                name: 'Stone Skin'
            },
            {
                name: 'Wall of Stone'
            },
            {
                name: 'Control Water'
            },
            {
                name: 'Cure Wounds',
                diceNum: 1,
                diceVal: 8,
                dicePerLev: 8
            }
        ],
        gameStats: {
            killCount: 45,
            koCount: 1
        },
        imageURL: '/images/vex.svg',
        submitted: new Date(),
        live: false
    });

}