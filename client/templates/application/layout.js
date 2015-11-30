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
});

Template.layout.onRendered(function() {
    if (Meteor.userId()) {
        console.log('hit');
        Meteor.setTimeout(function() {
            if('emails' in Meteor.user() && (typeof Meteor.user().emails[0] === 'string')) {
                console.log('fix');
                Meteor.call('fixEmail', Meteor.user().emails[0]);
            }
        }, 3000);
    }
});

Template.layout.helpers({
    homeUnauthed: function() {
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