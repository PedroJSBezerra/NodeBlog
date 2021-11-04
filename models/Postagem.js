const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Postagem = new Schema({
  titulo:{
    type: String,
    requied: true
  },
  slug:{
    type: String,
    required: true
  },
  descricao: {
    type: String,
    requirde: true
  },
  conteudo:{
    type: String,
    required: true
  },
  categoria:{
    type: Schema.Types.ObjectId,
    ref: 'categorias',
    required: true
  },
  data: {
    type: Date,
    default: Date.now()
  }
})

mongoose.model('postagens', Postagem)