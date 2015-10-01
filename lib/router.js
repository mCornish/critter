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


Router.route('gifts/:_id', {
    name: 'giftPage',
    waitOn: function() {
        return [
            Meteor.subscribe('singleGift', this.params._id),
            Meteor.subscribe('comments', this.params._id),
            Meteor.subscribe('users')
        ];
    },
    data: function() { return Gifts.findOne(this.params._id); }
});

Router.route('gifts/:_id/edit', {
    name: 'giftEdit',
    waitOn: function() {
        return [
            Meteor.subscribe('singleGift', this.params._id),
            Meteor.subscribe('recipients'),
            Meteor.subscribe('occasions')
        ];
    },
    data: function() {
        return {
            gift: Gifts.findOne(this.params._id),
            recipients: Recipients.find(),
            occasions: Occasions.find()
        }
    }
});

Router.route('/submit', {
    name: 'giftSubmit',
    waitOn: function() {
        return [
            Meteor.subscribe('recipients'),
            Meteor.subscribe('occasions')
        ];
    },
    data: function() {
        return {
            recipients: Recipients.find(),
            occasions: Occasions.find()
        }
    }
});


GiftsListController = RouteController.extend({
    template: 'giftsList',
    waitOn: function() {
        return [
            Meteor.subscribe('gifts'),
            Meteor.subscribe('users'),
            Meteor.subscribe('recipients'),
            Meteor.subscribe('occasions')
        ]
    },
    increment: 10,
    sort: {submitted: -1, _id: -1},
    gifts: function() {
        return Gifts.find({}, {limit: this.increment, sort: this.sort});
    },
    data: function() {
        return {
            gifts: this.gifts(),
            increment: this.increment,
            sort: this.sort,
            recipients: Recipients.find(),
            occasions: Occasions.find()
        }
    }
});

TopGiftsController = GiftsListController.extend({
    sort: {wants: -1, submitted: -1, _id: -1}
});

Router.route('browse', {
    controller: 'GiftsListController'
});


Router.route('browse/new', {
    name: 'newGifts',
    controller: 'GiftsListController'
});
Router.route('browse/top', {
    name: 'topGifts',
    controller: 'TopGiftsController'
});

Router.route('/find/:gender?', {
    name: 'find',
    waitOn: function() {
        var subscriptions = [
            Meteor.subscribe('gifts'),
            Meteor.subscribe('occasions')
        ];
        if (this.params.gender) {
            subscriptions.push( Meteor.subscribe('recipientsByGender', this.params.gender) );
        } else {
            subscriptions.push( Meteor.subscribe('recipients') );
        }

        return subscriptions;
    },
    data: function() {
        if (this.params.gender) {
            var gender = this.params.gender;
            if (gender === 'male') {
                return {
                    recipients: Recipients.find(
                        {$or: [ {gender: gender}, {gender: 'neutral'} ] },
                        {limit: 11, sort: {giftCount: -1}}
                    ),
                    occasions: Occasions.find(
                        {},
                        {limit: 11, sort: {giftCount: -1}}
                    ),
                    routeGender: gender,
                    genderPossessive: 'his'
                }

            } else {
                return {
                    recipients: Recipients.find(
                        {$or: [ {gender: gender}, {gender: 'neutral'} ] },
                        {limit: 11, sort: {giftCount: -1}}
                    ),
                    occasions: Occasions.find(
                        {},
                        {limit: 11, sort: {giftCount: -1}}
                    ),
                    routeGender: gender,
                    genderPossessive: 'her'
                }
            }
        } else {
            return {
                recipients: Recipients.find( {gender: 'neutral'}, {limit: 11, sort: {giftCount: -1}} ),
                occasions: Occasions.find( {}, {limit: 11, sort: {giftCount: -1}} )
            }
        }
    }
});

Router.route('user/:id', {
    name: 'userPage',
    waitOn: function() {
        Meteor.subscribe('singleUser', this.params.id, Meteor.userId());
        // fetch gifts posted by user
        Meteor.subscribe('gifts', {'userId': this.params.id}, {limit: 3, sort: {submitted: -1}} );
        // fetch gifts wanted by user
        Meteor.subscribe('gifts', {'wanters': this.params.id}, {limit: 3, sort: {submitted: -1}} );
    },
    data: function() {
        return {
            user: Meteor.users.findOne(this.params.id),
            gifts: Gifts.find({'userId': this.params.id}, {limit: 3, sort: {submitted: -1}}),
            wants: Gifts.find({'wanters': this.params.id}, {limit: 3, sort: {submitted: -1}})
        }
    }
});

Router.route('login', {
    waitOn: function() {
        Meteor.subscribe('users');
    }
});

Router.route('profile', {
    waitOn: function() {
        Meteor.subscribe('users');
    },
    data: function () {
        return Meteor.user()
    }
});

Router.route('account', {
    waitOn: function() {
        Meteor.subscribe('singleUser', Meteor.userId(), Meteor.userId());
    },
    data: function () {
        return Meteor.user()
    }
});

Router.route('admin', {name: 'admin'});


Router.route('/', {
    name: 'home',
    waitOn: function() {
        if (Meteor.userId()) {
            // fetch gifts posted by user
            Meteor.subscribe('gifts', {'userId': Meteor.userId()}, {limit: 3, sort: {submitted: -1}} );
            // fetch gifts wanted by user
            Meteor.subscribe('gifts', {'wanters': Meteor.userId()}, {limit: 3, sort: {submitted: -1}} );
        }
    },
    data: function() {
        return {
            user: Meteor.user(),
            gifts: Gifts.find({'userId': Meteor.userId()}, {limit: 3, sort: {submitted: -1}}),
            wants: Gifts.find({'wanters': Meteor.userId()}, {limit: 3, sort: {submitted: -1}})
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