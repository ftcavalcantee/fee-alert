async function buscarTaxa(){
    const response = await fetch('https://mempool.space/api/v1/fees/recommended');
    const dados =  await response.json();
    return dados;
}


module.exports = { buscarTaxa};