Template.layout.onRendered(function() {
    Session.setDefault('headerIsSimple', false);
    Session.set('headerIsActive', true);
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
    }
});