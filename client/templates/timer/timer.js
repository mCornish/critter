Template.timer.onCreated(function () {
    Session.set('timing', false);
    Session.set('duration', '0:00:00');
});

Template.timer.helpers({
    duration: function () {
        return Session.get('duration');
    },
    timing: function () {
        return Session.get('timing');
    }
});

Template.timer.events({
    'click [data-hook=start-button]': function (e) {
        e.preventDefault();
        const timing = Session.get('timing');

        Session.set('timing', !timing);

        let hours = Session.get('hours'),
            minutes = Session.get('minutes'),
            seconds = Session.get('seconds');

        if (timing) {
            clearInterval(Session.get('timingInterval'));
        } else {
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

                const totalSeconds = hours * 3600 + minutes * 60 + seconds;
                Session.set('totalSeconds', totalSeconds);
                Session.set('duration', `${hours}:${minutes}:${seconds}`);
            }, 1000);
            Session.set('timingInterval', interval)
        }
    }
});