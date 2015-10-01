//check that the specified userId own the documents
ownsDocument = function(userId, doc) {
    return doc && doc.userId === userId;
};