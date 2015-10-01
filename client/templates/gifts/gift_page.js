Template.giftPage.helpers({
    fixedLink: function() {
        // Check url for http
        var slice =  this.link.substr(0, 7);

        if (slice === 'http://') {
            return this.link;
        } else {
            return 'http://' + this.link;
        }
    },
    comments: function() {
        return Comments.find({giftId: this._id});
    },
    submittedMoment: function() {
        return moment(this.submitted).fromNow();
    },
    // disables want button when necessary
    wantedClass: function() {
        var userId = Meteor.userId();
        if (userId && !_.include(this.wanters, userId)) {
            return 'wantable';
        } else {
            return 'is-disabled'
        }
    },
    pluralWants: function() {
        return this.wants > 1;
    },
    popupClass: function() {
        return Router.current().route.path(this).indexOf('browse') > -1 ? '' : 'is-page';
    },
    user: function() {
        return Meteor.users.findOne(this.userId);
    }
});

Template.giftPage.events({
    'click [data-hook=want].wantable': function(e) {
        e.preventDefault();
        Meteor.call('want', this._id);
    },
    'click [data-hook=want]:not(.wantable)': function(e) {
        e.preventDefault();
        Meteor.call('unwant', this._id);
    }
});