Template.companion.onRendered(function() {
    // TODO Create admin panel to manage live chars
    Session.set('liveNames', ['Pike', 'Scanlan']);
});

Template.companion.helpers({
    liveChars: function() {
        const names = Session.get('liveNames');

        // get all characters from liveNames array
        const chars = Characters.find({ 'name': {$in: names } });
        return chars;
    }
});

Template.companion.events({

});