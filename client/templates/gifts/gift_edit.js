Template.giftEdit.onCreated(function() {
    Session.set('giftEditErrors', {});
});
Template.giftEdit.helpers({
    errorMessage: function(field) {
        return Session.get('giftEditErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('giftEditErrors')[field] ? 'has-error' : '';
    },
    occasionActive: function(occasion) {
        const gift = Router.current().data().gift;

        if (occasion === gift.occasion) {
            return 'selected';
        } else {
            return '';
        }
    },
    recipientActive: function(recipient) {
        const gift = Router.current().data().gift;

        if (recipient === gift.recipient) {
            return 'selected';
        } else {
            return '';
        }
    }
});

Template.giftEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        const currentGiftId = this._id,
            $form = $('[data-hook=form]');

        const gift = {
            image: Session.get('imageURL'),
            description: $form.find('[name=description]').val(),
            link: $form.find('[name=link]').val(),
            // Use parse to convert strings to numbers
            price: parseFloat( $form.find('[name=price]').val() ),
            recipient: $form.find('[name=recipient]').val(),
            age: parseInt( $form.find('[name=age]').val() ),
            occasion: $form.find('[name=occasion]').val()
        };

        var errors = validateGift(gift);
        if (errors.image || errors.description)
            return Session.set('giftSubmitErrors', errors);

        Gifts.update(currentGiftId, {$set: giftProperties}, function(error) {
            if (error) {
                throwError(error.reason);
            } else {
                mixpanel.track('gift-edit', {timestamp: Date.now()});
                Router.go('giftPage', {_id: currentGiftId});
            }
        });
    },
    'click [data-hook=submit-cancel]': function(e) {
        e.preventDefault();

        var isCanceled = window.confirm('Are you sure you want to cancel your submission?');

        if (isCanceled) {
            Router.go('home');
        }
    },
    'click [data-hook="delete"]': function(e) {
        e.preventDefault();

        if (confirm("Delete this gift?")) {
            var currentGiftId = this._id;
            mixpanel.track('gift-delete', {timestamp: Date.now(), user: this.userId});
            Gifts.remove(currentGiftId);
            Router.go('home');
        }
    }
});

var validateGift = function(gift) {
    const errors = {};
    if (!gift.image) {
        errors.image = 'Please choose an image';
    } else if (!gift.description) {
        errors.description = 'Please enter a description';
    }
    return errors;
};