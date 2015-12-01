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
            appId: '1065816680108624',
            loginStyle: 'popup',
            secret: 'eb38f5596605adafac6ba8f5a0e2e78c'
        }
    }
);

testerEmails = [
    'cornishmw@gmail.com',
    'cornish.mw@gmail.com',
    'mi_wi_co@yahoo.com',
    'cole_peosoldier@yahoo.com',
    'lauren3112@gmail.com',
    'bubblebooy@gmail.com,Max,Garber',
    'gittler.nicholas@gmail.com',
    'johnwuich89@gmail.com',
    'mhamurrain@gmail.com,Milinda,Alston-Murrain',
    'jmercado808@gmail.com',
    'hey_man2@hotmail.com',
    'chasejessica2000@yahoo.com',
    'tiptoetabby@gmail.com',
    'andrew.arayas@snhu.edu',
    'matthewroberts86@gmail.com',
    'ravynfeather@gmail.com',
    'chrispinhal@gmail.com',
    'baddy1987@gmail.com',
    'bram.bertels@gmail.com',
    'markdigz@gmail.com',
    'dexcuracy@gmail.com',
    'Jordanmcr1@gmail.com',
    'qdude2000@gmail.com',
    'thousandsunnygo@outlook.com',
    'tommi.putkonen@gmail.com',
    'sarahlou.todd@gmail.com',
    '12cm98@queensu.ca',
    'uncertainspin@gmail.com',
    'terence.m.farrell@gmail.com',
    'ndbottles@gmail.com',
    'mole@criticalmole.com',
    'darkleoforever@yahoo.com',
    'philipdomondon@gmail.com',
    'mfission@gmail.com',
    'Eric.Puckett@gmail.com',
    'nexangames@gmail.com',
    'grant.c.tipton@gmail.com',
    'stephen@stephenwade.me',
    'johnnyboy9106@hotmail.com',
    '1337ipsa@gmail.com',
    'robertosment@gmail.com',
    'Aligubbs@gmail.com',
    'aowhijun@gmail.com',
    'zammyzams@gmail.com',
    'gerard.almazar@gmail.com',
    'leonerihaze@gmail.com',
    'erik.shaver@yahoo.com',
    'andrewrsm@gmail.com',
    'comrade.christoh@gmail.com',
    'jdaniels.tuason@gmail.com',
    'aclowe10@gmail.com',
    'xxdark.dragonxx@gmail.com',
    'roy.desimone@gmail.com',
    'cool_kidd123@hotmail.com',
    'achoran0524@gmail.com',
    'kolsothy@gmail.com',
    'Mcordovez@outlook.com',
    'ceddie@live.ca',
    'nursethalia@gmail.com',
    'xeanibean@gmail.com',
    'thegrumpycell@gmail.com',
    'andrews@gate.net',
    'xbIu3b1rdx@gmail.com',
    'engrishteacher@yahoo.com',
    'dreamingxreader@gmail.com',
    'brandonhuntley212@gmail.com',
    'bikebaykara@hotmail.com',
    'james.mascioli@gmail.com',
    'dewey_99@hotmail.com',
    'wacor001@mail.goucher.edu',
    'cole_peosoldier@yahoo.com',
    'duncanmacrae1@live.co.uk',
    'lmd59@cornell.edu',
    'rodriguez.nina93@gmail.com',
    'saevrick@gmail.com',
    'vanhallj@gmail.com',
    'stoo@stoo.org.uk',
    'marly.atlin@gmail.com',
    'eliz@gammastronomer.com'
];

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