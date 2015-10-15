Template.watch.onCreated(function () {
    Session.set('watching', null);
    Session.set('tracking', null);
    Session.set('choosing', false);
    Session.set('watchHere', false);
    Session.set('selectedEp', false);
    Session.set('episode', null);
    Session.set('cast', null);
    Session.set('duration', '0:00:00');
    Session.set('timing', false);
    Session.set('seconds', 0);
    Session.set('minutes', 0);
    Session.set('hours', 0);
    Session.set('contentType', null);
    Session.set('epContent', null);
    Session.set('contentActive', false);
    Session.set('infoActive', false);
    Session.set('detailActive', false);
    Session.set('character', null);
});

Template.watch.helpers({
    watching: function () {
        return Session.get('watching');
    },
    tracking: function () {
        return Session.get('tracking');
    },
    choosing: function () {
        return Session.get('choosing');
    },
    selectedEp: function() {
        return Session.get('selectedEp');
    },
    videoId: function () {
        return Session.get('videoId');
    },
    duration: function () {
        return Session.get('duration');
    },
    videoClass: function () {
        return Session.get('watchHere') && Session.get('episode') ? '' : 'hidden';
    },
    // Controls start button text
    timing: function () {
        return Session.get('timing');
    },
    epContent: function () {
        return Session.get('epContent');
    },
    contentTypeIs: function (type) {
        return type === Session.get('contentType');
    },
    contentActive: function () {
        return Session.get('contentActive');
    },
    infoActive: function () {
        return Session.get('infoActive');
    },
    detailActive: function () {
        return Session.get('detailActive');
    },
    character: function () {
        return Session.get('character');
    },
    detailClass: function (name) {
        const activeName = Session.get('charName');
        return name === activeName ? 'is-active' : '';
    }
});

Template.watch.events({
    'click [data-hook=watch]': function() {
        Session.set('watching', true);
        Session.set('tracking', false);
        Session.set('choosing', true);
    },
    'click [data-hook=track]': function() {
        Session.set('tracking', true);
        Session.set('watching', false);
    },
    'click [data-hook=watch-here]': function () {
        Session.set('choosing', false);
        Session.set('watchHere', true);
    },
    'click [data-hook=watch-else]': function () {
        Session.set('choosing', false);
        Session.set('watchHere', false);
    },
    'change [name=episode]': function (e) {
        const episodeNum = parseInt($(e.target).val());
        const episode = Episodes.findOne({number: episodeNum});
        const contentCursor = Content.find({episode: episodeNum}, {$sort: {hour: -1, minute: -1, second: -1}})
        let content = contentCursor.fetch();
        let times = _.pluck(content, 'time');

        let cHourToSec = times[0].hour * 3600,
            cMinToSec = times[0].minute * 60,
            cSec = times[0].second,
            cTotSec = cHourToSec + cMinToSec + cSec;

        Session.set('episode', episodeNum);
        Session.set('cast', episode.cast);
        Session.set('videoId', episode.videoId);
        Session.set('selectedEp', true);


        if (Session.get('watchHere')) {
            // Used ID because jQuery select wasn't working
            const ytEl = document.getElementById('js-yt');
            const player = youtube({el: ytEl, id: episode.videoId});

            // Keep track of content and play at correct time
            player.on('timeupdate', _.throttle(function () {
                let totalSeconds = Math.floor(player.currentTime);
                const hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
                let minutes = Math.floor(totalSeconds / 60);
                let seconds = Math.floor(totalSeconds % 60);

                if (cTotSec === totalSeconds && !Session.get('resetting')) {
                    $('iframe.twitter-tweet').remove();
                    Session.set('epContent', content[0]);
                    Session.set('contentType', content[0].type);
                    // Remove first item from times & content, and reset times
                    if (times.length > 1) {
                        times.shift();
                        content.shift();
                        cHourToSec = times[0].hour * 3600;
                        cMinToSec = times[0].minute * 60;
                        cSec = times[0].second;
                        cTotSec = cHourToSec + cMinToSec + cSec;
                    }
                }

                Session.set('seconds', seconds);
                Session.set('minutes', minutes);
                Session.set('hours', hours);

                // add zero for single-digit seconds/minutes
                if (seconds < 10) {
                    seconds = ('0' + seconds).slice(-2);
                }
                if (minutes < 10) {
                    minutes = ('0' + minutes).slice(-2);
                }

                Session.set('duration', `${hours}:${minutes}:${seconds}`);
            }, 500));

            // Reset and update content on scrub/play
            player.on('play', function (e) {
                Session.set('resetting', true);
                console.log('reset');
                // Reset and update content and times after scrubbing.
                content = contentCursor.fetch();
                times = _.pluck(content, 'time');

                cHourToSec = times[0].hour * 3600;
                cMinToSec = times[0].minute * 60;
                cSec = times[0].second;
                cTotSec = cHourToSec + cMinToSec + cSec;

                let totalSeconds = Math.floor(player.currentTime);
                const hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
                let minutes = Math.floor(totalSeconds / 60);
                let seconds = Math.floor(totalSeconds % 60);

                //times.forEach(function(time) {
                //    if (time.)
                //});

                while (cTotSec < totalSeconds) {
                    console.log(content);
                    if (times.length > 1) {
                        times.shift();
                        content.shift();
                        cHourToSec = times[0].hour * 3600;
                        cMinToSec = times[0].minute * 60;
                        cSec = times[0].second;
                        cTotSec = cHourToSec + cMinToSec + cSec;
                    } else {
                        break;
                    }
                }
                Session.set('resetting', false);
            })

        }
    },
    'click [data-hook=content-button]': function() {
        Session.set('contentActive', true);
        Session.set('infoActive', false);
    },
    'click [data-hook=info-button]': function() {
        Session.set('infoActive', true);
        Session.set('contentActive', false);
    },
    'click [data-hook=detail-button]': function(e) {
        const charName = $(e.target).attr('data-name');
        Session.set('detailActive', true);
        const character = Characters.findOne({name: charName});
        Session.set('character', character);
    }
});