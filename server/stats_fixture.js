if (Stats.find().count() === 0) {

    const characters = Characters.find().fetch();
    const episodes = Episodes.find().fetch();

    Stats.insert({
        action: 'check',
        name: 'acrobatics',
        value: 0,
        valueCount: 0,
        character: char.name,
        episode: 1
    });
    Stats.insert({
        action: 'check',
        name: 'deception',
        value: 0,
        valueCount: 0,
        character: char.name,
        episode: 1
    });

}