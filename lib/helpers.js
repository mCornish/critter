generateRandInt = function(min, max) {
    min = typeof min !== 'undefined' ? min : 0;
    max = typeof max !== 'undefined' ? max : 100;

    return Math.floor((Math.random() * max) + min);
};

generateRandFloat = function(min, max, decimals) {
    min = typeof min !== 'undefined' ? min : 0;
    max = typeof max !== 'undefined' ? max : 100;
    // number of decimal places
    decimals = typeof decimals !== 'undefined' ? decimals : 2;

    return ((Math.random() * max) + min).toFixed(decimals);
};

getDuration = function($element) {
    return $element.css('transition-duration').slice(0, -1) * 1000;
};

activate = function($element, delay, cb) {
    $element.css('transition-delay', delay + 'ms');
    $element.css('-webkit-transition-delay', delay + 'ms');
    $element.css('-moz-transition-delay', delay + 'ms');
    $element.css('-o-transition-delay', delay + 'ms');

    if (cb) {
        $element.addClass('is-active').on('transitionend', function() {
            cb();
        });
    } else {
        $element.addClass('is-active');
    }
};

deactivate = function($element, delay, cb) {
    $element.css('transition-delay', delay + 'ms');
    $element.css('-webkit-transition-delay', delay + 'ms');
    $element.css('-moz-transition-delay', delay + 'ms');
    $element.css('-o-transition-delay', delay + 'ms');
    if (cb) {
        $element.removeClass('is-active').on('transitionend', function() {
            cb();
        });
    } else {
        $element.removeClass('is-active');
    }
};