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

// Attempt at page transition animations
//Template.layout.events({
//    'click [data-hook=button]': function(e) {
//        e.preventDefault();
//        var url = $(e.target).attr('href');
//
//        var color = $(e.target).css('background-color');
//        $('[data-hook=transition-block]').css('background-color', color);
//        $('[data-hook=transition-block]')
//            .addClass('transition-block--active');
//
//        setTimeout(function() {
//            window.location = url;
//        }, 1000);
//
//    }
//});