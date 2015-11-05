if (Actions.find().count() === 0) {

    const characters = ['Vax', 'Vex', 'Pike', 'Grog', 'Percy', 'Keyleth', 'Tiberius', 'Scanlan'];
    const actions = ['attack', 'cast', 'check', 'save'];
    const types = ['Regular', 'Fire', 'Bludgening', 'Water', 'Slashing'];
    const diceVals = [3, 4, 6, 8, 20];

    for (let i = 0; i < 100; i++) {
        Actions.insert({
            character: Random.choice(characters),
            episode: Math.floor(Math.random() * (25 - 1 + 1) + 1),
            name: Random.choice(actions),
            roll: Math.floor(Math.random() * (20 - 1 + 1) + 1),
            success: Math.random() < 0.5,
            lethal: Math.random() < 0.5,
            type: Math.random() < 0.5 ? types[0] : Random.choice(types),
            diceCount: Math.floor(Math.random() * (6 - 1 + 1) + 1),
            diceVal: Random.choice(diceVals),
            time: {
                hour: Math.floor(Math.random() * (5 - 2 + 1)) + 2,
                minute: Math.floor(Math.random() * (59 + 1)),
                second: Math.floor(Math.random() * (59 + 1))
            }
        });
    }

}