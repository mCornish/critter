Template.watch.onCreated(function () {
    Session.set('choosing', true);
    Session.set('watching', false)
});

Template.watch.helpers({
    choosing: function() {
        return Session.get('choosing');
    },
    authed: function() {
        return typeof Meteor.userId() === 'string';
    }
});

Template.watch.events({
    'click [data-hook=watch]': function () {
        throwError('Sorry, only the Companion (Watch Live) is available during this test.');
        //UNCOMMENT AFTER BETA Session.set('watching', true);
        //UNCOMMENT AFTER BETA Session.set('choosing', false);
        mixpanel.track('Watch Past button click');
    },
    'click [data-hook="live"]': function(e) {
        mixpanel.track('Watch Live button click');
        Router.go('companion');
    },
    'click [data-track="track"]': function(e) {
        mixpanel.track('Track button click');
    },
    'click [data-track="login"]': function(e) {
        mixpanel.track('Login button click');
    }
});