import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { shade } from 'polished';
import api from "../../services/api";
import { useParams } from "react-router-dom";
import { BrowserMultiFormatReader } from '@zxing/browser';

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

const mobile = () => window.innerWidth <= 768;

export const QrCodeLeitor = (props) => {
    const { id } = useParams();
    const [temCamera, setTemCamera] = useState(null);
    const [mensagem, setMensagem] = useState('');
    const [codigo, setCodigo] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();

        const startReader = async () => {
            try {
                const videoElement = videoRef.current;
                if (videoElement) {
                    await codeReader.decodeFromVideoDevice(undefined, videoElement, (result, err) => {
                        if (result) {
                            buscarQrCode(result.getText())
                        }
                    });
                }
            } catch (error) {
                console.error('Erro ao iniciar leitura de código de barras', error);
            }
        };

        if (temCamera) {
            startReader();
        }

        return () => {
            if (videoRef.current) {
                const stream = videoRef.current.srcObject;
                if (stream) {
                    const tracks = stream.getTracks();
                    tracks.forEach(track => track.stop());
                }
            }
        };
    }, [temCamera]);

    const verificarPermissoes = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const temCameraDisponivel = devices.some(device => device.kind === 'videoinput');
            if (!temCameraDisponivel) {
                setTemCamera(false);
                setMensagem('Nenhuma câmera foi encontrada neste dispositivo.');
                return;
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: 'environment' } }
            });
            setTemCamera(true);
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            console.error('Erro ao tentar acessar a câmera:', error);
            setTemCamera(false);
            setMensagem('Não foi possível acessar a câmera. Verifique as permissões no navegador.');
        }
    };

    const buscarQrCode = async (qrCode) => {
        if (qrCode?.length > 0) {
            const res = await api.get(`/api/code-bar/${id}/${qrCode}`);
            if (res.data?.[0]?.[0]) {
                const data = res.data?.[0]?.[0]
                props.onLeitura({
                    "id": data.NumApto,
                    "NrReserva": data.NrReserva,
                    "NrHospede": data.NrHospede,
                    "SitAtual": "O",
                    "SitFutura": "O",
                    "Notificacao": null,
                    "NomeHospede": data.NomeHospede
                })
            } else {
                alert("Código não encontrado")
            }
        }
    }

    useEffect(() => {
        verificarPermissoes();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(mobile());
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);


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
                <div style={{ width: '300px', height: '300px', marginBottom: isMobile ? '100px' : '10px' }}>
                    <video ref={videoRef} style={{ width: '100%' }} />
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