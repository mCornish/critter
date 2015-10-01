Template.profile.onCreated( function() {
    const user = Router.current().data();
    const imageURL = user.profile.image;

    Session.set('imageURL', imageURL);
    Session.set('profileSubmitErrors', {});
    Session.set('successMessage', null);
});

Template.profile.helpers({
    errorMessage: function(field) {
        return Session.get('profileSubmitErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('profileSubmitErrors')[field] ? 'has-error' : '';
    },
    successMessage: function() {
        return Session.get('successMessage');
    },
    genderActive: function(gender) {
        const user = Router.current().data();

        if (gender === user.profile.gender) {
            return 'checked';
        } else {
            return '';
        }
    },
    countries: function() {
        return Session.get('countries');
    },
    countryActive: function(country) {
        const user = Router.current().data();

        if (country === user.profile.country) {
            return 'selected';
        } else {
            return '';
        }
    }
});

Template.profile.events({
    'click [data-hook=submit]': function(e) {
        e.preventDefault();

        const $form = $('form');

        const username = $form.find('[name=username]').val(),
            image = Session.get('imageURL'),
            firstName = $form.find('[name=first-name]').val(),
            lastName = $form.find('[name=last-name]').val(),
            gender = $form.find('[name=gender]:checked').val(),
            birthday = $form.find('[name=birthday]').val(),
            website = $form.find('[name=website]').val(),
            country = $form.find('[name=country]').val(),
            location = $form.find('[name=location]').val();

        const userProperties = {
            username: username,
            image: image,
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            birthday: birthday,
            website: website,
            country: country,
            location: location
        };

        const errors = validateUser(userProperties);
        if (errors.username) {
            return Session.set('profileSubmitErrors', errors);
        }

        // create user object with profile data for update
        const user = {
            'profile.username': username,
            'profile.image': image,
            'profile.firstName': firstName,
            'profile.lastName': lastName,
            'profile.gender': gender,
            'profile.birthday': birthday,
            'profile.website': website,
            'profile.country': country,
            'profile.location': location
        };

        Meteor.users.update(Meteor.userId(), {$set: user}, function(error) {
            if (error) {
                alert(error.reason);
            } else {
                Session.set('successMessage', 'Account updated');
            }
        });
    },
    'change [name=image]': function(e) {
        FS.Utility.eachFile(e, function(file) {
            Images.insert(file, function (err, fileObj) {
                if (err) {
                    alert(err.reason)
                } else {
                    Session.set('imageURL', '/cfs/files/images/' + fileObj._id);
                }
            });
        });
    },
    'click [data-hook=submit-cancel]': function(e) {
        e.preventDefault();

        const isCanceled = window.confirm('Are you sure you want to cancel your update?');

        if (isCanceled) {
            window.location = '/';
        }
    }
});

var validateUser = function(user) {
    const errors = {};
    if (!user.username) {
        errors.username = 'Please enter a username';
    }
    return errors;
};