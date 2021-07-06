const Twitter = require('twit');
const fs = require('fs');
const path = require('path');
require('dotenv').config()
//const fetch = require('node-fetch');
const moeda = require('./api/fetchData.js');
const {imagens_win, imagens_lose} = require('./api/imagens.js');

console.log(imagens_win);


const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY ,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60*1000
});

/*var myHeaders = new Headers();

var myInitRequest = { method: 'GET',
               headers: myHeaders};
*/
/*
const moeda = (url)=> {
  const fat =  fetch(`${url}`).then(result => result);
  return fat;
}*/



const doge_url = 'https://economia.awesomeapi.com.br/last/DOGE-USD';
const bitcoin_url = 'https://economia.awesomeapi.com.br/last/BTC-USD';
//console.log("Ola seja bem vindo ao bot\n");
/*
const imagens_loser = [
  {
    file: 'imagens_loser/imagem2-winner.jpg',
    texto:''
  }

]

const imagens_winner = [
  {
  file: 'imagens_winner/imagem1-winner.jpg',
  texto:''
  }

]
*/


//var imagem=  imagens[1];
const random_image = ( images ) => {
  return images[Math.floor( Math.random() * images.length )];
}

const posta_tweet = (bitcoin,dogecoin,imagem_escolhida) => {

  var msg_loser = `Elon Musk perdeu 😭\n Valor do DogeCoin: $ ${dogecoin.bid}(${dogecoin.pctChange}%)\n Valor do BitCoin: $${bitcoin.bid}(${bitcoin.pctChange}%)`
  var msg_winner = `Elon Musk ganhou 😎😎 \n Valor do DogeCoin: $ ${dogecoin.bid}(${dogecoin.pctChange}%)\n Valor do BitCoin: $${bitcoin.bid}(${bitcoin.pctChange}%)`

  var resultado_luta = parseFloat(bitcoin.pctChange) > parseFloat(dogecoin.pctChange) ? msg_loser : msg_winner;
  imagem_escolhida.texto = resultado_luta;

  var imagem = path.join(__dirname,`/imagens/`+ imagem_escolhida.file);
  var b64content = fs.readFileSync(imagem, {encoding: 'base64'});
  const postTweet = "...";
  console.log('\n Executando...\n')

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
      console.log('Imagem postada!!!')
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
  let imagem_escolhida = parseFloat(get_dogecoin.pctChange) < parseFloat(get_bitcoin.pctChange) ? random_image(imagens_lose) : random_image(imagens_win);
  posta_tweet(get_bitcoin,get_dogecoin,imagem_escolhida)
  /*
  var msg_loser = `Elon Musk perdeu 😭\n Valor do DogeCoin: $ ${dogecoin.DOGEUSD.bid}(${dogecoin.DOGEUSD.pctChange}%)\n Valor do BitCoin: $${bitcoin.BITUSD.bid}(${bitcoin.BITUSD.pctChange}%)`
  var msg_winner = `Elon Musk ganhou 😎😎 \n Valor do DogeCoin: $ ${dogecoin.DOGEUSD.bid}(${dogecoin.DOGEUSD.pctChange}%)\n Valor do BitCoin: $${bitcoin.BITUSD.bid}(${bitcoin.BITUSD.pctChange}%)`

  var resultado_luta = bitcoin.BTCUSD.pctChange > dogecoin.DOGEUSD.pctChange ? msg_loser : msg_winner;
  imagem_escolhida.texto = resultado_luta;

  var imagem = path.join(__dirname,`src/imagens/imagens_winner/`+ imagem_escolhida.file);
  var b64content = fs.readFileSync(imagem, {encoding: 'base64'});
  const postTweet = "...";
  console.log('\n Executando...\n')

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
      console.log('Imagem postada!!!')
    })

    console.log('Tweet postado com sucesso!!\n\n');

})*/

}

module.exports = executaBot;


/*
const a  = async () => {
const dogecoin = await moeda(doge_url).then(resultado => resultado);
const bitcoin  =  await moeda(bitcoin_url).then(resulta => resulta);
const stringe = `${dogecoin.DOGEUSD.bid}\n\n ${bitcoin.BTCUSD.bid} `;
console.log(stringe);
*/
//const var_dog = dogecoin.then(result => {result.json()});
//const bitcoin  =  await moeda(b);
  //return await dogecoin;
//}

//setInterval(a,5000);


/*const oxi = async () => {
  const dogecoin = await moeda(doge_url);
  return await dogecoin;
}
const b = async () => {
  con
}*/


//console.log(dogecoin);


/*
curl "https://api.twitter.com/2/tweets?ids=1261326399320715264,1278347468690915330"
 -H "Authorization: Bearer AAAAAAAAAAAAAAAAAAAAAFnz2wAAAAAAxTmQbp%2BIHDtAhTBbyNJon%2BA72K4%3DeIaigY0QBrv6Rp8KZQQLOTpo9ubw5Jt?WRE8avbi"
*/
