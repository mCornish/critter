Template.giftSubmit.onCreated(function() {
    Session.set('giftSubmitErrors', {});
    Session.set('imageName', null);
    Session.set('imageURL', null);
});
Template.giftSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('giftSubmitErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('giftSubmitErrors')[field] ? 'has-error' : '';
    },
    imageName: function() {
        return Session.get('imageName');
    },
    imageURL: function() {
        return Session.get('imageURL');
    }
});

Template.giftSubmit.events({
    'click [data-hook=submit]': function(e) {
        e.preventDefault();

        const $form = $('[data-hook=form]');
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

        const errors = validateGift(gift);
        if (errors.image || errors.description)
            return Session.set('giftSubmitErrors', errors);

        Meteor.call('giftInsert', gift, function(error, result) {
            if (error) {
                return throwError(error.reason);
            }
            mixpanel.track("Gift submit");
            Router.go('giftPage', {_id: result._id});
        });
    },
    'click [data-hook=submit-cancel]': function(e) {
        e.preventDefault();

        const isCanceled = window.confirm('Are you sure you want to cancel your submission?');

        if (isCanceled) {
            window.location = '/';
        }
    },
    'change [name=image]': function(e) {
        FS.Utility.eachFile(e, function(file) {
            Images.insert(file, function (err, fileObj) {
                if (err) {
                    alert(err.reason)
                } else {
                    Session.set('imageName', fileObj.original.name);
                    Session.set('imageURL', '/cfs/files/images/' + fileObj._id);
                }
            });
        });
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