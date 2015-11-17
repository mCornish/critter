Template.layout.onCreated(function() {
    const clientID = 'gnaco6mlplv9shlc9demh6dljdny4we';
    Twitch.init({clientId: clientID}, function(error, status) {
        if (error) {
            console.log(error);
        }
    });
    Twitch.getStatus(function(err, status) {
        if (status.authenticated) {
            Session.set('twitchToken', status.token);
            if (!Meteor.userId()) {

            }
        }
    });

    // Log Date that user loaded layout
    if (Meteor.userId()) {
        Meteor.call('updateActivity');
    }

    const route = Router.current().route.getName();
    mixpanel.track('View', {route: route});

    Session.set('testing', true);
});

Template.layout.onRendered(function() {

});

Template.layout.helpers({
    authedClass: function() {
        const unauthed = typeof Meteor.userId() !== 'string';
        const isHome = Router.current().route.path() === '/';

        return unauthed && isHome ? 'is-unauthed' : '';
    },
    testing: function() {
        return Session.get('testing');
    }
});

Template.layout.events({
    //'click [data-hook=noTest]': function(e) {
    //    e.preventDefault();
    //    throwError('Sorry, only the Companion (Watch Live) is available during this test.');
    //}
});