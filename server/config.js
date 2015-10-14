ServiceConfiguration.configurations.upsert(
    { service: 'facebook'},
    {
        $set: {
            // TODO Hide key and secret using settings (http://joshowens.me/environment-settings-and-security-with-meteor-js/)
            appId: '955584821127237',
            loginStyle: 'popup',
            secret: 'b3afbb652af09ad1d7249c6ce8b31760'
        }
    }
);

Accounts.onCreateUser(function(options, user) {
    user.emails = [];
    if (user.services.facebook) {
        var facebook = user.services.facebook;
        user.emails.push(facebook.email);
        // remove spaces from Facebook name and store as username
        options.profile.username = facebook.name.replace(/\s+/g, '');
        options.profile.email = facebook.email;
        options.profile.firstName = facebook.first_name;
        options.profile.lastName = facebook.last_name;
        options.profile.gender = facebook.gender;
        options.profile.locale = facebook.locale;
        options.profile.image = 'http://graph.facebook.com/' + facebook.id + '/picture/?type=large';
    } else {
        user.emails.push(user.username);
        options.profile.email = user.username;
        // convert email to username
        user.username = user.username.substr(0, user.username.indexOf('@'));
    }

    options.profile.roles = [];
    options.profile.points = 0;

    if (options.profile) {
        user.profile = options.profile;
    }

    return user;
});