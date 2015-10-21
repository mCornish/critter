Template.watch.onCreated(function () {
    Session.set('choosing', true);
    Session.set('watching', false)
});

Template.watch.helpers({
    choosing: function() {
        return Session.get('choosing');
    }
});

Template.watch.events({
    'click [data-hook=watch]': function () {
        Session.set('watching', true);
        Session.set('choosing', false);
    }
});