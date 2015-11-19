Template.layout.onRendered(function() {
    Session.setDefault('headerIsSimple', false);
    Session.set('headerIsActive', true);
    Session.set('backLink', null);
});

Template.header.helpers({
    logoSize: function() {
        var routeName = Router.current().route.getName();

        return (routeName === 'home' || routeName === 'login') && !Meteor.userId() ? '' : 'logo--small';
    },
    headerClass: function() {
        if(Session.get('headerIsSimple')) {
            return 'is-simple';
        } else {
            return '';
        }
    },
    headerActive: function() {
        if(!Session.get('headerIsActive')) {
            return 'hidden';
        } else {
            return '';
        }
    },
    menuActive: function(route) {

        return route === Session.get('route') ? 'is-active' : '';
    },
    isAuthed: function() {
        return Meteor.userId().length;
    },
    authedClass: function() {
        const unauthed = typeof Meteor.userId() !== 'string';
        const isHome = Router.current().route.path() === '/';

        return unauthed && isHome ? 'is-unauthed' : '';
    },
    homeUnauthed: function() {
        const unauthed = typeof Meteor.userId() !== 'string';
        const isHome = Router.current().route.path() === '/';

        return unauthed && isHome;
    },
    backLink: function() {
        return Session.get('backLink');
    }
});

Template.header.events({
    'click [data-track=logo]': function() {
        mixpanel.track('Logo click');
    }
});