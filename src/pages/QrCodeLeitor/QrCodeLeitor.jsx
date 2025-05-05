import React, { useState, useEffect } from 'react';
import BarcodeReader from 'react-barcode-reader';
import styled from 'styled-components';
import { shade } from 'polished';
import api from "../../services/api";
import {useParams} from "react-router-dom";

const Button = styled.button`
    background: #ff9000;
    height: 56px;
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    color: #312e38;
    width: 100%;
    font-weight: 500;
    margin-top: 16px;
    transition: background-color 0.2s;
    font-weight: bold;

    &:hover {
        background: ${shade(0.2, '#ff9000')};
    }
`;

const Input = styled.input`
    height: 56px;
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    width: 100%;
    font-weight: 500;
`;

export const QrCodeLeitor = (props) => {
    let { id } = useParams();
    const [temCamera, setTemCamera] = useState(null); // Mudei para null inicialmente
    const [mensagem, setMensagem] = useState('');
    const [codigo, setCodigo] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 600);
        };

        checkMobile(); // executa ao montar
        window.addEventListener('resize', checkMobile); // escuta resize

        return () => window.removeEventListener('resize', checkMobile); // cleanup
    }, []);

    const handleScan = (codigoLido) => {
        console.log('Código de barras lido:', codigoLido);
        setCodigo(codigoLido);
        buscarQrCode(codigoLido);
    };

    const handleError = (err) => {
        console.error('Erro ao ler código de barras:', err);
        setMensagem('Erro ao tentar ler o código de barras.');
        setTemCamera(false); // Se houver erro, desativa a câmera
    };

    // Função para garantir que o navegador tenha permissão de usar a câmera
    const verificarPermissoes = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            // Se a permissão for concedida, continuamos
            setTemCamera(true);
            stream.getTracks().forEach(track => track.stop()); // Para o stream após a verificação
        } catch (error) {
            console.error('Permissão de câmera não concedida', error);
            setTemCamera(false);
            setMensagem('Não foi possível acessar a câmera. Verifique permissões.');
        }
    };

    useEffect(() => {
        // Verifica permissões ao montar o componente
        verificarPermissoes();
    }, []);

    const buscarQrCode = async (qrCode) => {
        if (qrCode?.length > 0) {
            const res = await api.get(`/api/code-bar/${id}/${qrCode}`);
            const data = res.data[0][0]
            props.onLeitura({
                "id": data.NumApto,
                "NrReserva": data.NrReserva,
                "NrHospede": data.NrHospede,
                "SitAtual": "O",
                "SitFutura": "O",
                "Notificacao": null,
                "NomeHospede": data.NomeHospede
            })
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                flexDirection: 'column',
                marginTop: isMobile ? '20%' : '1%',
                marginBottom: '20px',
            }}
        >
            <h3>Escaneie um código de barras:</h3>
            {temCamera === null && <p>Verificando câmeras...</p>}
            {temCamera === false && <p style={{ color: 'red' }}>{mensagem}</p>}
            {temCamera && (
                <div style={{ width: '300px', height: '300px', marginBottom: '10px' }}>
                    {/* Ajuste do BarcodeReader */}
                    <BarcodeReader
                        onScan={handleScan}
                        onError={handleError}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            )}
            <p>Ou digite o código manualmente:</p>
            <Input
                style={{ marginTop: '10px', padding: '5px' }}
                value={codigo}
                onChange={(event) => setCodigo(event.target.value)}
                placeholder="Código de barras"
            />
            <Button onClick={() => buscarQrCode(codigo)}>Enviar código</Button>
        </div>
    );
};