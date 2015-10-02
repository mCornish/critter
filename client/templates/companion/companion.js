Template.companion.onCreated(function() {
    // TODO Create admin panel to manage liveChars
    Session.set('liveNames', ['Vax', 'Vex', 'Grog', 'Percy', 'Keyleth', 'Tiberius', 'Scanlan']);
});

Template.companion.helpers({
    liveChars: function() {
        const names = Session.get('liveNames');

        // get all characters from liveNames array
        const chars = Characters.find({ name: { $in: names }, live: true });
        return chars;
    }
});

Template.companion.events({

});