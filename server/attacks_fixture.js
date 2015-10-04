if (Attacks.find().count() === 0) {

    const characters = ['Vax', 'Vex', 'Pike', 'Grog', 'Percy', 'Keyleth', 'Tiberius', 'Scanlan'];
    const types = ['Regular', 'Fire', 'Bludgening', 'Water', 'Slashing'];

    for (let i = 0; i < 100; i++) {
        Attacks.insert({
            character: characters[Math.floor(Math.random() * (7 + 1))],
            hit: Math.random() < 0.5 ? true : false,
            lethal: Math.random() < 0.5 ? true : false,
            damage: Math.floor(Math.random() * (60)) + 1,
            type: Math.random() < 0.5 ? types[0] : types[Math.floor(Math.random() * (4 + 1))],
            time: {
                hour: Math.floor(Math.random() * (5 - 2 + 1)) + 2,
                minute: Math.floor(Math.random() * (59 + 1)),
                second: Math.floor(Math.random() * (59 + 1))
            }
        });
    }

}