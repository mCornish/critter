Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function () {
        return [
            Meteor.subscribe('notifications'),
            Meteor.subscribe('images'),
            Meteor.subscribe('user', Meteor.userId(), Meteor.userId())
        ];
    }
});

Router.route('noBeta');

Router.route('watch/episodes/:ep', {
    name: 'watchEp',
    waitOn: function () {
        Meteor.subscribe('episode', parseInt(this.params.ep));
        Meteor.subscribe('characters');
        Meteor.subscribe('content');
    },
    data: function () {
        return {
            episode: Episodes.findOne({number: parseInt(this.params.ep)}),
            characters: Characters.find(),
            content: Content.find()
        }
    }
});

Router.route('watch', {
    waitOn: function () {
        Meteor.subscribe('episodes');
        Meteor.subscribe('content');
        Meteor.subscribe('characters');
    },
    data: function () {
        return {
            episodes: Episodes.find(),
            characters: Characters.find(),
            content: Content.find()
        }
    }
});

Router.route('stats/character/:_id', {
    name: 'characterStats',
    template: 'statPage',
    waitOn: function () {
        Meteor.subscribe('character', this.params._id);
        const charName = Characters.findOne(this.params._id).name.toLowerCase();

        Meteor.subscribe('stats', {character: charName});
    },
    data: function () {
        return {
            character: Characters.findOne(this.params._id),
            stats: Stats.find()
        }
    }
});

Router.route('stats/team', {
    name: 'teamStats',
    waitOn: function () {
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
    waitOn: function () {
        Meteor.subscribe('characters');
    },
    data: function () {
        return {
            mostKills: Characters.find({}, {sort: {'gameStats.killCount': -1}, limit: 3}),
            mostKOs: Characters.find({}, {sort: {'gameStats.koCount': -1}, limit: 3})
        }
    }
});

Router.route('stats', {
    waitOn: function () {
        Meteor.subscribe('stats');
    },
    data: function () {
        return {
            // Get stats with episode that is defined (is a number)
            episodeRolls: Stats.find({episode: {$type: 1}}),
            // Get stats with character that is defined (is a string)
            charRolls: Stats.find({$and: [{character: {$type: 2}}, {character: {$not: ''}}] })
        }
    }
});


Router.route('track/episode/:ep', {
    name: 'trackEp',
    waitOn: function () {
        Meteor.subscribe('episode', parseInt(this.params.ep));
        Meteor.subscribe('characters');
        Meteor.subscribe('stats');
    },
    data: function () {
        return {
            episode: Episodes.findOne({number: parseInt(this.params.ep)}),
            characters: Characters.find(),
            stats: Stats.find()
        }
    }
});

Router.route('track', {
    waitOn: function () {
        Meteor.subscribe('episodes');
        Meteor.subscribe('characters');
        Meteor.subscribe('stats');
    },
    data: function () {
        return {
            episodes: Episodes.find(),
            characters: Characters.find(),
            stats: Stats.find()
        }
    }
});

Router.route('me', {
    waitOn: function () {
        Meteor.subscribe('user', Meteor.userId(), Meteor.userId());
        Meteor.subscribe('actions', {userId: Meteor.userId()});
    },
    data: function () {
        return {
            user: Meteor.user(),
            submissions: Actions.find({userId: Meteor.userId()})
        }
    }
});

Router.route('companion', {
    waitOn: function () {
        Meteor.subscribe('characters');
        Meteor.subscribe('stream');
    },
    data: function () {
        return {
            liveChars: Characters.find({live: true}),
            stream: Stream.findOne()
        }
    }
});

Router.route('characters/new', {
    name: 'charSubmit',
    waitOn: function () {

    },
    data: function () {
        return {

        }
    }
});

Router.route('characters/:_id/edit', {
    name: 'charEdit',
    waitOn: function () {
        Meteor.subscribe('character', this.params._id);
    },
    data: function () {
        return Characters.findOne(this.params._id);
    }
});

Router.route('characters/:_id', {
    name: 'charPage',
    waitOn: function () {
        Meteor.subscribe('character', this.params._id);
    },
    data: function () {
        return Characters.findOne(this.params._id);
    }
});

Router.route('characters', {
    name: 'charList',
    waitOn: function () {
        Meteor.subscribe('characters');
    },
    data: function () {
        return {
            characters: Characters.find()
        }
    }
});

Router.route('admin', {
    name: 'admin',
    waitOn: function () {
        Meteor.subscribe('characters');
        Meteor.subscribe('stream');
        Meteor.subscribe('checks');
        Meteor.subscribe('users');
    },
    data: function () {
        return {
            stream: Stream.findOne(),
            checks: Checks.find(),
            users: Meteor.users.find()
        }
    }
});

Router.route('login', {
    name: 'login',
    waitOn: function () {
        Meteor.subscribe('users');
    }
});

Router.route('/', {
    name: 'home',
    waitOn: function () {
    },
    data: function () {
        return {}
    }
});

const requireLogin = function () {
    if (!Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
};

const requireAdmin = function() {
    if (typeof Meteor.userId() === 'string' && typeof Meteor.user().roles !== 'undefined') {
        if (
            Meteor.user().roles.indexOf('admin') < 0 &&
            Meteor.user().roles.indexOf('owner') < 0
        ) {
            Router.go('home');
        } else {
            this.next();
        }
    } else {
        Router.go('home');
    }
};

const requireBeta = function () {
    if (typeof Meteor.userId() === 'string' && typeof Meteor.user().roles !== 'undefined') {
        if (
            Meteor.user().roles.indexOf('beta') < 0 &&
            Meteor.user().roles.indexOf('admin') < 0 &&
            Meteor.user().roles.indexOf('owner') < 0
        ) {
            Router.go('noBeta');
        } else {
            this.next();
        }
    } else {
        Router.go('noBeta');
    }
};

// Not available during test
const noTest = function () {
    if (typeof Meteor.userId() === 'string' && typeof Meteor.user().roles !== 'undefined') {
        if (
            Meteor.user().roles.indexOf('admin') < 0 &&
            Meteor.user().roles.indexOf('owner') < 0
        ) {
            if (Meteor.user().roles.indexOf('beta') > 0){
                Router.go('home');
            } else {
                Router.go('noBeta');
            }
        } else {
            this.next();
        }
    } else {
        Router.go('noBeta');
    }
};

//Router.onBeforeAction(requireBeta, {except: ['noBeta', 'login']});
//Router.onBeforeAction(noTest, {except: ['home', 'login', 'companion', 'noBeta', 'watch']});

Router.onBeforeAction('dataNotFound', {only: 'giftPage'});
Router.onBeforeAction(requireLogin, {only: ['me']});
Router.onBeforeAction(requireAdmin, {only: ['admin']});