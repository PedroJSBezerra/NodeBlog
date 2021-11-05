if(process.env.NODE_ENV == 'production'){
  module.exports = {mongoURI: "mongodb+srv://PedroJSDev:uhDPm9nB*gczgvU@cluster0.ynuzi.mongodb.net/blogapp-prod?retryWrites=true&w=majority"}
}else{
  module.exports = {mongoURI: 'mongodb://127.0.0.1/blogapp'}
}
