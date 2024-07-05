const express = require('express')
const app = express()
const mongoose = require('mongoose')
const articleRouter = require('./routes/articles')
const Article = require('./models/article')
const methodOverride = require('method-override')
const User = require('./models/users')
const bcrypt = require('bcrypt')
const { session, cookieParser } = require('./session')

mongoose.connect('mongodb://0.0.0.0:27017')
    .then(console.log("Connected to Mongoose"))
    .catch(e => console.error(e))

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(cookieParser())
app.use(session)

app.get('/login', async (req, res) => {
    res.render('authenticate/login')
})

app.get('/register', async (req, res) => {
    res.render('authenticate/register')
})

app.post('/login', async (req, res) => {
    try {
        const auth = await User.findOne({ username: req.body.username })
        let message = ''
        if (!auth) {
            message += 'Username does not exist !'
            console.log(message)
            res.render('authenticate/login', { message1: { message } })
        }
        const passwordCheck = await bcrypt.compare(req.body.password, auth.password)
        if (!passwordCheck) {
            message += 'Incorrect password !'
            console.log(message)
            res.render('authenticate/login', { message2: { message } })
        } else {
            req.session.user = auth
            res.redirect('/')
        }
    } catch (error) {
        console.error(error)
    }
})

app.post('/register', async (req, res) => {
    let user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    let message = ''
    const existingName = await User.findOne({ username: user.username })
    const existingEmail = await User.findOne({ email: user.email })
    if (existingName || existingEmail) {
        message += "Username or email already taken"
        res.render('authenticate/register', { message: { message } })
    } else {
        try {
            //hash password 
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(user.password, saltRounds)
            user.password = hashedPassword;
            //
            user = await user.save()
            console.log("User registered successfully")
            res.redirect('/login')
        } catch (error) {
            console.error(error)
            console.log('An error occured')
            res.render('authenticate/register')
        }
    }
})

app.get('/', async (req, res) => {
    //req.session.users
    const user = req.session.user || null
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles: articles, data: {user} })
})

app.get('/logout', (req, res) => {
    req.session.destroy(); // Destroy session
    res.redirect('/'); // Redirect to homepage
});

app.get('/search', async (req, res) => {
    const user = req.session.user || null
    const keyword = req.query.search
    const regex = new RegExp(keyword, "i")
    await Article.find({
        $or: [
            { title: { $regex: regex } },
            { description: { $regex: regex } },
            { detail: { $regex: regex } },
        ]
    })
        .then(articles => {
            res.render('articles/index', { articles: articles, data: { keyword, user } })
        })
        .catch((e) => console.error(e))
})
//view by tags ()
app.get('/:tags(news|entertainment|sports|health)', async (req, res) => {
    const user = req.session.user || null
    const tags = req.params.tags
    let query = {};
    if (tags) {
        query = { tags: { $regex: new RegExp(tags, 'i') } };
    }
    try {
        const articles = await Article.find(query).sort({ createdAt: 'desc' })
        res.render('articles/index', { articles: articles, data: { tags, user } })
    } catch (err) {
        console.err(err)
    }
})
//view users' articles
app.get('/user', async (req, res) => {
    const user = req.session.user || null
    const userArticles = await Article.find({author: user}).sort({ createdAt: 'desc' })
    res.render('articles/profile', {articles: userArticles, data: {user}})
})

app.use('/articles', articleRouter)

app.listen(5000)