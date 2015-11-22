Template.notes.helpers({
    notes: function() {
        return Notes.find();
    }
});

// Remove errors from DOM after 3 seconds
Template.note.onRendered(function() {
    var note = this.data;
    Meteor.setTimeout(function() {
        Notes.remove(note._id);
    }, 3000);
});