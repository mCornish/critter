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

Router.route('watch', {
    waitOn: function() {
        Meteor.subscribe('characters');
        Meteor.subscribe('stream');
    },
    data: function () {
        return {
            liveChars: Characters.find({ live: true }),
            stream: Stream.findOne()
        }
    }
});

Router.route('stats', {
    waitOn: function() {
        Meteor.subscribe('characters');
        Meteor.subscribe('stream');
    },
    data: function () {
        return {
            liveChars: Characters.find({ live: true }),
            stream: Stream.findOne()
        }
    }
});

Router.route('track', {
    waitOn: function() {
        Meteor.subscribe('characters');
        Meteor.subscribe('stream');
    },
    data: function () {
        return {
            liveChars: Characters.find({ live: true }),
            stream: Stream.findOne()
        }
    }
});

Router.route('companion', {
    waitOn: function() {
        Meteor.subscribe('characters');
        Meteor.subscribe('stream');
    },
    data: function () {
        return {
            liveChars: Characters.find({ live: true }),
            stream: Stream.findOne()
        }
    }
});

Router.route('admin', {
    name: 'admin',
    waitOn: function() {
        Meteor.subscribe('characters');
        Meteor.subscribe('stream');
    },
    data: function() {
        return {
            stream: Stream.findOne()
        }
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