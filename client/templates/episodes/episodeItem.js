Template.episodeItem.onCreated(function () {
    Session.set('activeEp', 0);
});

Template.episodeItem.helpers({
    epActive: function (epNum) {
        return epNum === Session.get('activeEp') ? 'is-active' : '';
    }
});

Template.episodeItem.events({
    'click [data-hook=ep-more]': function(e) {
        // don't fire click for parent
        e.stopPropagation();

        const $episode = $(e.target).parents('.card');
        const epNum = parseInt($episode.attr('data-number'));
        console.log(epNum + ' ' + Session.get('activeEp'));

        if (epNum === Session.get('activeEp')) {
            Session.set('activeEp', null);
        } else {
            Session.set('activeEp', epNum);
        }
    }
});