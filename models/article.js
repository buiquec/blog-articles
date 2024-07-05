const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    detail: {
        type: String,
    },
    tags: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }, 
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})
module.exports = mongoose.model("Article", articleSchema)