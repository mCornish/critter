Roles = new Mongo.Collection('roles');

Roles.allow({
    update: function (userId, role) {
        return ownsDocument(userId, role);
    },
    remove: function (userId, role) {
        return ownsDocument(userId, role);
    }
});

Roles.deny({
    update: function (userId, role, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames).length > 0);
    }
});

//Roles.deny({
//    update: function(userId, role, fieldNames, modifier) {
//        var errors = validateRole(modifier.$set);
//        return;
//    }
//});

validateRole = function (role) {
    const errors = {};
    if (!role)
        errors.error = 'role';
    return errors;
};

Meteor.methods({
    roleInsert: function (roleAttributes) {
        check(Meteor.userId(), String);
        check(roleAttributes, {
            name: String
        });

        const errors = validateRole(roleAttributes);
        //if (errors.title || errors.image)
        //    throw new Meteor.Error('invalid-role', 'You must set a title and image for your image.');

        const user = Meteor.user();
        const role = _.extend(roleAttributes, {
            userId: user._id,
            submitted: new Date()
        });
        const roleId = Roles.insert(role);
        return {
            _id: roleId
        };
    }
});