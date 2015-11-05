if (Stream.find().count() === 0) {

    // I will need to contact G&S if I want direct access to stream info: https://discuss.dev.twitch.tv/t/how-do-i-get-a-list-of-current-subscribers-to-a-channel/1063
    Stream.insert({
        subCount: 8470,
        subGoal: 8500,
        subWinner: '',
        duration: 0,
        live: false,
        timing: false
    });

}