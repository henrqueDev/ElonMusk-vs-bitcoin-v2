const Twitter = require('twit');
const fs = require('fs');
const path = require('path');
require('dotenv').config()

const moeda = require('./api/fetchData.js');
const {imagens_win, imagens_lose} = require('./api/imagens.js');
const AVLTree = require('avl');
const tree_win = new AVLTree();
const tree_lose = new AVLTree();

counter = 0;
for(image of imagens_win){
  tree_win.insert(counter,image);
  counter+=1;
}
counter = 0;
for(image of imagens_lose){
  tree_lose.insert(counter,image);
  counter+=1;
}


console.log(imagens_win);


const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY ,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60*1000
});



const doge_url = 'https://economia.awesomeapi.com.br/last/DOGE-USD';
const bitcoin_url = 'https://economia.awesomeapi.com.br/last/BTC-USD';

const random_image = ( arvore ) => {
  const key = Math.floor(Math.random() * arvore._size);
  item = arvore.find(key);
  return item.data;

}

const posta_tweet = (bitcoin,dogecoin,imagem_escolhida) => {

  var msg_loser = `Elon Musk perdeu 😭\n Valor do DogeCoin: $${dogecoin.bid} (${dogecoin.pctChange}%)\n Valor do BitCoin: $${bitcoin.bid}(${bitcoin.pctChange}%)`
  var msg_winner = `Elon Musk ganhou 😎😎 \n Valor do DogeCoin: $${dogecoin.bid} (${dogecoin.pctChange}%)\n Valor do BitCoin: $${bitcoin.bid}(${bitcoin.pctChange}%)`

  var resultado_luta = parseFloat(bitcoin.pctChange) > parseFloat(dogecoin.pctChange) ? msg_loser : msg_winner;
  imagem_escolhida.texto = resultado_luta;

  var imagem = path.join(__dirname,`/imagens/`+ imagem_escolhida.file);
  var b64content = fs.readFileSync(imagem, {encoding: 'base64'});

  console.log('\n Executando...\n');

  client.post('media/upload', {media_data: b64content}, (err, data, response) => {

    if(err){
      console.log("DEU RUIM!!  ERRO -> " + err);
      return -1;
    }

    client.post('statuses/update',{status:imagem_escolhida.texto,media_ids: new Array(data.media_id_string)},(err,data,response) => {
      if(err){
        console.log("DEU RUIM!!  ERRO -> " + err);
        return -1;
      }
      console.log('Imagem postada!!!');
    })

    console.log('Tweet postado com sucesso!!\n\n');

})
}



const executaBot = async(client) => {

  var dogecoin =  await moeda(doge_url).then(resultado => resultado.json());
  var bitcoin  =  await moeda(bitcoin_url).then(resulta => resulta.json());
  get_dogecoin = dogecoin.DOGEUSD;
  get_bitcoin = bitcoin.BTCUSD;
  console.log(get_bitcoin);
  let imagem_escolhida = parseFloat(get_dogecoin.pctChange) < parseFloat(get_bitcoin.pctChange) ? random_image(tree_lose) : random_image(tree_win);
  posta_tweet(get_bitcoin,get_dogecoin,imagem_escolhida);


}

module.exports = executaBot;
