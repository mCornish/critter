Template.watchEp.onCreated(function () {
    Session.set('watchHere', false);
    Session.set('selectedEp', false);
    Session.set('episode', null);
    Session.set('cast', null);
    Session.set('seconds', 0);
    Session.set('minutes', 0);
    Session.set('hours', 0);
    Session.set('contentType', null);
    Session.set('epContent', null);
    Session.set('contentActive', false);
    Session.set('infoActive', false);
    Session.set('watchActive', false);
    Session.set('watchHere', false);
    Session.set('detailActive', false);
    Session.set('character', null);
    Session.set('menuActive', null);
    Session.set('player', null);

    // initialize episode
    const episode = this.data.episode;
    Session.set('episodeNum', episode.number);
    Session.set('cast', episode.cast);
    Session.set('videoId', episode.videoId);

    const contentCollection = this.data.content.fetch();
    let content = _.where(contentCollection, {episode: Session.get('episodeNum')});
    content.sort(function(x, y) {
        xTotal = (x.hour * 3600) + (x.minute * 60) + x.second;
        yTotal = (y.hour * 3600) + (y.minute * 60) + y.second;

        if (x === y) {
            return 0;
        }
        return x > y ? 1 : -1;
    });

    let times = _.pluck(content, 'time');
    let cHourToSec, cMinToSec, cSec, cTotSec;

    if (times.length > 0) {
        cHourToSec = times[0].hour * 3600;
        cMinToSec = times[0].minute * 60;
        cSec = times[0].second;
        cTotSec = cHourToSec + cMinToSec + cSec;
    }

    Session.set('contentTotSec', cTotSec);
    Session.set('contentActive', true);
});

Template.watchEp.onRendered(function() {
    // Used ID because jQuery select wasn't working
    const ytEl = document.getElementById('js-yt');
    const player = youtube({el: ytEl, id: Session.get('videoId')});

    // Keep track of content and play at correct time
    player.on('timeupdate', _.throttle(function () {
        let totalSeconds = Math.floor(player.currentTime);
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        if (Session.get('contentTotSec') === totalSeconds && !Session.get('resetting')) {
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
        // Reset and update content and times after scrubbing.
        content = _.where(contentCollection, {episode: episodeNum});
        content.sort(function(x, y) {
            xTotal = (x.hour * 3600) + (x.minute * 60) + x.second;
            yTotal = (y.hour * 3600) + (y.minute * 60) + y.second;

            if (x === y) {
                return 0;
            }
            return x > y ? 1 : -1;
        });

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
    });
});

Template.watchEp.helpers({
    watching: function () {
        return Session.get('watching');
    },
    tracking: function () {
        return Session.get('tracking');
    },
    choosing: function () {
        return Session.get('choosing');
    },
    selectedEp: function () {
        return Session.get('selectedEp');
    },
    videoId: function () {
        return Session.get('videoId');
    },
    videoClass: function () {
        return Session.get('watchHere') ? '' : 'hidden';
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
    watchActive: function () {
        return Session.get('watchActive') ? 'is-active' : '';
    },
    watchHere: function() {
        return Session.get('watchHere');
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
    },
    menuActive: function (item) {
        return item === Session.get('menuActive') ? 'is-active' : '';
    }
});

Template.watchEp.events({
    'click [data-hook=watch-button]': function () {
        const isActive = Session.get('watchActive');
        const player = Session.get('player');
        Session.set('watchActive', !isActive);
        Session.set('watchHere', !isActive);

        // TODO Figure out how to pause video when button is pressed
    },
    'click [data-hook=watch-else]': function () {
        Session.set('choosing', false);
        Session.set('watchHere', false);
    },
    'click [data-hook=episode-button]': function (e, template) {



    },
    'click [data-hook=content-button]': function () {
        Session.set('contentActive', true);
        Session.set('infoActive', false);
        Session.set('menuActive', 'content');
    },
    'click [data-hook=info-button]': function () {
        Session.set('infoActive', true);
        Session.set('contentActive', false);
        Session.set('menuActive', 'info');
    },
    'click [data-hook=detail-button]': function (e) {
        const charName = $(e.target).attr('data-name');
        Session.set('detailActive', true);
        const character = Characters.findOne({name: charName});
        Session.set('character', character);
    }
});