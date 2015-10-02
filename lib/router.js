Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() {
        return [
            Meteor.subscribe('notifications'),
            Meteor.subscribe('images')
        ];
    }
});

Router.route('companion', {
    waitOn: function() {
        Meteor.subscribe('characters');
    },
    data: function () {
        //return Meteor.user()
    }
});

Router.route('admin', {
    name: 'admin',
    waitOn: function() {
        Meteor.subscribe('characters');
    }
});

Router.route('login', {
    name: 'login',
    waitOn: function() {
        Meteor.subscribe('users');
    }
});

Router.route('/', {
    name: 'home',
    waitOn: function() {
    },
    data: function() {
        return {
        }
    }
});

var requireLogin = function() {
    if (! Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
};

Router.onBeforeAction('dataNotFound', {only: 'giftPage'});
Router.onBeforeAction(requireLogin, {only: ['giftSubmit', 'account', 'admin']});