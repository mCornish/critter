let FB_ID = '';
let FB_SECRET = '';

if (process.env.NODE_ENV = 'development') {
    FB_ID = '1066271376729821';
    FB_SECRET = 'acc50853b6d29bd4105e65651a2aa578';
} else {
    FB_ID = '1065816680108624';
    FB_SECRET = 'eb38f5596605adafac6ba8f5a0e2e78c';
}

ServiceConfiguration.configurations.upsert(
    {service: 'facebook'},
    {
        $set: {
            // TODO Hide key and secret using settings (http://joshowens.me/environment-settings-and-security-with-meteor-js/)
            appId: FB_ID,
            loginStyle: 'popup',
            secret: FB_SECRET
        }
    }
);


Accounts.onCreateUser(function (options, user) {
    if (typeof user.emails === 'undefined') {
        user.emails = [];
    }
    if (user.services.facebook) {
        var facebook = user.services.facebook;
        user.emails.push({address: facebook.email});
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

    // mixpanel.track('User created', user); Uncomment when ready to test

    return user;
});