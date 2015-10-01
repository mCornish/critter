Meteor.users.allow({
    // make sure current user is the user being updated
    update: function(userId, user) { return userId == user._id }
});

Meteor.users.deny({
    update: function(userId, gift, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames, 'emails', 'profile', 'services').length > 0);
    }
});