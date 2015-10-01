Template.home.onRendered(function() {
    Session.setDefault('isLive', false);
});

Template.home.helpers({
    isLive: function() {
        return Session.get('isLive');
    }
});

Template.home.events({
    'click [data-hook="log-out"]': function(e) {
        e.preventDefault();

        Meteor.logout(function(error) {
            if (error) {
                alert(error.reason);
            }
        });
    }
});

Template.home.onDestroyed(function() {
    Session.set('headerIsSimple', false);
});