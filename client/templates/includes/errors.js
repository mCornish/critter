Template.errors.helpers({
    errors: function() {
        return Errors.find();
    }
});

// Remove errors from DOM after 3 seconds
Template.error.onRendered(function() {
    var error = this.data;
    Meteor.setTimeout(function() {
        Errors.remove(error._id);
    }, 3000);
});