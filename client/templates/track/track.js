Template.track.onCreated(function() {
    Session.set('choosing', true);
    Session.set('tracking', false);
    Session.set('episode', null);
    Session.set('cast', null);
    Session.set('modal', false);
    Session.set('choosingAction', true);
    Session.set('choosingType', true);
    Session.set('charName', '');
    Session.set('action', '');
    Session.set('type', '');
    Session.set('duration', '0:00:00');
    Session.set('charAttacks', null);
    Session.set('charSpells', null)
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
    choosingType: function() {
        return Session.get('choosingType');
    },
    charName: function() {
        return Session.get('charName');
    },
    action: function() {
        return Session.get('action');
    },
    type: function() {
        return Session.get('type');
    },
    videoClass: function() {
        return Session.get('tracking') && Session.get('watching') ? '' : 'hidden';
    },
    actionIs: function(action) {
        return action === Session.get('action').toLowerCase();
    },
    charAttacks: function() {
        return Session.get('charAttacks');
    },
    charSpells: function() {
        return Session.get('charSpells');
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
        const character = Characters.findOne({name: charName});

        Session.set('charName', charName);
        Session.set('modal', true);
        Session.set('choosingAction', true);
        Session.set('trackTime', {
            hour: Session.get('hours'),
            minute: Session.get('minutes'),
            second: Session.get('seconds')
        });
        Session.set('charAttacks', character.attacks);
        if(character.spells) {
            Session.set('charSpells', character.spells);
        }
    },
    'click [data-hook=action]': function(e) {
        const action = $(e.target).attr('data-action');
        Session.set('action', action);
        Session.set('choosingAction', false);
        Session.set('choosingType', true);
    },
    'click [data-hook=type]': function(e) {
        const type = $(e.target).attr('data-type');
        Session.set('type', type);
        Session.set('choosingType', false);
    },
    'click [data-hook=submit-roll]': function(e) {
        Session.set('modal', false);

        let charAttacks,
            attack,
            attackType;

        if (Session.get('charAttacks')) {
            charAttacks = Session.get('charAttacks');
            attack = charAttacks.indexOf(Session.get('type'));
            attackType = attack.type;
        }

        const roll = parseInt( $('[name=roll]').val() );
        const success = $('[name=success]').val() === 'on' ? true : false;
        const action = Session.get('action').toLowerCase();
        const submission = {
            character: Session.get('charName'),
            roll: roll,
            time: Session.get('trackTime')
        };

        if (action === 'check' || action === 'save') {
            submission.type = Session.get('type');
            submission.success = success;
        } else if (action === 'attack') {
            submission.name = Session.get('type');
            submission.hit = success;
            submission.lethal = lethal;
            submission.type = attackType;
        } else if (action === 'spell') {
            submission.name = Session.get('type');
            submission.success = success;
        }

        Meteor.call(action + 'Insert', submission, function(error, result) {
            if (error) {
                return throwError(error.reason);
            }
            mixpanel.track(Session.get('action') + " submit");
        });
    }
});