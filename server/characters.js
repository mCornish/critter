if (Characters.find().count() === 0) {

    Characters.insert({
        name: 'Scanlan',
        actor: 'Sam Reigel',
        race: 'Gnome',
        class: 'Bard',
        stats: {
            charisma: 1,
            constitution: 1,
            dexterity: 1,
            intelligence: 1,
            strength: 1,
            wisdom: 1
        },
        imgURL: '',
        submitted: new Date()
    });

    Characters.insert({
        name: 'Pike',
        actor: 'Ashley Johnson',
        race: 'Gnome',
        class: 'Cleric',
        stats: {
            charisma: 1,
            constitution: 1,
            dexterity: 1,
            intelligence: 1,
            strength: 1,
            wisdom: 1
        },
        imgURL: '',
        submitted: new Date()
    });

}