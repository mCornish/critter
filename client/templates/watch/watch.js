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
    },
    'click [data-hook="live"]': function(e) {
        Router.go('companion');
    }
});