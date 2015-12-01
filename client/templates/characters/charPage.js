Template.charPage.onCreated(function () {
    Session.set('descActive', '');
    Session.set('isAdmin', false);
});

Template.charPage.helpers({
    descActive: function(name) {
        const activeName = Session.get('descActive');
        return name === activeName ? 'is-active' : '';
    },
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
    },
    loopCount: function(count){
        var countArr = [];
        for (var i=0; i<count; i++){
            countArr.push({});
        }
        return countArr;
    },
    nonStrikes: function() {
        if ('vitals' in this) {
            const strikes = this.vitals.strikes;
            return 3 - strikes;
        }
        return 0;
    },
    populated: function(field) {
        console.log(field);
        return field !== '' && field !== null && field !== undefined;
    }
});

Template.charPage.events({
    'click [data-hook=show-description]': function(e) {
        const name = $(e.target).attr('data-name');
        Session.set('descActive', name);
    },
    'click [data-hook=close-description]': function(e) {
        Session.set('descActive', '');
    }
});