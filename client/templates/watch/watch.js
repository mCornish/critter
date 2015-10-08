Template.watch.onCreated(function () {
    Session.set('choosing', true);
    Session.set('tracking', false);
    Session.set('episode', null);
    Session.set('cast', null);
    Session.set('duration', '0:00:00');
    Session.set('timing', false);
    Session.set('seconds', 0);
    Session.set('minutes', 0);
    Session.set('hours', 0);
    Session.set('contentType', null);
    Session.set('epContent', null);
});

Template.watch.helpers({
    choosing: function () {
        return Session.get('choosing');
    },
    watching: function () {
        return Session.get('watching');
    },
    tracking: function () {
        return Session.get('tracking');
    },
    videoId: function () {
        return Session.get('videoId');
    },
    duration: function () {
        return Session.get('duration');
    },
    videoClass: function () {
        return Session.get('tracking') && Session.get('watching') ? '' : 'hidden';
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
    }
});

Template.watch.events({
    'click [data-hook=watch-here]': function () {
        Session.set('choosing', false);
        Session.set('watching', true);
    },
    'click [data-hook=watch-else]': function () {
        Session.set('choosing', false);
        Session.set('watching', false);
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
        Session.set('tracking', true);


        if (Session.get('watching')) {
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
    }
});

function timeYoutube() {

}