Template.commentItem.helpers({
    submittedMoment: function() {
        return moment(this.submitted).fromNow();
    },
    user: function() {
        return Meteor.users.findOne(this.userId);
    }
});