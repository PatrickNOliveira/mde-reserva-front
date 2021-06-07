export function getLogin() {
    var login = JSON.parse(localStorage.getItem('login'));
    if (login == null) return null;
    return login.uuid ? login : null;
}

export function setLogin(login) {
    localStorage.setItem('login', JSON.stringify(login));
}

export function setColab(colab) {
    localStorage.setItem('colab', (colab ? 'S' : 'N'));
}

export function getColab() {
    return localStorage.getItem('colab') === 'S';
}

export function getConta() {
    var conta = JSON.parse(localStorage.getItem('conta'));
    if (conta == null) return null;
    return conta.sistema ? conta : null;
}

export function setConta(conta) {
    localStorage.setItem('conta', JSON.stringify(conta));
}

export function setCardapioAtual(cardapio) {
    cardapio = cardapio ? cardapio : {id: 0}
    localStorage.setItem('Cardapio', JSON.stringify(cardapio));
}

export function getCardapioAtual() {
    const cardapioAtual = {id: 0}
    try {
        var cardapio = localStorage.getItem('Cardapio');
        cardapio = cardapio == null ? cardapioAtual : JSON.parse(cardapio);
        return cardapio;
    } catch (error) {
        return cardapioAtual
    }
}

export function getMesaAtual() {
    const mesa = localStorage.getItem('mesa');
    return  mesa === null ? '' : mesa;
}

export function setMesaAtual(mesa) {
    localStorage.setItem('mesa', mesa === null ? '' : mesa);
}

export function getSuiteAtual() {
    const suite = localStorage.getItem('suite');
    return  suite === null ? '' : suite;
}

export function setSuiteAtual(suite) {
    localStorage.setItem('suite', suite === null ? '' : suite);
}

export function contaEncerrada(login) {
    const data = login.checkout.substr(0, 10);
    const hora = login.checkout.substr(11);
    
    const parts = data.split('/');
    const _data = parts[2] + '-' + parts[1] + '-' + parts[0] + ' ' + hora;
    return ( (new Date()) >= (new Date(_data)))
}

export function getHost() {
    //return 'http://localhost:8000';
    return 'http://api.mde.com.br:8080';
}
