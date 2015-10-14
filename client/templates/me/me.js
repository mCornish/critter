Template.me.onCreated(function () {

});

Template.me.helpers({

});

Template.me.events({
    'click [data-hook=logout]': function() {
        Meteor.logout(function(error) {
            if (error) {
                return throwError(error.reason);
            }
            Router.go('home');
        });
    }
});