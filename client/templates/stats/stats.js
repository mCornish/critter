Template.stats.onCreated(function () {
    // Calculate stats
    if (typeof Meteor.userId() === 'string') {
        const lastActive = Meteor.user().profile.lastActive;
        const lastMoment = moment(lastActive);
        const now = moment(new Date());
        const lastHour = now.subtract(1, 'hour');

        // If it's been over an hour since last activity, update stats
        if (lastHour > lastMoment) {
            updateStats(Template.parentData(1));
        }
        // REMOVE THIS
        updateStats(Template.parentData(1)); // REMOVE THIS
    }
});

Template.stats.helpers({
    topKiller: function () {
        const kills = this.kills.fetch();
    }
});

Template.stats.events({});


const updateStats = function (data) {
    const episodes = data.episodes.fetch();

    episodes.forEach(function (ep) {
        const actions = data.actions.fetch();
        console.log(actions);
        const epActions = _.where(actions, {episode: ep.number});
        //console.log(epActions);
        const count = epActions.length;
        console.log(count);
        let sum = 0;
        epActions.forEach(function (action) {
            sum += action.roll;
            console.log(sum);
        });
        console.log(sum / count);
    });
};