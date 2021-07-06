const fetch = require('node-fetch');


const moeda = (url)=> {
  const fat =  fetch(`${url}`).then(result => result);
  return fat;
}

module.exports = moeda;
