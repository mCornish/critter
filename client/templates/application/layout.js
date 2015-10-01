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