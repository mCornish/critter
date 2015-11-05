Template.layout.onCreated(function() {
    const clientID = 'gnaco6mlplv9shlc9demh6dljdny4we';
    Twitch.init({clientId: clientID}, function(error, status) {
        if (error) {
            console.log(error);
        }
    });
    Twitch.getStatus(function(err, status) {
        if (status.authenticated) {
            Session.set('twitchToken', status.token);
            if (!Meteor.userId()) {

            }
        }
    });

    // Log Date that user loaded layout
    if (Meteor.userId()) {
        Meteor.call('updateActivity');
    }
});

Template.layout.onRendered(function() {
    this.find('[data-hook="main"]')._uihooks = {
        insertElement: function(node, next) {
            $(node)
                .hide()
                .insertBefore(next)
                .fadeIn();
        },
        removeElement: function(node) {
            $(node).fadeOut(function() {
                $(this).remove();
            });
        }
    }
});

Template.layout.helpers({
    authedClass: function() {
        const unauthed = typeof Meteor.userId() !== 'string';
        const isHome = Router.current().route.path() === '/';

        return unauthed && isHome ? 'is-unauthed' : '';
    }
});