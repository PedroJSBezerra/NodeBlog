// Carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const port = 8081
const admin = require('./routes/admin')
const path= require('path')


//configurações
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
  app.use('/admin', admin)
//outros
app.listen(port, ()=> console.log("Server runing on port: "+port))