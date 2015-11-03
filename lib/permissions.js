//check that the specified userId own the documents
ownsDocument = function(userId, doc) {
    return doc && doc.userId === userId;
};

isAdmin = function(userId) {
    const user = Meteor.users.findOne(userId);

    if (typeof user.roles !== 'undefined') {
        return user.roles.indexOf('admin') > -1 || user.roles.indexOf('owner') > -1;
    } else {
        return false;
    }
};