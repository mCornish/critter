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
            killCount: 22,
            koCount: 5
        },
        imageURL: '/images/grog.png',
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
            killCount: 10,
            koCount: 0
        },
        imageURL: '/images/keyleth.png',
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
            level: 11,
            charisma: 14,
            constitution: 14,
            dexterity: 22,
            intelligence: 16,
            strength: 12,
            wisdom: 16
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
            killCount: 43,
            koCount: 1
        },
        imageURL: '/images/percy.png',
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
        imageURL: '/images/pike.png',
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
            level: 11,
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
        imageURL: '/images/scanlan.png',
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
        imageURL: '/images/tiberius.png',
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
        imageURL: '/images/vax.png',
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
        imageURL: '/images/vex.png',
        submitted: new Date(),
        live: false
    });

}