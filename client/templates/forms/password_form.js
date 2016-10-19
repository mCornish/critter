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
        const $flipFull = $('[data-hook=login-container]');
        const $lift = $('[data-hook=login-container] .lift');
        const $flip = $('[data-hook=login-container] .flip');
        const $flop = $('[data-hook=login-container] .flop');
        const liftDur = getDuration($('.lift'));
        const flipDur = getDuration($flipFull) / 2;
        let delay = 0;

        activate($lift, 0);
        deactivate($flipFull, delay += liftDur - 100);
        deactivate($flop, delay);
        deactivate($flip, delay + flipDur, function() {
            deactivate($lift, flipDur);
        });
    }
});