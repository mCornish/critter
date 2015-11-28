Template.admin.onCreated(function() {
    Session.set('streamSubmitErrors', {});
    Session.set('contentType', 'text');
    Session.set('imageName', null);
    Session.set('imageURL', null);
    Session.set('choiceCount', 1);

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
        Session.set('epTime', {
            hour: parseInt( hours ),
            minute: parseInt( minutes ),
            second: parseInt( seconds )
        });
    }, 1000);
});

Template.admin.helpers({
    errorMessage: function(field) {
        return Session.get('streamSubmitErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('streamSubmitErrors')[field] ? 'has-error' : '';
    },
    duration: function() {
        return Session.get('duration');
    },
    contentType: function(type) {
        return type === Session.get('contentType');
    },
    imageName: function() {
        return Session.get('imageName');
    },
    imageURL: function() {
        return Session.get('imageURL');
    },
    choiceCount: function() {
        return Session.get('choiceCount');
    },
    loopCount: function(count){
        var countArr = [];
        for (var i=0; i<count; i++){
            countArr.push({});
        }
        return countArr;
    }
});

Template.admin.events({
    'click [data-hook=toggle-stream]': function(e) {
        e.preventDefault();
        Meteor.call('toggleStreamLive');
    },
   'click [data-hook=live-toggle]': function(e) {
        e.preventDefault();

       const name = $(e.target).attr('data-name');
       const bool = $(e.target).attr('data-live') === 'true';

       Meteor.call('setLive', name.toString(), !bool);
    },
    'click [data-hook=save-ep]': function(e) {
        e.preventDefault();
        const epNumber = this.stream.epNumber;
        const epCast = this.stream.epCast;

        const episode = {
            number: epNumber,
            cast: epCast
        };

        Meteor.call('episodeUpsert', episode);
    },
    'submit [data-hook=ep-form]': function(e) {
        const $form = $(e.target);
        const epNumber = parseInt( $form.find('[name=ep]').val() );

        Stream.update(this.stream._id, {$set: {epNumber: epNumber}}, function(err) {
            if (err) {
                throwError(err.reason);
            }
        });
    },
    'click [data-hook=submit-content]': function() {
        $form = $('[data-hook=form-content]');

        const
            textContent = $('[data-hook=text-content]').val(),
            liveContent = $('[data-hook=live-content]').val(),
            liveText = $('[data-hook=live-text]').val(),
            liveLink = $('[data-hook=live-link]').val(),
            contentType = $('[data-hook=live-content-type]').val(),
            liveChoices = [];


        $('[data-hook=live-choice]').each(function() {
            const choice = {
                text: $(this).val(),
                resCount: 0
            };
            liveChoices.push(choice);
        });

        const stream = {
            liveContent: {
                type: contentType
            }
        };

        if (textContent.length) {
            stream.liveContent.text = textContent;
        } else {
            stream.liveContent.text = null;
        }

        if (contentType === 'text') {
            stream.liveContent.link = '';
            stream.liveContent.message = '';
            stream.liveContent.tweeter = '';
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
            if (liveText) {
                stream.liveContent.message = liveText;
            } else {
                stream.liveContent.message = Session.get('imageURL');
            }
            stream.liveContent.link = liveLink;
            stream.liveContent.tweeter = '';
        } else if (contentType === 'poll') {
            stream.liveContent.message = liveText;
            stream.liveContent.choices = liveChoices;
            stream.liveContent.link = '';
            stream.liveContent.resCount = 0;
            stream.liveContent.responders = [];
        }

        // Add content to live stream
        Stream.update(this.stream._id, {$set: stream}, function(error) {
            if (error) {
                throwError(error.reason);
            } else {
                mixpanel.track('content-update', {timestamp: Date.now()});
            }
        });

        // Add content to episode
        const content = {
            episode: this.stream.epNumber,
            text: '',
            type: contentType,
            link: stream.liveContent.link,
            message: stream.liveContent.message,
            from: '',
            time: Session.get('epTime')
        };
        if (stream.liveContent.text) {
            content.text = stream.liveContent.text;
        }
        if (stream.liveContent.tweeter) {
            content.from = stream.liveContent.tweeter;
        }

        Meteor.call('contentInsert', content);

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
    'click [data-hook=add-poll-choice]': function(e) {
        e.preventDefault();
        const choiceCount = Session.get('choiceCount');
        Session.set('choiceCount', choiceCount + 1);
    },
    'click [data-hook=clear-content]': function() {
        const liveContent = this.stream.liveContent;

        if (Object.keys(liveContent).length) {
            Stream.update(this.stream._id, {$set: {liveContent: {}}}, function (error, count) {
                if (error) {
                    throwError(error.reason);
                } else {
                    mixpanel.track('content-clear', {timestamp: Date.now()});
                }
            });
        }
    },
    'click [data-hook=submit-stream]': function(e) {
        e.preventDefault();

        $form = $('[data-hook=form-stream]');
        const prevGoal = this.stream.giveaway.prevSubGoal;
        let currentGoal = this.stream.giveaway.subGoal;
        const newGoal = parseInt( $form.find('[name=sub-goal]').val() );
        // If the sub goal hasn't been updated, don't change the previous sub goal
        if (currentGoal >= newGoal) {
            currentGoal = prevGoal;
        }

        const giveawayObj = {
            subCount: parseInt( $form.find('[name=sub-count]').val() ),
            subGoal: newGoal,
            prevSubGoal: currentGoal,
            subWinner: $form.find('[name=sub-winner]').val()
        };

        const errors = validateStream(giveawayObj, this.stream.giveaway.subCount, this.stream.giveaway.subGoal);
        if (errors.subCount || errors.subGoal)
            return Session.set('streamSubmitErrors', errors);
        Stream.update(this.stream._id, {$set: {giveaway: giveawayObj}}, function(error) {
            if (error) {
                throwError(error.reason);
            }
        });
    },
    'click [data-hook=inc-count]': function(e) {
        e.preventDefault();
        Meteor.call('incSub', 1);
    },
    'click [data-hook=dec-count]': function(e) {
        e.preventDefault();
        Meteor.call('incSub', -1);
    },
    'click [data-hook=inc-goal]': function(e) {
        e.preventDefault();
        Meteor.call('incGoal', 100);
    },
    'submit [data-hook=char-stats-form]': function(e) {
        e.preventDefault();

        const $form = $(e.target);

        const stats = {
            level: $form.find('[name=level]').val(),
            charisma: $form.find('[name=charisma]').val(),
            constitution: $form.find('[name=constitution]').val(),
            dexterity: $form.find('[name=dexterity]').val(),
            intelligence: $form.find('[name=intelligence]').val(),
            strength: $form.find('[name=strength]').val(),
            wisdom: $form.find('[name=wisdom]').val(),
            maxHp: $form.find('[name=maxHp]').val()
        };

        Characters.update($form.attr('data-id'), {$set: {charStats: stats}}, function(err) {
            if (err) {
                throwError(err.reason);
            }
        });
    },
    'submit [data-hook=char-vitals-form]': function(e) {
        e.preventDefault();

        const $form = $(e.target);

        const vitals = {
            hp: parseInt( $form.find('[name=hp]').val() ),
            ac: parseInt( $form.find('[name=ac]').val() ),
            strikes: parseInt( $form.find('[name=strikes]').val() )
        };

        Characters.update($form.attr('data-id'), {$set: {vitals: vitals}}, function(err) {
            if (err) {
                throwError(err.reason);
            } else {
                notify('Vitals Updated');
            }
        });
    },
    'click [data-hook=minus-hp]': function(e) {
        const $input = $('[name=update-hp]');
        const incValue = -parseInt( $input.val() );
        const charId = $input.attr('data-id');

        Characters.update(charId, {$inc: {'vitals.hp': incValue}}, function(err) {
            if (err) {
                throwError(err.reason);
            } else {
                notify('HP Subtracted');
            }
        });
    },
    'click [data-hook=plus-hp]': function(e) {
        const $input = $('[name=update-hp]');
        const incValue = parseInt( $input.val() );
        const charId = $input.attr('data-id');

        Characters.update(charId, {$inc: {'vitals.hp': incValue}}, function(err) {
            if (err) {
                throwError(err.reason);
            } else {
                notify('HP Added');
            }
        });
    },
    'click [data-hook=add-role]': function(e) {
        const $input = $(e.target).siblings('[name=role]');
        const role = $input.val();
        const userId = $(e.target).attr('data-uid');

        Meteor.call('addUserToRole', userId, role);
    },
    'click [data-hook=delete-user]': function(e) {
        const userId = $(e.target).attr('data-uid');
        const confirmed = confirm('Delete user ' + userId + '?');
        if (confirmed) {
            Meteor.users.remove(userId, function(error) {
                if (error) {
                    throwError(error.reason);
                }
            })
        }
    },
    'submit [data-hook=char-items-form]': function(e) {
        e.preventDefault();
        const items = [];
        $(e.target).find('[data-hook=item]').each(function() {
            const item = {
                name: $(this).val()
            };
            if (item.name !== '' && item.name !== null) {
                items.push(item);
            }
        });

        const id = $(e.target).attr('data-id');
        Characters.update(id, {$set: {items: items}}, function(err) {
            if (err) {
                throwError(err.reason);
            } else {
                notify('Items updated');
            }
        });
    },
    'submit [data-hook=char-attacks-form]': function(e) {
        e.preventDefault();
        const attacks = [];
        $(e.target).find('[data-hook=attack]').each(function() {
            const attack = {
                name: $(this).find('[name=name]').val(),
                type: $(this).find('[name=type]').val(),
                diceNum: $(this).find('[name=diceNum]').val(),
                diceVal: $(this).find('[name=diceVal]').val()
            };
            if (attack.name !== '' && attack.name !== null) {
                attacks.push(attack);
            }
        });

        const id = $(e.target).attr('data-id');
        Characters.update(id, {$set: {attacks: attacks}}, function(err) {
            if (err) {
                throwError(err.reason);
            } else {
                notify('Attacks updated');
            }
        });
    },
    'submit [data-hook=char-spells-form]': function(e) {
        e.preventDefault();
        const spells = [];
        $(e.target).find('[data-hook=spell]').each(function() {
            const spell = {
                name: $(this).val()
            };
            if (spell.name !== '' && spell.name !== null) {
                spells.push(spell);
            }
        });

        const id = $(e.target).attr('data-id');
        Characters.update(id, {$set: {spells: spells}}, function(err) {
            if (err) {
                throwError(err.reason);
            } else {
                notify('Spells Updated');
            }
        });
    },
    'submit [data-hook=episode-form]': function(e) {
        e.preventDefault();
        const episode = {
            name: $(e.target).find('[name=name]').val(),
            cast: $(e.target).find('[name=cast]').val().split(','),
            description: $(e.target).find('[name=description]').val(),
            airDate: $(e.target).find('[name=air-date]').val(),
            videoId: $(e.target).find('[name=video-id]').val()
        };
        const id = $(e.target).attr('data-id');

        Episodes.update(id, {$set: episode}, function(err) {
            if (err) {
                throwError(err.reason);
            } else {
                notify('Episode Updated');
            }
        });
    },
    'submit [data-hook=new-episode-form]': function(e) {
        e.preventDefault();
        const episode = {
            number: this.episodes.count() + 1,
            name: $(e.target).find('[name=name]').val(),
            cast: $(e.target).find('[name=cast]').val().split(','),
            description: $(e.target).find('[name=description]').val(),
            airDate: $(e.target).find('[name=air-date]').val(),
            videoId: $(e.target).find('[name=video-id]').val()
        };
        console.log(episode);

        Meteor.call('episodeInsert', episode, function(err) {
            if (err) {
                throwError(err.reason);
            } else {
                notify('Episode Added');
            }
        });
    }
});

var validateStream = function(stream, currentSubs, currentGoal) {
    const errors = {};

    if (!stream.subCount) {
        errors.subCount = 'Please enter a Sub Count';
    } else if (!stream.subGoal) {
        errors.subGoal = 'Please enter a Sub Goal';
    }
    //else if (stream.subCount < currentSubs) {
    //    errors.subCount = `Sub Count should be greater than ${currentSubs}`
    //} else if (stream.subGoal < currentGoal) {
    //    errors.subGoal = `Sub Goal should be greater than ${currentGoal}`
    //}
    return errors;
};