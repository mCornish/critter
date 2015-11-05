Template.stats.onCreated(function () {
    // Calculate stats
    if (typeof Meteor.userId() === 'string') {
        const lastActive = Meteor.user().profile.lastActive;
        const lastMoment = moment(lastActive);
        const now = moment(new Date());
        const lastHour = now.subtract(1, 'hour');

        // If it's been over an hour since last activity, update stats
        if (lastHour > lastMoment) {
            //updateStats(Template.parentData(1));
        }
    }
});

Template.stats.helpers({
    topKiller: function () {

    }
});

Template.stats.events({});


const updateStats = function (data) {
    const episodes = data.episodes.fetch();

    episodes.forEach(function (ep) {
        const actions = data.actions.fetch();
        const epActions = _.where(actions, {episode: ep.number});
        const count = epActions.length;
        let sum = 0;
        epActions.forEach(function (action) {
            sum += action.roll;
        });
        stat = {
            name: 'rolls',
            character: '',
            episode: '',
            value: 0

        };

        console.log(sum / count);
    });
};
