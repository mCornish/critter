Template.admin.onCreated(function() {

});

Template.admin.helpers({
    characters: function() {
        return Characters.find();
    }
});

Template.admin.events({
   'click [data-hook=live-toggle]': function(e) {
        e.preventDefault();

       const name = $(e.target).attr('data-name');
       const bool = $(e.target).attr('data-live') === 'true' ? true : false;

       Meteor.call('setLive', name.toString(), !bool);
    }
});