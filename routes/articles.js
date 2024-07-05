const express = require('express')
const router = express.Router()
const Article = require('./../models/article')
const User = require('./../models/users')

let tags = ['News', 'Entertainment', 'Sports', 'Health']

//middleware 
//create new article
router.get('/new', async (req, res) => {
    const user = req.session.user || null
    res.render('articles/new', { article: new Article(), tags: {tags}, data:{user}})
})

//save new article
router.post('/',  async (req, res) => {
    const user = req.session.user || null
    const author = await User.findById(user._id)
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        detail: req.body.detail,
        tags: req.body.tags,
        author: author._id
    })
    //if successful 
    try {
        article = await article.save()
        res.redirect(`/articles/${article.id}`)
    } catch (e) {
        console.log(e)
        // if unsuccessful, return 
        res.render('articles/new', { article: article })
    }

})

//view article
router.get('/:id', async (req, res) => {
    const user = req.session.user || null
    const article = await Article.findById(req.params.id).populate('author')
    if (article == null) {
        res.redirect('/')
    }
    res.render('articles/show', { article: article , data:{user}})
})


//edit article
router.get('/edit/:id',  async (req, res) => {
    const user = req.session.user || null
    const article = await Article.findById(req.params.id)
    if (article == null) {
        res.redirect('/')
    }
    res.render('articles/edit', { article: article, tags: {tags}, data:{user}})
})

//save edit
router.post('/edit/:id',  async (req, res) => {
    const {id} = req.params
    try {
        let article = await Article.findByIdAndUpdate(id, req.body)
        article = await article.save()
        res.redirect(`/articles/${article.id}`)
    } catch (error) {
        console.log(error)
    }
})

//delete article
router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect("/")
})

module.exports = router