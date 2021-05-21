
export default function getPreco(preco, quant = 1) {
    function R$(valor) {
        valor = isNaN(valor) ? 0 : Math.round(valor * 100) / 100;
        return (valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    }
    quant = parseInt(quant);
    return ( quant === 1 ? R$(preco) : R$(preco) + ' x ' + quant + ' = ' + R$(preco * quant));
}