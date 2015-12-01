Template.watchLive.onCreated(function () {

    // Handle timer
    Session.set('zeroFlip', true);

    const
        offset = -8,
        showTime = 18;
    let
        now = new Date(),
        pstDate = moment(now).utcOffset(offset),
        pstHours = pstDate.hours(),
        pstMinutes = pstDate.minutes(),
        pstSeconds = pstDate.seconds(),

        hours = pstHours - showTime,
        minutes = pstMinutes,
        seconds = pstSeconds;

    if (hours <= 0) {
        seconds = 60 - seconds;
        minutes = 59 - minutes;
        if (hours !== 0) {
            hours = -hours;
        }
        Session.set('durationIsPos', false);
    } else {
        hours--;
        Session.set('durationIsPos', true);
    }
    // add zero for single-digit seconds/minutes
    if (seconds < 10) {
        seconds = ('0' + seconds).slice(-2);
    }
    if (minutes < 10) {
        minutes = ('0' + minutes).slice(-2);
    }
    Session.set('duration', `${hours}:${minutes}:${seconds}`);

    const interval = Meteor.setInterval(function () {
        now = new Date();
        let
            pstDate = moment(now).utcOffset(offset),
            pstHours = pstDate.hours(),
            pstMinutes = pstDate.minutes(),
            pstSeconds = pstDate.seconds(),

            hours = pstHours - showTime,
            minutes = pstMinutes,
            seconds = pstSeconds;

        // Check whether it should count down (before show) or down (during show)
        if (pstHours - showTime > 0) {  // Duration (at least 1 second past showtime)

            // Have to subtract an hour since it isn't the actual hour yet when counting up
            hours--;

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
            seconds = 60 - seconds;
            minutes = 59 - minutes;
            hours = -hours;

            seconds--;

            if (seconds < 0) {
                minutes--;
                if (minutes < 0) {
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
            seconds = 60 - seconds;
            minutes = 59 - minutes;

            seconds--;

            if (seconds < 0) {
                minutes--;
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


    // Handle page notification icons
    Session.set('changeArray', []);
    Session.set('currentContent', {});
    Session.set('currentGiveaway', {});
    const stream = Template.parentData(1).streamCursor;
    stream.observe({
        changed: function (id, fields) {
            const changeArray = Session.get('changeArray');
            const content = fields.liveContent;
            const giveaway = fields.giveaway;
            if (content !== Session.get('currentContent') && changeArray.indexOf('content') < 0) {
                changeArray.push('content');
            } else if (giveaway !== Session.get('currentGiveaway') && changeArray.indexOf('giveaway') < 0) {
                changeArray.push('giveaway');
            }
            Session.set('changeArray', changeArray);
        }
    });
    const chars = Template.parentData(1).liveChars;
    chars.observe({
        changed: function (id, fields) {
            const changeArray = Session.get('changeArray');
            if (changeArray.indexOf('characters') < 0) {
                changeArray.push('characters');
                Session.set('changeArray', changeArray);
            }
        }
    });

    // Remove tweets manually when appropriate, since the iframe sticks around when new content is added
    stream.observe({
        changed: function (newDoc, oldDoc) {
            // Only need to worry about this if the user is looking at the content page, otherwise the iframe will already be destroyed
            if (Session.equals('menuActive', 'content')) {
                const oldContent = oldDoc.liveContent;
                if (oldContent['type'] === 'tweet') {
                    const newContent = newDoc.liveContent;
                    // If a second tweet is being added, we'll just have to reload. Otherwise, remove the iframe.
                    if (newContent['type'] !== 'tweet') {
                        $('iframe').remove();
                    } else {
                        Router.go('watchLive');
                    }
                }
            }
        }
    });

    Session.set('interval', interval);
    Session.set('cast', null);
    Session.set('detailActive', false);
    Session.set('menuActive', 'content');
    Session.set('showMenu', true);
    Session.set('page', Template.parentData(1).page || 'content');
});

Template.watchLive.helpers({
    answerClass: function(isAnswer) {
        return isAnswer ? 'is-answer' : '';
    },
    character: function () {
        const characters = this.liveChars.fetch();
        const charName = Session.get('charName');
        return _.findWhere(characters, {name: charName});
    },
    contentType: function (type) {
        if (typeof this.stream.liveContent === 'object') {
            return type === this.stream.liveContent.type;
        }
        return false;
    },
    detailActive: function () {
        return Session.get('detailActive');
    },
    detailClass: function (name) {
        const activeName = Session.get('charName');
        return name === activeName ? 'is-active' : '';
    },
    duration: function () {
        return Session.get('duration');
    },
    durationText: function () {
        return Session.get('durationIsPos') ? 'Duration' : 'Countdown';
    },
    hasContent: function () {
        return Object.keys(this.stream.liveContent).length;
    },
    liveContent: function () {
        return $.parseHTML(this.stream.liveContent);
    },
    subPercent: function () {
        const stream = this.stream;
        const subCount = stream.giveaway.subCount;
        const subGoal = stream.giveaway.subGoal;
        const prevSubGoal = stream.giveaway.prevSubGoal;

        return Math.floor(((subCount - prevSubGoal) / (subGoal - prevSubGoal)) * 100);
    },
    meterOffset: function () {
        const stream = this.stream;
        const subCount = stream.giveaway.subCount;
        const subGoal = stream.subGoal;
        const prevSubGoal = stream.prevSubGoal;

        const subPercent = ((subCount - prevSubGoal) / (subGoal - prevSubGoal)) * 100;

        const dashArray = 630; // Taken from the circle's CSS
        return dashArray * (1 - (subPercent / 100));
    },
    subCount: function () {
        return this.stream.giveaway.subCount;
    },
    subsLeft: function () {
        const stream = this.stream;
        return stream.giveaway.subGoal - stream.giveaway.subCount;
    },
    winner: function () {
        const stream = this.stream;
        return stream.giveaway.subWinner.length ? stream.giveaway.subWinner : 'No winner yet'
    },
    showMenu: function () {
        return Session.get('showMenu');
    },
    pageIs: function (page) {
        return page === Session.get('page');
    },
    menuActive: function (item) {
        return item === Session.get('page') ? 'is-active' : '';
    },
    pageChanged: function (page) {
        const changeArray = Session.get('changeArray');
        return changeArray.indexOf(page) > -1;
    },

    // Used to check if image has a link before rendering
    hasLink: function () {
        return this.stream.liveContent.link != '' && this.stream.liveContent.link != null;
    },

    // Check if user has responded to poll/question
    isResponder: function () {
        if (typeof Meteor.userId() === 'string') {
            const responders = this.stream.liveContent.responders;
            return responders.indexOf(Meteor.userId()) > -1;
        } else {
            return false;
        }
    },

    // Poll/question results for looping through
    results: function () {
        const results = [];
        const resCount = this.stream.liveContent.resCount;
        this.stream.liveContent.choices.forEach(function (choice) {
            const result = {
                text: choice.text,
                percentage: (choice.resCount / resCount) * 100,
                isAnswer: choice.isAnswer
            };
            results.push(result);
        });
        return results;
    }
});

Template.watchLive.events({
    'click [data-hook=content-button]': function () {
        Session.set('page', 'content');
        Session.set('detailActive', false);
        Session.set('menuActive', 'content');
        const changeArray = Session.get('changeArray');
        const i = changeArray.indexOf('content');
        if (i > -1) {
            changeArray.splice(i, 1);
            Session.set('changeArray', changeArray);
            Session.set('currentContent', this.stream.liveContent);
        }

        const stream = Template.currentData();
        let type = '';
        if (typeof this.stream.liveContent === 'object') {
            type = this.stream.liveContent.type;
        }
        analytics.track('Content button click', {contentType: type});
    },
    'click [data-hook=info-button]': function () {
        Session.set('page', 'characters');
        Session.set('detailActive', false);
        Session.set('menuActive', 'info');
        const changeArray = Session.get('changeArray');
        const i = changeArray.indexOf('characters');
        if (i > -1) {
            changeArray.splice(i, 1);
            Session.set('changeArray', changeArray);
        }

        const stream = Template.currentData();
        let type = '';
        if (typeof this.stream.liveContent === 'object') {
            type = this.stream.liveContent.type;
        }
        analytics.track('Info button click', {contentType: type});
    },
    'click [data-hook=giveaway-button]': function () {
        Session.set('page', 'giveaway');
        Session.set('menuActive', 'giveaway');
        // Check for changes and update notifications
        const changeArray = Session.get('changeArray');
        const i = changeArray.indexOf('giveaway');
        if (i > -1) {
            changeArray.splice(i, 1);
            Session.set('changeArray', changeArray);
            Session.set('currentGiveaway', this.stream.giveaway);
        }

        const stream = Template.currentData();
        let type = '';
        if (typeof this.stream.liveContent === 'object') {
            type = this.stream.liveContent.type;
        }
        analytics.track('Giveaway button click', {contentType: type});
    },
    'click [data-hook=detail-button]': function (e) {
        Session.set('detailActive', true);
        Session.set('menuActive', 'info');
        const charName = $(e.target).attr('data-name');
        Session.set('charName', charName);

        analytics.track('Character Detail button click', {character: charName});
    },
    'click [data-hook=hide-button]': function () {
        Session.set('showMenu', false);
    },
    'click [data-hook=show-button]': function () {
        Session.set('showMenu', true);
    },
    'click [data-track=content]': function () {
        analytics.track('Live link click', {type: this.stream.liveContent.type});
    },
    'click [data-hook=choice-submit]': function (e) {
        e.preventDefault();
        const choice = $('[data-hook=choice]:checked');
        const text = choice.val();

        Meteor.call('incChoice', text);
        Meteor.call('addResponder', function(err) {
            if (err) {
                throwError('Unable to save answer: ' + err.reason);
            } else {
                analytics.track('Live choice submitted');
            }
        });
    }
});

Template.watchLive.onDestroyed(function () {
    Meteor.clearInterval(parseInt(Session.get('interval')));
});