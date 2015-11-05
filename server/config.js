if (process.env.NODE_ENV === 'development') {
    ServiceConfiguration.configurations.upsert(
        {service: 'facebook'},
        {
            $set: {
                // TODO Hide key and secret using settings (http://joshowens.me/environment-settings-and-security-with-meteor-js/)
                appId: '1066271376729821',
                loginStyle: 'popup',
                secret: 'acc50853b6d29bd4105e65651a2aa578'
            }
        }
    )
} else {
    ServiceConfiguration.configurations.upsert(
        {service: 'facebook'},
        {
            $set: {
                // TODO Hide key and secret using settings (http://joshowens.me/environment-settings-and-security-with-meteor-js/)
                appId: '1065816680108624',
                loginStyle: 'popup',
                secret: 'eb38f5596605adafac6ba8f5a0e2e78c'
            }
        }
    )
}

Accounts.onCreateUser(function (options, user) {
    if (typeof user.emails === 'undefined') {
        user.emails = [];
    }
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

    if (typeof user.roles === 'undefined') {
        user.roles = [];
    }
    options.profile.points = 0;

    if (options.profile) {
        user.profile = options.profile;
    }

    return user;
});