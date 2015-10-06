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

Router.route('stats/character/:_id', {
    name: 'characterStats',
    template: 'statPage',
    waitOn: function() {
        Meteor.subscribe('character', this.params._id);
        Meteor.subscribe('attacks', {character: this.params._id});
        Meteor.subscribe('casts', {character: this.params._id});
        Meteor.subscribe('checks', {character: this.params._id});
        Meteor.subscribe('saves', {character: this.params._id});
    },
    data: function () {
        return {
            character: Characters.findOne(this.params._id),
            attacks: Attacks.find({character: this.params._id}),
            casts: Casts.find({character: this.params._id}),
            checks: Checks.find({character: this.params._id}),
            saves: Saves.find({character: this.params._id})
        }
    }
});

Router.route('stats/team', {
    name: 'teamStats',
    template: 'statPage',
    waitOn: function() {
        Meteor.subscribe('character', this.params._id);
        Meteor.subscribe('attacks');
        Meteor.subscribe('casts');
        Meteor.subscribe('checks');
        Meteor.subscribe('saves');
    },
    data: function () {
        return {
            character: Characters.findOne(this.params._id),
            attacks: Attacks.find(),
            casts: Casts.find(),
            checks: Checks.find(),
            saves: Saves.find()
        }
    }
});

Router.route('stats/superlatives', {
    name: 'superlatives',
    template: 'statPage',
    waitOn: function() {
        Meteor.subscribe('character', this.params._id);
        Meteor.subscribe('attacks');
        Meteor.subscribe('casts');
        Meteor.subscribe('checks');
        Meteor.subscribe('saves');
    },
    data: function () {
        return {
            character: Characters.findOne(this.params._id),
            attacks: Attacks.find(),
            casts: Casts.find(),
            checks: Checks.find(),
            saves: Saves.find()
        }
    }
});


Router.route('stats', {
    waitOn: function() {
        Meteor.subscribe('characters');
    },
    data: function () {
        return {
            characters: Characters.find()
        }
    }
});

Router.route('track', {
    waitOn: function() {
        Meteor.subscribe('episodes');
        Meteor.subscribe('characters');
    },
    data: function () {
        return {
            episodes: Episodes.find(),
            characters: Characters.find()
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
        Meteor.subscribe('checks');
    },
    data: function() {
        return {
            stream: Stream.findOne(),
            checks: Checks.find()
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