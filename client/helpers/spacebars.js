Template.registerHelper('routeActive', function(path) {
    const pathname = Router.current().url
        .replace('http://','')
        .replace('https://', '')
        .replace('www.', '')
        .replace('localhost:3000', '')
        .replace('critterapp.com');
    const slice1 = pathname.slice(0, -1);
    const slice2 = pathname.slice(-1);
    let route;
    if (slice1 == "") {
        route = "/home";
    } else {
        if (slice2 == "/"){
            route = slice1;
        } else {
            route = pathname;
        }
    }

    return route.indexOf(path) > -1 ? 'is-active' : '';
});

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

// turn object into array to allow looping
Template.registerHelper('arrayify', function(obj) {
    const result = [];
    for (var key in obj) {
        result.push({
            key: key,
            value: obj[key]
        });
    }
    return result;
});