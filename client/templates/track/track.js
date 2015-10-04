Template.track.onCreated(function() {
    Session.set('choosing', true);
    Session.set('tracking', false);
    Session.set('episode', null);
    Session.set('cast', null);
});

Template.track.helpers({
    choosing: function() {
        return Session.get('choosing');
    },
    watching: function() {
        return Session.get('watching');
    },
    tracking: function() {
        return Session.get('tracking');
    },
    activeChars: function() {
        if (Session.get('cast')) {
            return Characters.find({name: {$in: Session.get('cast')} });
        }
    },
    videoId: function() {
        return Session.get('videoId');
    }
});

Template.track.events({
    'click [data-hook=watch-here]': function() {
        Session.set('choosing', false);
        Session.set('watching', true);
    },
    'click [data-hook=watch-else]': function() {
        Session.set('choosing', false);
    },
    'change [name=episode]': function(e) {
        const episodeNum = parseInt( $(e.target).val() );
        const episode = Episodes.findOne({number: episodeNum});

        Session.set('episode', episodeNum);
        Session.set('cast', episode.cast);
        Session.set('videoId', episode.videoId);
        Session.set('tracking', true);
    }
});