Template.admin.onCreated(function() {
    Session.set('streamSubmitErrors', {});
    Session.set('contentType', 'text');
    Session.set('imageName', null);
    Session.set('imageURL', null);
});

Template.admin.helpers({
    errorMessage: function(field) {
        return Session.get('streamSubmitErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('streamSubmitErrors')[field] ? 'has-error' : '';
    },
    characters: function() {
        return Characters.find();
    },
    contentType: function(type) {
        return type === Session.get('contentType');
    },
    imageName: function() {
        return Session.get('imageName');
    },
    imageURL: function() {
        return Session.get('imageURL');
    }
});

Template.admin.events({
   'click [data-hook=live-toggle]': function(e) {
        e.preventDefault();

       const name = $(e.target).attr('data-name');
       const bool = $(e.target).attr('data-live') === 'true' ? true : false;

       Meteor.call('setLive', name.toString(), !bool);
    },
    'click [data-hook=submit-content]': function() {
        $form = $('[data-hook=form-content]');

        const
            liveContent = $('[data-hook=live-content]').val(),
            liveText = $('[data-hook=live-text]').val(),
            liveLink = $('[data-hook=live-link]').val(),
            contentType = $('[data-hook=live-content-type]').val();

        const stream = {
            liveContent: {
                type: contentType
            }
        };

        if (contentType === 'text') {
            stream.liveContent.message = liveContent;
        } else if (contentType === 'link') {
            stream.liveContent.link = liveLink;
            stream.liveContent.message = liveText;
        } else if (contentType === 'tweet') {
            stream.liveContent.message = liveContent.slice(liveContent.indexOf('"ltr">') + 6, liveContent.indexOf('</p>&mdash;'));
            // poster name and Twitter name
            stream.liveContent.tweeter = liveContent.slice(liveContent.indexOf('</p>&mdash; ') + 12, liveContent.indexOf(' <a href="https://twitter'));
            stream.liveContent.link = liveContent.slice(liveContent.indexOf(') <a href="https://twitter') + 11, liveContent.indexOf('/status/') + 26);
        } else if (contentType === 'yt') {
            stream.liveContent.link = liveContent.slice(liveContent.indexOf('watch?v=') + 8);
        } else if (contentType === 'image') {
            stream.liveContent.link = Session.get('imageURL');
        }

        Stream.update(this.stream._id, {$set: stream}, function(error) {
            if (error) {
                throwError(error.reason);
            } else {
                mixpanel.track('content-update', {timestamp: Date.now()});
            }
        });
    },
    'change [data-hook=live-content-type]': function(e) {
        const type = $(e.target).val();
        Session.set('contentType', type);
    },
    'change [name=live-image]': function(e) {
        FS.Utility.eachFile(e, function(file) {
            Images.insert(file, function (err, fileObj) {
                if (err) {
                    alert(err.reason);
                } else {
                    Session.set('imageName', fileObj.original.name);
                    setTimeout(function() {
                        Session.set('imageURL', '/cfs/files/images/' + fileObj._id);
                    }, 1000);
                }
            });
        });
    },
    'click [data-hook=clear-content]': function() {
        Stream.update(this.stream._id, {$set: {liveContent: {}}}, function(error, count) {
            if (error) {
                throwError(error.reason);
            } else {
                mixpanel.track('content-clear', {timestamp: Date.now()});
            }
        });
    },
    'click [data-hook=submit-stream]': function() {
        $form = $('[data-hook=form-stream]');

        const stream = {
            subCount: parseInt( $form.find('[name=sub-count]').val() ),
            subGoal: parseInt( $form.find('[name=sub-goal]').val() ),
            subWinner: $form.find('[name=sub-winner]').val()
        };

        const errors = validateStream(stream, this.stream.subCount, this.stream.subGoal);
        if (errors.subCount || errors.subGoal)
            return Session.set('streamSubmitErrors', errors);
        Stream.update(this.stream._id, {$set: stream}, function(error) {
            if (error) {
                throwError(error.reason);
            } else {
                mixpanel.track('stream-stats-update', {timestamp: Date.now()});
            }
        });
    },
    'click [data-hook=inc-count]': function() {
        Meteor.call('incSub', 1);
    },
    'click [data-hook=inc-goal]': function() {
        Meteor.call('incGoal', 100);
    },
    'click [data-hook=add-role]': function(e) {
        const $input = $(e.target).siblings('[name=role]');
        const role = $input.val();
        const userId = $(e.target).attr('data-uid');

        Meteor.call('addUserToRole', userId, role);
    }
});

var validateStream = function(stream, currentSubs, currentGoal) {
    const errors = {};

    if (!stream.subCount) {
        errors.subCount = 'Please enter a Sub Count';
    } else if (!stream.subGoal) {
        errors.subGoal = 'Please enter a Sub Goal';
    } else if (stream.subCount < currentSubs) {
        errors.subCount = `Sub Count should be greater than ${currentSubs}`
    } else if (stream.subGoal < currentGoal) {
        errors.subGoal = `Sub Goal should be greater than ${currentGoal}`
    }
    return errors;
};