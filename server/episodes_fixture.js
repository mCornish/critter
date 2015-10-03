if (Episodes.find().count() === 0) {

    Episodes.insert({
        number: 1,
        name: 'Arrival at Kraghammer',
        cast: ['Vax', 'Vex', 'Grog', 'Percy', 'Keyleth', 'Tiberius', 'Scanlan'],
        // TODO Find original air dates
        airDate: new Date(2015, 3, 13)
    });

    Episodes.insert({
        number: 2,
        name: 'Into the Greyspine Mines',
        cast: ['Vax', 'Vex', 'Grog', 'Percy', 'Keyleth', 'Tiberius', 'Scanlan'],
        airDate: new Date(2015, 3, 20)
    });

    Episodes.insert({
        number: 3,
        name: 'Strange Bedfellows',
        cast: ['Vax', 'Vex', 'Grog', 'Percy', 'Keyleth', 'Tiberius', 'Scanlan'],
        airDate: new Date(2015, 3, 27)
    });

    Episodes.insert({
        number: 4,
        name: 'Attack on the Duergar Warcamp',
        cast: ['Vax', 'Vex', 'Pike', 'Grog', 'Percy', 'Keyleth', 'Tiberius', 'Scanlan'],
        airDate: new Date(2015, 4, 3)
    });

    Episodes.insert({
        number: 5,
        name: 'The Trick About Falling',
        cast: ['Vax', 'Vex', 'Pike', 'Grog', 'Percy', 'Keyleth', 'Tiberius'],
        airDate: new Date(2015, 4, 3)
    });

    Episodes.insert({
        number: 6,
        name: 'Breaching the Emberhold',
        cast: ['Vax', 'Vex', 'Pike', 'Grog', 'Percy', 'Keyleth', 'Tiberius', 'Scanlan'],
        airDate: new Date(2015, 4, 17)
    });

    Episodes.insert({
        number: 7,
        name: 'The Throne Room',
        cast: ['Vax', 'Vex', 'Pike', 'Percy', 'Keyleth', 'Tiberius', 'Scanlan'],
        airDate: new Date(2015, 4, 24)
    });

    Episodes.insert({
        number: 8,
        name: 'Glass and Bone',
        cast: ['Vax', 'Vex', 'Pike', 'Percy', 'Keyleth', 'Tiberius', 'Scanlan'],
        airDate: new Date(2015, 5, 1)
    });

    Episodes.insert({
        number: 9,
        name: 'Yug\'Voril Uncovered',
        cast: ['Vax', 'Vex', 'Grog', 'Percy', 'Keyleth', 'Tiberius', 'Scanlan'],
        airDate: new Date(2015, 5, 8)
    });

    Episodes.insert({
        number: 10,
        name: 'K\'Varn Revealed',
        cast: ['Vax', 'Vex', 'Pike', 'Grog', 'Percy', 'Keyleth', 'Tiberius', 'Scanlan'],
        airDate: new Date(2015, 5, 15)
    });

    Episodes.insert({
        number: 11,
        name: 'The Temple Showdown',
        cast: ['Vax', 'Vex', 'Pike', 'Grog', 'Percy', 'Keyleth', 'Tiberius', 'Scanlan'],
        airDate: new Date(2015, 5, 22)
    });

    Episodes.insert({
        number: 12,
        name: 'Dungeons & Dragons Campaign Tips',
        cast: ['Vox Moronica'],
        airDate: new Date(2015, 5, 29)
    });

    Episodes.insert({
        number: 13,
        name: 'Escape From the Underdark',
        cast: ['Vax', 'Vex', 'Pike', 'Grog', 'Percy', 'Keyleth', 'Tiberius', 'Scanlan'],
        airDate: new Date(2015, 6, 8)
    });

    Episodes.insert({
        number: 14,
        name: 'Shopping and Shipping',
        cast: ['Vax', 'Vex', 'Pike', 'Grog', 'Percy', 'Keyleth', 'Tiberius'],
        airDate: new Date(2015, 6, 15)
    });

    Episodes.insert({
        number: 15,
        name: 'Skyward',
        cast: ['Vax', 'Vex', 'Pike', 'Grog', 'Percy', 'Keyleth', 'Tiberius'],
        airDate: new Date(2015, 6, 29)
    });

}