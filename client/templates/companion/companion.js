Template.companion.onCreated(function () {
    const
        now = new Date(),
        utc = now.getTime(),
        offset = -8,
        showTime = 19;
    let
        pstDate = new Date(utc + (3600000 * offset)),
        pstHours = pstDate.getHours(),
        pstMinutes = pstDate.getMinutes(),
        pstSeconds = pstDate.getSeconds(),

        hours = pstHours - showTime,
        minutes = pstMinutes,
        seconds = pstSeconds;

    Session.set('duration', `${hours}:${minutes}:${seconds}`);

    const interval = setInterval(function () {
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

        Session.set('duration', `${hours}:${minutes}:${seconds}`);
    }, 1000);

});

Template.companion.helpers({
    isLive: function() {
        // return Session.get('isLive');
        return true;
    },
    liveContent: function() {
        return $.parseHTML(this.stream.liveContent);
    },
    contentType: function(type) {
        return type === this.stream.liveContent.type;
    },
    duration: function () {
        return Session.get('duration');
    },
    subCount: function() {
        return this.stream.subCount;
    },
    subsLeft: function() {
        const stream = this.stream;
        return stream.subGoal - stream.subCount;
    }
});

Template.companion.events({});