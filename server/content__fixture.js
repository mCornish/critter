if (Content.find().count() === 0) {

    Content.insert({
        episode: 1,
        type: 'text',  // text, link, tweet, yt, image
        text: 'Hi, Critters!',  // message, link text, tweet text
        time: {
            hour: 0,
            minute: 0,
            second: 5
        }
    });

    Content.insert({
        episode: 1,
        type: 'tweet',  // text, link, tweet, yt, image
        text: '¯\_(ツ)_/¯ <a href="https://t.co/B9jGcP3Qq6">https://t.co/B9jGcP3Qq6</a>',  // message, link text, tweet text
        link: 'https://twitter.com/TheVulcanSalute/status/650728037034688512',  // link url, yt video url
        from: 'Ashley Johnson (@TheVulcanSalute)',   // text/link provider, tweeter
        time: {
            hour: 0,
            minute: 0,
            second: 10
        }
    });

    Content.insert({
        episode: 1,
        type: 'link',  // text, link, tweet, yt, image
        text: 'Check out our homepage!',  // message, link text, tweet text
        link: 'http://critrole.com',  // link url, yt video url
        time: {
            hour: 0,
            minute: 0,
            second: 15
        }
    });

    Content.insert({
        episode: 1,
        type: 'yt',  // text, link, tweet, yt, image
        link: 'GFU_qqwSs0U',  // link url, yt video url
        time: {
            hour: 0,
            minute: 0,
            second: 20
        }
    });

    Content.insert({
        episode: 1,
        type: 'image',  // text, link, tweet, yt, image
        link: '/public/images/dm.jng',  // link url, yt video url
        time: {
            hour: 0,
            minute: 0,
            second: 25
        }
    });
}