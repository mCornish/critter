Template.password_form.onCreated(function() {
    Session.set('forgottenPassword', true);
});

Template.password_form.onRendered(function() {
    $('[data-hook=forgot-pass-form]').validate({
        rules: {
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            email: {
                required: 'Please enter your email address.',
                email: 'Please enter a valid email address.'
            }
        }
    });
});

Template.password_form.events({
    'submit [data-hook=forgot-pass-form]': function(e) {
        e.preventDefault();
        const email = $(e.target).find('[name=email]').val();

        Meteor.call('sendResetEmail', email, function(err) {
            if (err) {
                throwError(err.reason);
            } else {
                notify('Email sent to ' + email);
                // toggle the state
                const state = Session.get('forgottenPassword');
                Session.set('forgottenPassword', !state);
            }
        });
    },
    'click [data-hook=password-cancel]': function(e, template) {
        e.preventDefault();
        $('.in-right').removeClass('is-active').on('transitionend', function () {
            $(this).off();
            $('.out-left').show(0).removeClass('is-active');
        });
    }
});