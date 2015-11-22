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
    },
    'submit [data-hook=form]': function(e) {
        e.preventDefault();
        const $form = $(e.target);
        const email = {
            to: 'cornishmw@gmail.com',
            from: $form.find('[name=email]').val(),
            subject: $form.find('[name=subject]').val(),
            text: $form.find('[name=message]').val()
        };

        Meteor.call('sendEmail', email, function(err) {
            if (err) {
                throwError(error.reason);
            } else {
                notify('Feedback sent!');
                Session.set('showForm', false);
            }
        });
    }
});