Template.episodeItem.onCreated(function () {
    Session.set('activeEp', null);
});

Template.episodeItem.helpers({
    epActive: function (epNum) {
        return epNum === Session.get('activeEp') ? 'is-active' : '';
    },
    watching: function() {
        return Session.get('watching');
    }
});

Template.episodeItem.events({
    'click [data-hook=ep-more]': function(e) {
        // prevent parent from firing event
        e.stopPropagation();
        // don't activate link
        e.preventDefault();

        const $episode = $(e.target).parents('.card');
        const epNum = parseInt($episode.attr('data-number'));

        if (epNum === Session.get('activeEp')) {
            Session.set('activeEp', null);
        } else {
            Session.set('activeEp', epNum);
        }
    }
});