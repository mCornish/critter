Template.giftsList.onCreated(function () {
    $(window).on('scroll', _.debounce(function () {
        const scroll = $(window).scrollTop() + $(window).height(),
            docHeight = $(document).height();
            //$grid = $('[data-hook=gifts]');
           // gridInitialHeight = $grid.height();

        if (scroll >= docHeight) {
            const
                gifts = Router.current().data().gifts,
                giftsLimit = Session.get('giftsLimit'),
                increment = Session.get('increment');

            if (Session.equals('hasMore', true)) {
                //const gridHeight = $grid.height(),
                //    $gifts = $('[data-hook=gift]');
                //let giftsHeight = 0;
                //
                //$gifts.each(function(index) {
                //    if (index >= giftCount && index % 4 === 0) {
                //        giftsHeight += $(this).height();
                //    }
                //});

                Session.set('giftsLimit', giftsLimit + increment);
                //$grid.height(gridHeight + giftsHeight);

                //giftCount += 3;
            }

            Session.set('hasMore', gifts.count() === giftsLimit);

        }
    }, 300));
});

Template.giftsList.onRendered(function () {
    let $grid = $('[data-hook=gifts]');

    //$grid.imagesLoaded(function (instance) {
    //    $grid.masonry({
    //        //percentPosition: true,
    //        columnWidth: 300,
    //        itemSelector: '[data-hook=gift]'
    //    });
    //});


    const startOfDay = new Date().setHours(0, 0, 0, 0);

    Session.set('formIsActive', false);
    Session.set('submitted', startOfDay);
    Session.set('minAge', 0);
    Session.set('maxAge', 500);
    Session.set('minPrice', 0);
    Session.set('maxPrice', 100000);
    Session.set('recipient', null);
    Session.set('occasion', null);
    Session.set('activeGift', null);
    Session.set('hasMore', true);
    Session.set('increment', Router.current().data().increment);
    Session.set('giftsLimit', Session.get('increment'));
    Session.set('browseControlsActive', true);
    Session.set('sortNew', true);
    Session.set('sortTop', false);
});

Template.giftsList.helpers({
    formClass: function () {
        if (Session.get('formIsActive')) {
            return 'is-active';
        } else {
            return '';
        }
    },
    filteredGifts: function () {
        const
            submitted = Session.get('submitted'),
            minAge = Session.get('minAge'),
            maxAge = Session.get('maxAge'),
            minPrice = Session.get('minPrice'),
            maxPrice = Session.get('maxPrice'),
            recipient = Session.get('recipient'),
            occasion = Session.get('occasion'),
            sort = Router.current().data().sort;
        let
            submittedQuery = {},
            ageQuery = {},
            priceQuery = {},
            recipientQuery = {},
            occasionQuery = {};

        // Set up queries
        if (submitted) {
            submittedQuery = {submitted: {$gte: new Date(submitted)}};
        }
        if ((!isNaN(minAge) && !isNaN(maxAge)) && (minAge >= 0 && maxAge >= 1)) {
            ageQuery = {$and: [{age: {$gte: minAge}}, {age: {$lte: maxAge}}]};
        }
        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
            priceQuery = {$and: [{price: {$gte: minPrice}}, {price: {$lte: maxPrice}}]};
        }
        if (recipient) {
            recipientQuery = {recipient: recipient};
        }
        if (occasion) {
            occasionQuery = {occasion: occasion};
        }

        // Get filtered gifts
        if (submittedQuery || ageQuery || priceQuery || recipientQuery || occasionQuery) {
            return Gifts.find({$and: [submittedQuery, ageQuery, priceQuery, recipientQuery, occasionQuery]}, {
                limit: Session.get('giftsLimit'),
                sort: sort
            });
        }
    },
    hasMore: function () {
        return Session.get('hasMore');
    },
    controlsClass: function() {
        if (!Session.get('browseControlsActive')) {
            return 'hidden';
        } else {
            return '';
        }
    },
    newClass: function() {
        return Session.get('sortNew') ? 'is-active' : '';
    },
    topClass: function() {
        return Session.get('sortTop') ? 'is-active' : '';
    }
});

Template.giftsList.events({
    'click [data-hook=filter-button]': function (e) {
        e.preventDefault();

        const active = Session.get('formIsActive');
        Session.set('formIsActive', !active);
    },
    'click [data-hook=new-button]': function(e) {
        Session.set('sortNew', true);
        Session.set('sortTop', false);
    },
    'click [data-hook=top-button]': function(e) {
        Session.set('sortTop', true);
        Session.set('sortNew', false);
    },
    'change [data-hook=submitted]': function (e) {
        e.preventDefault();
        const submittedValue = $(e.target).val().toLowerCase();
        let submitted = null;

        switch (submittedValue) {
            case 'today':
                // beginning of day
                submitted = moment().subtract(1, 'days').toDate();
                break;
            case 'this week':
                submitted = moment().subtract(1, 'weeks').toDate();
                break;
            case 'this month':
                submitted = moment().subtract(1, 'months').toDate();
                break;
            case 'this year':
                submitted = moment().subtract(1, 'years').toDate();
                break;
        }

        Session.set('submitted', submitted);

        // call masonry
        masonryUpdate();
    },
    'change [data-hook=age]': function (e) {
        e.preventDefault();
        const ageValue = $(e.target).val().toLowerCase();
        let minAge = null,
            maxAge = null,
            hyphen = null;

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

        // call masonry
        masonryUpdate();
    },
    'change [data-hook=min-price]': function (e) {
        e.preventDefault();
        const minPrice = parseFloat($(e.target).val());

        Session.set('minPrice', minPrice);

        // call masonry
        masonryUpdate();
    },
    'change [data-hook=max-price]': function (e) {
        e.preventDefault();
        const maxPrice = parseFloat($(e.target).val());

        Session.set('maxPrice', maxPrice);

        // call masonry
        masonryUpdate();
    },
    'change [data-hook=recipient]': function (e) {
        e.preventDefault();
        let recipient = $(e.target).val();
        // Check for 'any' setting
        recipient = recipient === 'Anyone' ? null : recipient;

        Session.set('recipient', recipient);

        // call masonry
        masonryUpdate();
    },
    'change [data-hook=occasion]': function (e) {
        e.preventDefault();
        let occasion = $(e.target).val();
        // Check for 'any' setting
        occasion = occasion === 'Any Occasion' ? null : occasion;

        Session.set('occasion', occasion);

        // call masonry
        masonryUpdate();
    },
    'click [data-hook=more]': function (e) {
        e.preventDefault();
        const
            gifts = Router.current().data().gifts,
            giftsLimit = Session.get('giftsLimit'),
            increment = Session.get('increment');

        if (Session.equals('hasMore', true)) {
            Session.set('giftsLimit', giftsLimit + increment);
        }

        Session.set('hasMore', gifts.count() === giftsLimit);
    }
});

Template.giftsList.onDestroyed(function () {
    $(window).off('scroll');
});

function masonryUpdate() {
    //const $grid = $('[data-hook=gifts]');
    //$grid.imagesLoaded(function (instance) {
    //    console.log(instance);
    //    $grid.masonry('reloadItems');
    //});
}