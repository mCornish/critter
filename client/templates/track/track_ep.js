Template.trackEp.onCreated(function () {
    Session.set('modal', false);
    Session.set('choosingAction', true);
    Session.set('choosingType', true);
    Session.set('charName', '');
    Session.set('action', '');
    Session.set('type', '');
    Session.set('videoDuration', '0:00:00');
    Session.set('charAttacks', null);
    Session.set('charSpells', null);
    Session.set('timingInterval', null);
    Session.set('seconds', 0);
    Session.set('minutes', 0);
    Session.set('hours', 0);
    Session.set('totalSeconds', 0);
    Session.set('watchActive', false);
    Session.set('watchHere', false);

    // initialize episode
    const episode = this.data.episode;
    Session.set('episodeNum', episode.number);
    Session.set('cast', episode.cast);
    Session.set('videoId', episode.videoId);
});

Template.trackEp.onRendered(function() {
    // Used ID because jQuery select wasn't working
    const ytEl = document.getElementById('js-yt');
    const player = youtube({el: ytEl, id: Session.get('videoId')});

    player.on('timeupdate', _.throttle(function () {
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

        Session.set('videoDuration', `${hours}:${minutes}:${seconds}`);
    }, 500));
});

Template.trackEp.helpers({
    choosing: function () {
        return Session.get('choosing');
    },
    watching: function () {
        return Session.get('watching');
    },
    tracking: function () {
        return Session.get('tracking');
    },
    activeChars: function () {
        if (Session.get('cast')) {
            return Characters.find({name: {$in: Session.get('cast')}});
        }
    },
    videoId: function () {
        return Session.get('videoId');
    },
    modal: function () {
        return Session.get('modal');
    },
    choosingAction: function () {
        return Session.get('choosingAction');
    },
    actionActive: function(action) {
        return action === Session.get('action').toLowerCase() ? 'is-active' : '';
    },
    choosingType: function () {
        return Session.get('choosingType');
    },
    action: function () {
        return Session.get('action');
    },
    type: function () {
        return Session.get('type');
    },
    videoClass: function () {
        return Session.get('watchHere') && Session.get('episode') ? '' : 'hidden';
    },
    actionIs: function (action) {
        return action === Session.get('action').toLowerCase();
    },
    charName: function () {
        return Session.get('charName');
    },
    charAttacks: function () {
        return Session.get('charAttacks');
    },
    charSpells: function () {
        return Session.get('charSpells');
    },
    watchActive: function () {
        return Session.get('watchActive') ? 'is-active' : '';
    },
    watchHere: function () {
        return Session.get('watchHere');
    },
    maxRoll: function () {
        return Session.get('maxRoll');
    }
});

Template.trackEp.events({
    'click [data-hook=watch-button]': function () {
        const isActive = Session.get('watchActive');
        const player = Session.get('player');
        Session.set('watchActive', !isActive);
        Session.set('watchHere', !isActive);

        // TODO Figure out how to pause video when button is pressed
    },
    'click [data-hook=watch-else]': function () {
        Session.set('choosing', false);
        Session.set('watching', false);
    },
    'click [data-hook=track]': function (e, template) {
        const charName = $(e.target).attr('data-name');
        const characters = template.data.characters.fetch();
        const character = _.findWhere(characters, {name: charName});

        Session.set('charName', charName);
        Session.set('modal', true);
        Session.set('choosingAction', true);
        Session.set('trackTime', {
            hour: Session.get('hours'),
            minute: Session.get('minutes'),
            second: Session.get('seconds')
        });
        Session.set('charAttacks', character.attacks);
        if (character.spells) {
            Session.set('charSpells', character.spells);
        }
    },
    'click [data-hook=action]': function (e) {
        const action = $(e.target).attr('data-action');
        Session.set('action', action);
    },
    'click [data-hook=type]': function (e) {
        const type = $(e.target).attr('data-type');
        Session.set('type', type);
        Session.set('choosingAction', false);

        if (Session.get('action').toLocaleLowerCase() === 'attack') {
            // get the attack object from the character
            const char = Characters.findOne({name: Session.get('charName')});
            const attack = _.findWhere(char.attacks, {name: type}); // Note: type => attack name
            // find and set the maximum roll value
            const diceCount = parseInt(attack.diceNum);
            Session.set('diceCount', diceCount);
            const diceVal = attack.diceVal;
            const maxRoll = diceCount * diceVal;

            Session.set('maxRoll', maxRoll);
        }
    },
    'click [data-hook=add-roll]': function (e) {
        submitRoll(function () {
            Session.set('choosingAction', true);
            Session.set('choosingType', true);
            Session.set('action', '');
            Session.set('type', '');
        });
    },
    'click [data-hook=submit-roll]': function (e) {
        Session.set('modal', false);
        submitRoll();
    }
});

function submitRoll(callback) {
    let charAttacks,
        attack,
        attackType;
    const character = Characters.findOne({name: Session.get('charName')});
    const charId = character._id;
    const roll = parseInt($('[name=roll]').val());
    const success = $('[name=success]').checked ? true : false;
    const action = Session.get('action').toLowerCase();
    let lethal, lethalCount;

    if (action === 'attack') {
        lethal = $('[name=lethal]').checked ? true : false;
        lethalCount = 1;
    } else {
        lethal = null;
        lethalCount = null;
    }

    const submission = {
        character: charId,
        roll: roll,
        time: Session.get('trackTime')
    };

    if (action === 'check' || action === 'save') {
        submission.type = Session.get('type');
        submission.success = success;
    } else if (action === 'attack') {
        // get attackType
        charAttacks = Session.get('charAttacks');
        const attackName = Session.get('type');
        attack = _.find(charAttacks, function (item) {
            return item.name === attackName;
        });
        attackType = attack.type;

        submission.name = Session.get('type');
        submission.hit = success;
        submission.lethal = lethal;
        submission.type = attackType;
    } else if (action === 'spell') {
        submission.name = Session.get('type');
        submission.success = success;
    }

    // create a new object for the action
    Meteor.call(action + 'Insert', submission, function (error, result) {
        if (error) {
            return throwError(error.reason);
        }
        mixpanel.track(Session.get('action') + " submit");
        if (typeof callback == 'function') {
            callback();
        }
    });

    const path = window.location.pathname;
    const slashLoc = path.lastIndexOf('/');
    const episode = parseInt( path.slice(slashLoc + 1) );

    const stat = {
        action: action,
        name: Session.get('type').toLowerCase(),
        character: Session.get('charName').toLowerCase(),
        episode: episode,
        time: parseInt( Session.get('totalSeconds') )
    };

    console.log(stat.time);

    const statExists = Stats.findOne(stat);

    if (statExists) {
        // update the existing stat
        Meteor.call('updateStat', stat, roll, success, lethal, function (error) {
            if (error) {
                return throwError(error.reason);9
            }
        });
    } else {
        // create a new stat
        const succVal = success ? 1 : 0;
        _.extend(stat, {
            value: roll,
            valueCount: 1,
            success: succVal,
            successCount: 1
        });
        if (action === 'attack') {
            const lethalVal = lethal ? 1 : 0;
            _.extend(stat, {
                lethal: lethalVal,
                lethalCount: lethalCount
            });
        }
        Meteor.call('statInsert', stat);
    }
}