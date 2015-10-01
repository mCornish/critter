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