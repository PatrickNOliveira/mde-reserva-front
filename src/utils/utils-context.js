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

export function setApartamentoAtual(ap) {
    ap = ap ? ap : {id: 0}
    localStorage.setItem('Apartamento', JSON.stringify(ap));
}

export function getApartamentoAtual() {
    const ap = localStorage.getItem('Apartamento');
    return ap == null ? {id: 0} : JSON.parse(ap);
}

export function gravaCardapios(cardapios) {
    console.log('gravando cardapios:', cardapios)
    localStorage.setItem('CARDAPIOS', JSON.stringify(cardapios));
}

export function recuperaCardapios() {
    return JSON.parse(localStorage.getItem('CARDAPIOS'));
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
    const suite = getApartamentoAtual().id > 0 ? 
        getApartamentoAtual().id 
        : localStorage.getItem('suite');
    return  suite === null ? '' : suite;
}

export function setId(id) {
    localStorage.setItem('id', id);
}

export function getId() {
    return localStorage.getItem('id');
}

export function setSuiteAtual(suite) {
    localStorage.setItem('suite', suite === null ? '' : suite);
}

export function getGrupoAtual() {
    return localStorage.getItem('grupo');
}

export function setGrupoAtual(grupo) {
    localStorage.setItem('grupo', grupo);
}

export function contaEncerrada(login) {
    console.log('contaEncerrada.login.checkout:', login.checkout);
    if (!login.checkout) return false;
    const conta = getConta();
    if (conta.ativo === 'N') return true;
    const data = login.checkout.substr(0, 10);
    const hora = login.checkout.substr(11);
    const parts = data.split('/');
    const _data = parts[2] + '-' + parts[1] + '-' + parts[0] + ' ' + hora;
    return ( (new Date()) >= (new Date(_data)))
}

export function getHost() {
   return 'http://localhost:8000';
   //return 'https://api.mde.com.br:8080';
}
