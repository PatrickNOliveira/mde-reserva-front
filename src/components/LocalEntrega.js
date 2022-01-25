import React, { useState } from 'react';

export default function LocalEntrega({cardapio, locais, obsMensagemLocal, onLocalizacao, onObservacao}) {
    //if (locais.length < 2) return '';
    if (cardapio.localizacao === '0') return '';

    return (

        <div className="box_localizacao">
            <span>Sua Localização</span>
            <select onChange={(event) => {onLocalizacao(event.target.value)}}> 
                {
                    locais.map(local =>
                        <option  
                            key={local.codigo} 
                            value={local.codigo}>{local.descricao}
                        </option>
                    )
                }
            </select>
            <textarea 
                type="text" 
                placeholder={obsMensagemLocal}
                onChange={(event) => {onObservacao(event.target.value)}} />
        </div>
    )
}