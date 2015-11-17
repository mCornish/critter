Template.feedback.onCreated(function () {
    Session.set('showForm', false);
});

Template.feedback.helpers({
    showForm: function() {
        return Session.get('showForm');
    }
});

Template.feedback.events({
    'click [data-hook=open]': function() {
        Session.set('showForm', true);
    },
    'click [data-hook=close]': function() {
        Session.set('showForm', false);
    }
});