Template.watch.onCreated(function () {
    Session.set('choosing', true);
    Session.set('watching', false)
});

Template.watch.helpers({
    choosing: function() {
        return Session.get('choosing');
    },
    authed: function() {
        return typeof Meteor.userId() === 'string' ? true : false;
    }
});

Template.watch.events({
    'click [data-hook=watch]': function () {
        Session.set('watching', true);
        Session.set('choosing', false);
    },
    'click [data-hook="live"]': function(e) {
        Router.go('companion');
    }
});