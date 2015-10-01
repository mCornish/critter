Notifications = new Mongo.Collection('notifications');

Notifications.allow({
    update: function(userId, doc, fieldNames) {
        return ownsDocument(userId, doc) && fieldNames.length === 1 && fieldNames[0] === 'read';
    }
});

// Figure out who should be notified and insert a new notification
createCommentNotification = function(comment) {
    var gift = Gifts.findOne(comment.giftId);
    if (comment.userId !== gift.userId) {
        Notifications.insert({
            userId: gift.userId,
            giftId: gift._id,
            commentId: comment._id,
            commenterName: comment.author,
            read: false
        })
    }
}