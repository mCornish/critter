Template.find.onRendered(function() {
    Session.set('gender', null);
    Session.set('recipient', null);
    Session.set('minAge', null);
    Session.set('maxAge', null);
    Session.set('minPrice', null);
    Session.set('maxPrice', null);
    Session.set('occasion', null);
    Session.set('stepOne', true);
    Session.set('stepTwo', false);
    Session.set('stepThree', false);
    Session.set('stepFour', false);
    Session.set('results', false)
    Session.set('gifts', null);

    // check whether we got a gender from the route
    Session.set('hasGender', Router.current().data().routeGender != null);
});

Template.find.helpers({
    updatedRecipients: function() {
        if (Session.get('gender')) {
            return Recipients.find(
                { $or: [ {gender: Session.get('gender')}, {gender: 'neutral'} ] },
                { limit: 11, sort: {giftCount: -1} }
            )
        }
    },
    // TODO get remaining recipients/occasions, excluding the ones already available
    remainingRecipients: function() {
        return Recipients.find(
            { $or: [ {gender: Session.get('gender')}, {gender: 'neutral'} ] },
            { sort: { giftCount: -1 } }
        )
    },
    remainingOccasions: function() {
        return Occasions.find(
            {},
            { sort: { giftCount: -1 } }
        )
    },
    stepOne: function() {
        return Session.get('stepOne');
    },
    stepTwo: function() {
        return Session.get('stepTwo');
    },
    stepThree: function() {
        return Session.get('stepThree');
    },
    stepFour: function() {
        return Session.get('stepFour');
    },
    results: function() {
        return Session.get('results');
    },
    gender: function() {
        return Session.get('gender') || Router.current().data().routeGender;
    },
    recipient: function() {
        return Session.get('recipient');
    },
    minAge: function() {
        return Session.get('minAge');
    },
    maxAge: function() {
        return Session.get('maxAge');
    },
    minPrice: function() {
        return Session.get('minPrice');
    },
    maxPrice: function() {
        return Session.get('maxPrice');
    },
    occasion: function() {
        return Session.get('occasion');
    },
    genderPossessive: function() {
        // try to get text from Router
        var routeText = Router.current().data().genderPossessive;
        if (routeText)
            return routeText;

        // try to get text from Session
        var sessionGender = Session.get('gender');
        if (sessionGender) {
            if (sessionGender === 'male')
                return 'His';
            return 'Her';
        }

        // if we don't know gender, return default text
        return 'Her/His';
    },
    gifts: function() {
        var minAge = parseInt( Session.get('minAge')),
            maxAge = parseInt( Session.get('maxAge')),
            minPrice = parseFloat( Session.get('minPrice')),
            maxPrice = parseFloat( Session.get('maxPrice')),
            occasion = Session.get('occasion'),
            ageQuery = {},
            priceQuery = {},
            occasionQuery = {};
        if ( ! ( isNaN(minAge) || isNaN(maxAge) ) ) {
            ageQuery = { $and: [
                { age: { $gt: minAge } },
                { age: { $lt: maxAge } }
            ]}
        }
        if ( ! ( isNaN(minPrice) || isNaN(maxPrice) ) ) {
            priceQuery = { $and: [
                { price: { $gt: minPrice } },
                { price: { $lt: maxPrice } }
            ]}
        }
        if ( occasion ) {
            occasionQuery = {
                occasion: occasion
            }
        }
        return Gifts.find({ $and: [
            { recipient: Session.get('recipient') },
            ageQuery,
            priceQuery,
            occasionQuery
        ]});
    }
});

Template.find.events({
    'change [data-hook=gender]': function(e) {
        e.preventDefault();

        var gender = $(e.target).val();

        Session.set('gender', gender);
        Session.set('hasGender', true);

        // show next step if recipient has been selected
        if (Session.get('recipient'))
            Session.set('stepTwo', true);
    },
    'change [data-hook=recipient]': function(e) {
        e.preventDefault();

        var recipient = $(e.target).val();

        Session.set('recipient', recipient);

        // show next step if gender has been defined
        if (Session.get('hasGender'))
            Session.set('stepTwo', true);
    },
    'change [data-hook=age]': function(e) {
        e.preventDefault();

        var minAge = null,
            maxAge = null,
            hyphen = null,
            ageValue = $(e.target).val().toLowerCase();

        switch (ageValue) {
            case 'any':
                minAge = null;
                maxAge = null;
                break;
            case 'newborn':
                minAge = 0;
                maxAge = 1;
                break;
            case '50+':
                minAge = 51;
                maxAge = 100;
                break;
            default:
                hyphen = ageValue.indexOf('-');
                minAge = parseInt(ageValue.substr(0, hyphen));
                maxAge = parseInt(ageValue.substr(hyphen + 1));
                break;
        }

        Session.set('minAge', minAge);
        Session.set('maxAge', maxAge);

        Session.set('stepThree', true);
    },
    // TODO figure out why decimal renders as 3/4
    'keydown [data-hook=min-price]': function(e) {
        var character = String.fromCharCode(e.which);
        var minPrice = $(e.target).val();

        if (e.keyCode == 8) {
            minPrice = minPrice.slice(0, -1);
        } else {
            minPrice += character;
        }

        minPrice = parseFloat(minPrice).toFixed(2);
        Session.set('minPrice', minPrice);
    },
    'change [data-hook=min-price]': function(e) {
        e.preventDefault();
        var minPrice = $(e.target).val();
        minPrice = parseFloat(minPrice).toFixed(2);

        Session.set('minPrice', minPrice);

        if (Session.get('maxPrice'))
            Session.set('stepFour', true);
    },
    'keydown [data-hook=max-price]': function(e) {
        var character = String.fromCharCode(e.which);
        var maxPrice = $(e.target).val();

        if (e.keyCode == 8) {
            maxPrice = maxPrice.slice(0, -1);
        } else {
            maxPrice += character;
        }

        maxPrice = parseFloat(maxPrice).toFixed(2);
        Session.set('maxPrice', maxPrice);
    },
    'change [data-hook=max-price]': function(e) {
        e.preventDefault();
        var maxPrice = $(e.target).val();
        maxPrice = parseFloat(maxPrice).toFixed(2);

        Session.set('maxPrice', maxPrice);

        if (Session.get('minPrice'))
            Session.set('stepFour', true);
    },
    'change [data-hook=occasion]': function(e) {
        e.preventDefault();

        var occasion = $(e.target).val();

        Session.set('occasion', occasion);

        Session.set('results', true);
    }
});
