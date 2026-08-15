function calcularMedia(registros) {
    if (registros.length === 0) return null;
    const soma = registros.reduce((total, r) => total + r.hourFee, 0);
    return soma / registros.length;
  }
  
  module.exports = { calcularMedia };