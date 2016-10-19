// ServiceConfiguration.configurations.upsert(
//     {service: 'facebook'},
//     {
//         $set: {
//             // TODO Hide key and secret using settings (http://joshowens.me/environment-settings-and-security-with-meteor-js/)
//             appId: Meteor.settings.public.facebook.appId,
//             loginStyle: 'popup',
//             secret: Meteor.settings.private.facebook.secret
//         }
//     }
// );

//testerEmails = Meteor.settings.private.approvedEmails;

// REMEMBER TO REMOVE BETA ROLE
Accounts.onCreateUser(function (options, user) {
    if (typeof user.emails === 'undefined') {
        user.emails = [];
    }
    if (user.services.facebook) {
        var facebook = user.services.facebook;
        if (testerEmails.indexOf(facebook.email) < 0) {
            throw new Meteor.Error('non-tester', 'Only approved testers may register.')
        }
        user.emails.push({address: facebook.email, verified: true});
        // remove spaces from Facebook name and store as username
        user.username = facebook.email.substr(0, facebook.email.indexOf('@'));
        options.profile.email = facebook.email;
        options.profile.firstName = facebook.first_name;
        options.profile.lastName = facebook.last_name;
        options.profile.gender = facebook.gender;
        options.profile.locale = facebook.locale;
        options.profile.image = 'http://graph.facebook.com/' + facebook.id + '/picture/?type=large';
    } else {
        if (testerEmails.indexOf(user.username) < 0) {
            throw new Meteor.Error('non-tester', 'Only approved testers may register.')
        }
        user.emails.push({address: user.username, verified: false});
        options.profile.email = user.username;
        // convert email to username
        user.username = user.username.substr(0, user.username.indexOf('@'));
    }

    if (typeof user.roles === 'undefined') {
        user.roles = ['beta'];  // REMEMBER TO REMOVE THIS
    }
    options.profile.points = 0;

    if (options.profile) {
        user.profile = options.profile;
    }

    return user;
});
