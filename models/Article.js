const mongoose = require('mongoose');
const Schema = mongoose.Schema

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    contentText : {
        type: String 
    },

    status: {
        type: String,
        enum: ['Published', 'Pending'],
        default: 'Published'
    },

    publishedDate: {
        type: Date,
        default: Date.now,
    },

    category: {
        type: String,
        enum: ["finance", "sport", "health", "technology", "education", "Agriculture"] 
    },

    /*This keyword fields allows author to include keywords that are related to the artcle, which can be searchable
    by User */
    keywords: {
        type: [String],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

//All document created from this DB Schema will have access to this db method
const Article = mongoose.model('article', articleSchema);
module.exports = Article