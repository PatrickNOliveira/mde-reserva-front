import { dateFormat1 } from '../utils/utils-context'
export default function ListaNotificacoes({pesquisa, items}) {
    if (!items || items.length === 0) return 'Sem notificações!';
    
    const busca = items.filter((i) => {
        
        function naSuite(i) {
            if (pesquisa.trim().length === 0) return true;
            return i.suite === pesquisa;
        }

        function naNotificacao(i) {
            function contain(a, b) { return a.toUpperCase().includes(b.toUpperCase())}
            if (pesquisa.trim().length === 0) return true;
            return contain(i.notificacao, pesquisa); // || contain(i.codigo, pesquisa);
        }

        return naSuite(i) || naNotificacao(i);

    });

    return busca.map(item => 
        <div type="button" 
            key={item.id} 
            className="notifications">
            <div>        
                <p style={{fontSize:14}}>Suíte {item.suite}</p>
                <p style={{color: '#3fe799', fontSize:14}}>{item.notificacao}</p>
                <p style={{fontSize:12}}>{dateFormat1(item.data)}</p>
            </div>
            <div></div>            
        </div>
    );
}