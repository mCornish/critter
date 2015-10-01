Template.userPage.onRendered(function() {
    const profile = Router.current().data().user.profile;
    Session.set('hasName', profile.firstName != null);
    Session.set('hasGender', profile.gender != null);
    Session.set('hasBirthday', profile.birthday != null);
    Session.set('hasCountry', profile.country != null);
    Session.set('hasLocation', profile.location != null);
    Session.set('hasWebsite', profile.website != null);
});

Template.userPage.helpers({
    haveRecommendations: function() {
        const gifts = Router.current().data().gifts;
        return gifts.count() > 0;
    },
    haveWants: function() {
        const gifts = Router.current().data().wants;
        return gifts.count() > 0;
    },
    hasName: function() {
        return Session.get('hasName');
    },
    hasGender: function() {
        return Session.get('hasGender');
    },
    hasBirthday: function() {
        return Session.get('hasBirthday');
    },
    birthdayFormatted: function() {
        const profile = Router.current().data().user.profile;
        const birthday = profile.birthday;
        return birthday;
    },
    hasCountry: function() {
        return Session.get('hasCountry');
    },
    hasLocation: function() {
        return Session.get('hasLocation');
    },
    hasWebsite: function() {
        return Session.get('hasWebsite');
    },
    websiteName: function() {
        // Get hostname of website based on this:
        // http://stackoverflow.com/questions/736513/how-do-i-parse-a-url-into-hostname-and-path-in-javascript
        const profile = Router.current().data().user.profile;
        const website = profile.website;
        const loc = document.createElement('a');
        loc.href = profile.website;
        return loc.hostname;
    }
});