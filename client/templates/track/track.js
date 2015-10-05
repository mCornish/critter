Template.track.onCreated(function() {
    Session.set('choosing', true);
    Session.set('tracking', false);
    Session.set('episode', null);
    Session.set('cast', null);
    Session.set('modal', false);
    Session.set('choosingAction', true);
    Session.set('choosingCheck', true);
    Session.set('charName', null);
    Session.set('check', null);
    Session.set('duration', '0:00:00');
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
    },
    duration: function() {
        return Session.get('duration');
    },
    modal: function() {
        return Session.get('modal');
    },
    choosingAction: function() {
        return Session.get('choosingAction');
    },
    choosingCheck: function() {
        return Session.get('choosingCheck');
    },
    check: function() {
        return Session.get('check');
    }
});

Template.track.events({
    'click [data-hook=watch-here]': function() {
        Session.set('choosing', false);
        Session.set('watching', true);
    },
    'click [data-hook=watch-else]': function() {
        Session.set('choosing', false);
        Session.set('watching', false);
    },
    'change [name=episode]': function(e) {
        const episodeNum = parseInt( $(e.target).val() );
        const episode = Episodes.findOne({number: episodeNum});

        Session.set('episode', episodeNum);
        Session.set('cast', episode.cast);
        Session.set('videoId', episode.videoId);
        Session.set('tracking', true);

        if(Session.get('watching')) {
            // Used ID because jQuery select wasn't working
            const ytEl = document.getElementById('js-yt');
            const player = youtube({ el:ytEl, id:episode.videoId });

            const ytInterval = setInterval(function() {
                let totalSeconds = player.currentTime;
                const hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
                let minutes = Math.floor(totalSeconds / 60);
                let seconds = Math.floor(totalSeconds % 60);

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
            }, 1000);
        }
    },
    'click [data-hook=start-button]': function(e) {
        e.preventDefault();

        let hours = 0,
            minutes = 0,
            seconds = 0;
        Session.set('seconds', 0);
        Session.set('minutes', 0);
        Session.set('hours', 0);

        const interval = setInterval(function () {
            seconds++;
            Session.set('seconds', seconds);

            if (seconds >= 60) {
                minutes++;
                Session.set('minutes', minutes);
                if (minutes >= 60) {
                    hours++;
                    Session.set('hours', hours);
                    minutes = 0;
                }
                seconds = 0;
            }

            // add zero for single-digit seconds/minutes
            if (seconds < 10) {
                seconds = ('0' + seconds).slice(-2);
            }
            if (minutes < 10) {
                minutes = ('0' + minutes).slice(-2);
            }

            Session.set('duration', `${hours}:${minutes}:${seconds}`);
        }, 1000);
    },
    'click [data-hook=track]': function(e) {
        const charName = $(e.target).attr('data-name');
        Session.set('charName', charName);
        Session.set('modal', true);
        Session.set('choosingAction', true);
        Session.set('trackTime', {
            hour: Session.get('hours'),
            minute: Session.get('minutes'),
            second: Session.get('seconds')
        });
    },
    'click [data-hook=action]': function(e) {
        const action = $(e.target).attr('data-action');
        Session.set('action', action);
        Session.set('choosingAction', false);
        Session.set('choosing' + action, true);
    },
    'click [data-hook=check]': function(e) {
        const check = $(e.target).attr('data-check');
        Session.set('check', check);
        Session.set('choosingCheck', false);
    },
    'click [data-hook=submit-roll]': function(e) {
        Session.set('modal', false);

        const roll = parseInt( $('[name=roll]').val() );
        const success = $('[name=success]').val() === 'on' ? true : false;
        const action = Session.get('action').toLowerCase();
        const check = {
            character: Session.get('charName'),
            roll: roll,
            success: success,
            time: Session.get('trackTime')
        };

        Meteor.call(action + 'Insert', check, function(error, result) {
            if (error) {
                return throwError(error.reason);
            }
            mixpanel.track("Check submit");
        });
    }
});