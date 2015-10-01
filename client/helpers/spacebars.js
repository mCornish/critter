Template.registerHelper('pluralize', function(n, thing) {
    if (n === 1) {
        return '1 ' + thing;
    } else {
        return n + ' ' + thing + 's';
    }
});

Template.registerHelper('activeRouteClass', function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    var active = _.any(args, function(name) {
        return Router.current() && Router.current().route.getName() === name
    });

    return active && 'active';
});

Template.registerHelper('getGenerosityLevel', function(generosity) {
    var generosity = parseInt(generosity);

    if (generosity < 100) {
        return 'Gift Guppie';
    } else if (generosity >= 100 && generosity < 250) {
        return 'Thoughtful'
    } else if (generosity >= 100 && geneosity < 500) {
        return 'Giver'
    }
});