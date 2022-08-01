const mongoose = require('mongoose');

const schema = new mongoose.Schema({
        name: 'string',
        comments: {
            type: [{body: String}]
        }
    }, {
        version: false,
    }
);

const Thing = mongoose.model('Thing', schema);

process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test';

module.exports = {
    connect: () => {
        mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}).then(() => {
            console.log('MongoDB connection established');
        });
    },
    versionError: async function () {

        let doc = await Thing.create({name: 'test', comments: [
                {body: 'test1'},
                {body: 'test2'},
                {body: 'test3'},
            ]});

        const doc1 = await Thing.findOne({_id: doc._id});
        const doc2 = await Thing.findOne({_id: doc._id});

// Delete first 3 comments from `doc1`
        doc1.comments.splice(0, 1);
        await doc1.save();

// The below `save()` will throw a VersionError, because you're trying to
// modify the comment at index 1, and the above `splice()` removed that
// comment.
        doc2.set('comments.1.body', 'new comment');
        await doc2.save();
    }
}
