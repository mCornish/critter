// Fixture data
if (Gifts.find().count() === 0) {
    var now = new Date().getTime();

    // create two users
    var janeId = Meteor.users.insert({
        profile: {
            username: 'JaneDoe',
            image: 'http://fillmurray.com/300/300'
        }
    });
    var jane = Meteor.users.findOne(janeId);
    var mikeId = Meteor.users.insert({
        profile: {
            username: 'MikeCornish',
            image: 'http://fillmurray.com/200/200'
        }
    });
    var mike = Meteor.users.findOne(mikeId);

    var headphonesId = Gifts.insert({
        title: 'Perfect Movie Headphones',
        description: 'These Seinheisser headphones will absolutely rattle your brain in the best way.',
        userId: mike._id,
        image: 'http://ecx.images-amazon.com/images/I/41encHjQnhL._SY450_.jpg',
        link: 'http://www.amazon.com/dp/B002TLT10S/ref=wl_it_dp_o_pd_nS_ttl?_encoding=UTF8&colid=3OUL68SBBBXSI&coliid=I3MZZGGEXFH3AM&psc=1',
        recipient: 'mom',
        occasion: 'Wedding',
        price: 199.99,
        age: 21,
        submitted: new Date(now - 7 * 3600 * 1000),
        commentsCount: 2,
        wanters: [],
        wants: 0
    });

    Comments.insert({
        giftId: headphonesId,
        userId: jane._id,
        submitted: new Date(now - 5 * 3600 * 1000),
        body: 'I need these headphones!'
    });

    Comments.insert({
        giftId: headphonesId,
        userId: mike._id,
        submitted: new Date(now - 5 * 3600 * 1000),
        body: 'Grab them while you can. They\'re high quality for that price.'
    });

    Gifts.insert({
        title: 'The husband loves these',
        description: 'You can\'t image a better pair of socks. That\'s what he told me anyway. I\'m a little jealous, actually.',
        userId: jane._id,
        image: 'http://ecx.images-amazon.com/images/I/51sfxlEd1AL._SX425_.jpg',
        link: 'http://www.amazon.com/dp/B000XFW6OU/ref=wl_it_dp_o_pC_S_ttl?_encoding=UTF8&colid=3OUL68SBBBXSI&coliid=IDC1G4192VKCA&psc=1',
        recipient: 'dad',
        occasion: 'Christmas',
        price: 19.95,
        age: 33,
        submitted: new Date(now - 14 * 3600 * 1000),
        commentsCount: 0,
        wanters: [],
        wants: 0
    });

    for (let i = 0; i < 30; i++) {
        let randWidth = Math.floor(Math.random() * (1920 - 301)) + 300,
            randHeight = Math.floor(Math.random() * (1920 - 301)) + 300;

        Gifts.insert({
            title: 'Test post #' + i,
            description: 'This is a test post for a gift. I am test gift #' + i + '.',
            userId: mike._id,
            image: `http://lorempixel.com/${randWidth}/${randHeight}/technics/`,
            link: 'http://google.com/?q=test-' + i,
            recipient: 'male#' + i,
            occasion: 'occasion#' + i,
            price: parseFloat(generateRandFloat(5, 1000, 2)),
            age: generateRandInt(1, 100),
            submitted: new Date(now - 14 * 3600 * 1000),
            commentsCount: 0,
            wanters: [],
            wants: 0
        });
    }


}