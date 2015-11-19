Template.companion.onCreated(function () {
    Session.set('route', 'watch');

    Session.set('durationIsPos', false);
    Session.set('zeroFlip', true);

    const
        now = new Date(),
        offset = -8,
        showTime = 18;
    let
        pstDate = moment(now).utcOffset(offset),
        pstHours = pstDate.hours(),
        pstMinutes = pstDate.minutes(),
        pstSeconds = pstDate.seconds(),

        hours = pstHours - showTime,
        minutes = pstMinutes,
        seconds = pstSeconds;

    if (hours <= 0) {
        seconds = 60 - seconds;
        minutes = 60 - minutes;
        if (hours !== 0) {
            hours = -hours;
        }
    }
    Session.set('duration', `${hours}:${minutes}:${seconds}`);

    const interval = setInterval(function () {
        // Check whether it should count down (before show) or down (during show)
        if (pstHours - showTime > 0) {  // Duration (at least 1 second past showtime)

            // Can't currently explain the logic here (I'm distracted), but it seems to work
            if (pstHours - showTime === 1) {
                hours = 0;
            }

            Session.set('durationIsPos', true);
            seconds++;

            if (seconds >= 60) {
                minutes++;
                if (minutes >= 60) {
                    hours++;
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
        } else if (pstHours - showTime < 0) {  // Countdown at least 1 hour

            Session.set('durationIsPos', false);
            if (hours < 0) {
                seconds = 60 - seconds;
                minutes = 60 - minutes;
                hours = -hours;
            }
            seconds--;

            if (seconds <= 0) {
                minutes--;
                if (minutes <= 0) {
                    hours--;
                    minutes = 59;
                }
                seconds = 59;
            }

            // add zero for single-digit seconds/minutes
            if (seconds < 10) {
                seconds = ('0' + seconds).slice(-2);
            }
            if (minutes < 10) {
                minutes = ('0' + minutes).slice(-2);
            }
        } else {  // Countdown less than 1 hour
            Session.set('durationIsPos', false);
            seconds--;

            if (seconds <= 0) {
                minutes--;
                if (minutes <= 0) {
                    hours--;
                    minutes = 59;
                }
                seconds = 59;
            }

            // add zero for single-digit seconds/minutes
            if (seconds < 10) {
                seconds = ('0' + seconds).slice(-2);
            }
            if (minutes < 10) {
                minutes = ('0' + minutes).slice(-2);
            }
        }

        Session.set('duration', `${hours}:${minutes}:${seconds}`);
    }, 1000);

    Session.set('interval', interval);
    Session.set('cast', null);
    Session.set('contentActive', true);
    Session.set('infoActive', false);
    Session.set('detailActive', false);
    Session.set('giveawayActive', false);
    Session.set('menuActive', 'content');
    Session.set('showMenu', true);
});

Template.companion.helpers({
    isLive: function () {
        const stream = this.stream;
        return stream.live;
    },
    epNumber: function() {
        return this.stream.epNumber;
    },
    liveContent: function () {
        return $.parseHTML(this.stream.liveContent);
    },
    hasContent: function () {
        return Object.keys(this.stream.liveContent).length;
    },
    contentType: function (type) {
        if (typeof this.stream.liveContent === 'object') {
            return type === this.stream.liveContent.type;
        }
        return false;
    },
    durationText: function () {
        return Session.get('durationIsPos') ? 'Duration' : 'Countdown';
    },
    duration: function () {
        return Session.get('duration');
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
    },
    giveawayActive: function () {
        return Session.get('giveawayActive');
    },
    subPercent: function () {
        const stream = this.stream;
        const subCount = stream.subCount;
        const subGoal = stream.subGoal;
        const prevSubGoal = stream.prevSubGoal;

        return Math.floor(((subCount - prevSubGoal) / (subGoal - prevSubGoal)) * 100);
    },
    meterOffset: function() {
        const stream = this.stream;
        const subCount = stream.subCount;
        const subGoal = stream.subGoal;
        const prevSubGoal = stream.prevSubGoal;

        const subPercent = ((subCount - prevSubGoal) / (subGoal - prevSubGoal)) * 100;

        const dashArray = 630; // Taken from the cricle's CSS
        return dashArray * (1 - (subPercent / 100));
    },
    subCount: function () {
        return this.stream.subCount;
    },
    subsLeft: function () {
        const stream = this.stream;
        return stream.subGoal - stream.subCount;
    },
    winner: function() {
        const stream = this.stream;
        return stream.subWinner.length ? stream.subWinner : 'No winner yet'
    },
    showMenu: function() {
        return Session.get('showMenu');
    },
    menuActive: function (item) {
        return item === Session.get('menuActive') ? 'is-active' : '';
    }
});

Template.companion.events({
    'click [data-hook=content-button]': function () {
        Session.set('contentActive', true);
        Session.set('infoActive', false);
        Session.set('giveawayActive', false);
        Session.set('detailActive', false);
        Session.set('menuActive', 'content');

        const stream = Template.currentData();
        let type = '';
        if (typeof this.stream.liveContent === 'object') {
            type = this.stream.liveContent.type;
        }
        mixpanel.track('Content button click', {contentType: type});
    },
    'click [data-hook=info-button]': function () {
        Session.set('infoActive', true);
        Session.set('contentActive', false);
        Session.set('giveawayActive', false);
        Session.set('detailActive', false);
        Session.set('menuActive', 'info');

        const stream = Template.currentData();
        let type = '';
        if (typeof this.stream.liveContent === 'object') {
            type = this.stream.liveContent.type;
        }
        mixpanel.track('Info button click', {contentType: type});
    },
    'click [data-hook=giveaway-button]': function () {
        Session.set('infoActive', false);
        Session.set('contentActive', false);
        Session.set('giveawayActive', true);
        Session.set('menuActive', 'giveaway');

        const stream = Template.currentData();
        let type = '';
        if (typeof this.stream.liveContent === 'object') {
            type = this.stream.liveContent.type;
        }
        mixpanel.track('Giveaway button click', {contentType: type});

        //const data = Template.currentData();
        //setTimeout(function () {
        //    // Use bar's parent so that the animation can inherit the offset value
        //    renderSubBar(data, $('[data-hook=bar-parent]'));
        //}, 500);
    },
    'click [data-hook=detail-button]': function (e) {
        Session.set('detailActive', true);
        const charName = $(e.target).attr('data-name');
        Session.set('charName', charName);
        const character = Characters.findOne({name: charName});
        Session.set('character', character);

        mixpanel.track('Character Detail button click', {character: charName});
    },
    'click [data-hook=hide-button]': function() {
        Session.set('showMenu', false);
    },
    'click [data-hook=show-button]': function() {
        Session.set('showMenu', true);
    }
});

Template.companion.onDestroyed(function() {
    clearInterval(Session.get('interval'));
});