const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    articles: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }
})

module.exports = mongoose.model("User", userSchema)