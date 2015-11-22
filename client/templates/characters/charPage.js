Template.charPage.onCreated(function () {
    Session.set('isAdmin', false);
});

Template.charPage.helpers({
    isAdmin: function() {
        const userId = Meteor.userId();
        Meteor.call('userIsInRole', userId, 'admin', function(error, result) {
            if (error) {
                throwError(error.reason);
            }
            const isAdmin = result;

            Meteor.call('userIsInRole', userId, 'owner', function(error, result) {
                if (error) {
                    throwError(error.reason);
                }
                const isOwner = result;

                Session.set('isAdmin', isAdmin || isOwner);
            });
        });

        return Session.get('isAdmin');
    }
});

Template.charPage.events({

});