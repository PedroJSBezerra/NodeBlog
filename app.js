// Carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Postagem')
const Postagem = mongoose.model('postagens')
require('./models/Categoria')
const Categoria = mongoose.model('categorias')

const app = express()
const port = 8081
const admin = require('./routes/admin')
const path= require('path')


//configurações
  //sessão
  app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
  }))
  app.use(flash())
  //middleware
  app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
  })
  //body-parser
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())
  //handlebars
  app.engine('handlebars', handlebars({defaultLayout: 'main'}))
  app.set('view engine', 'handlebars')
  //mongoose
  mongoose.Promise = global.Promise
  mongoose.connect('mongodb://127.0.0.1/blogapp').then(()=>{
    console.log("Conectado ao mongo.")
  }).catch((err)=>{
    console.log(err)
  })
  //public
  app.use(express.static(path.join(__dirname, 'public')))
//rotas
  app.get('/', (req,res)=>{
    Postagem
    .find()
    .lean()
    .populate('categoria')
    .sort({data: "desc"})
    .then((postagens)=>{
      res.render('index', {postagens: postagens})
    })
    .catch((err)=>{
      req.flash('error_msg', "Houve um erro interno.")
      res.redirect('/404')
    })
    
  })

  app.get('/postagem/:slug', (req,res)=>{
    Postagem.findOne({slug: req.params.slug})
    .lean()
    .then((postagem)=>{
      if(postagem){
        res.render('postagem/index', {postagem: postagem})
      }else{
        req.flash('error_msg', 'Esta postagem não existe')
        res.redirect('/')
      }
    })
    .catch((err)=>{
      req.flash('error_msg', 'Houve um erro interno.')
      res.redirect('/')
    })
  })

  app.get('/categorias', (req,res)=>{
    Categoria.find()
    .lean()
    .then((categorias)=>{
      res.render('categorias/index', {categorias: categorias})
    })
    .catch((err)=>{
      req.flash('error_msg', 'Ouve um erro interno ao listar categorias')
      res.redirect('/')
    })
  })

  app.get('/categorias/:slug', (req,res)=>{
    Categoria.findOne({slug: req.params.slug})
    .lean()
    .then((categoria)=>{
      if(categoria){
        Postagem.find({categoria: categoria._id})
        .lean()
        .then((postagens)=>{
          res.render('categorias/postagens', {postagens: postagens, categoria: categoria})
        }).catch((err)=>{
          req.flash('error_msg', 'Houve um erro ao listar os posts.')
          res.redirect('/')
        })
      }else{
        req.flash('error_msg', 'esta categoria não existe.')
        res.redirect('/')
      }
    })
    .catch((err)=>{
      req.flash('error_msg', 'Ouve um erro interno ao carregar a pagina desta categoria.')
      res.redirect('/')
    })
  })

  app.get('/404', (req,res)=>{
    res.send('Erro 404!')
  })

  app.use('/admin', admin)
//outros
app.listen(port, ()=> console.log("Server runing on port: "+port))