Template.layout.onRendered(function() {
    Session.setDefault('headerIsSimple', false);
    Session.set('headerIsActive', true);
    Session.set('backLink', null);
});

Template.header.helpers({
    menuActive: function(route) {

        return route === Session.get('route') ? 'is-active' : '';
    },
    isAuthed: function() {
        return typeof Meteor.userId() === 'string';
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
    'click [data-track=header-button]': function() {
        analytics.track('Header click');
    },
    'click [data-hook=stats-button]': function(e) {
        e.preventDefault();
        throwError('The Stats section is not yet available.')
    }
});