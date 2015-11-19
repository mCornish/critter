// Local (client-only) collection
Notes = new Mongo.Collection(null);

notify = function(message) {
    Notes.insert({message: message});
};