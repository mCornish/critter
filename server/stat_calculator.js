// Run every hour
(function() {
    Meteor.setInterval(function() {
        const characters = Characters.find().fetch();
        const episodes = Episodes.find().fetch();
        const actions = Actions.find().fetch();
        const stats = Stats.find().fetch();

        // Episode rolls
        episodes.forEach(function (ep) {
            const epActions = _.where(actions, {episode: ep.number});
            const count = epActions.length;
            let sum = 0;
            epActions.forEach(function (action) {
                sum += action.roll;
            });
            const average = Math.floor( sum / count );

            let stat = {
                name: 'rolls',
                character: '',
                episode: ep.number,
                value: average
            };

            // Check if the stat already exists and update/insert accordingly
            if (_.findWhere(stats, {name: 'rolls', episode: ep.number}) === undefined) {
                stat = _.extend(stat, {
                    submitted: new Date()
                });
                Stats.insert(stat);
            } else {
                Stats.update({name: 'rolls', episode: ep.number}, {$set: stat});
            }
        });

        // Character rolls
        characters.forEach(function(char) {
            const charActions = _.where(actions, {character: char.name});
            const count = charActions.length;
            let sum = 0;
            charActions.forEach(function (action) {
                sum += action.roll;
            });
            const average = Math.floor( sum / count );

            let stat = {
                name: 'rolls',
                character: char.name,
                episode: '',
                value: average
            };

            // Check if the stat already exists and update/insert accordingly
            if (_.findWhere(stats, {name: 'rolls', character: char.name}) === undefined) {
                stat = _.extend(stat, {
                    submitted: new Date()
                });
                Stats.insert(stat);
            } else {
                Stats.update({name: 'rolls', character: char.name}, {$set: stat});
            }
        });
    }, 3600);
})();