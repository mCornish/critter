Template.giftItem.helpers({
    ownGift: function() {
        return this.userId === Meteor.userId();
    },
    user: function() {
        return Meteor.users.findOne(this.userId);
    },
    displayClass: function() {
        if (Session.equals('activeGift', this._id)) {
            return 'active'
        } else {
            return 'hidden'
        }
    },
    // disables want button when necessary
    wantedClass: function() {
        var userId = Meteor.userId();
        if (userId && !_.include(this.wanters, userId)) {
            return 'wantable';
        } else if (userId) {
            return 'unwantable'
        } else {
            return 'disabled';
        }
    },
    pluralWants: function() {
        return this.wants > 1;
    }
});

Template.giftItem.events({
    'click [data-hook="image"]': function(e) {
        e.preventDefault();
        Meteor.subscribe('comments', this._id);
        Session.set('activeGift', this._id);
        // hide browse page controls
        Session.set('browseControlsActive', false);
        // hide header
        Session.set('headerIsActive', false);

        path = window.location.pathname;
        history.pushState({}, 'Gift', '/gifts/' + this._id);
    },
    'click [data-hook=shade]': function(e) {
        e.preventDefault();
        Session.set('activeGift', null);
        // show browse page controls
        Session.set('browseControlsActive', true);
        // show header
        Session.set('headerIsActive', true);

        history.pushState({}, 'Find', path);
    },
    'click [data-hook=close]': function(e) {
        e.preventDefault();
        Session.set('activeGift', null);
        // show browse page controls
        Session.set('browseControlsActive', true);
        // show header
        Session.set('headerIsActive', true);

        history.pushState({}, 'Find', path);
    },
    'click [data-hook=want].wantable': function(e) {
        e.preventDefault();
        Meteor.call('want', this._id);
    },
    'click [data-hook=want]:not(.wantable)': function(e) {
        e.preventDefault();
        Meteor.call('unwant', this._id);
    }
});