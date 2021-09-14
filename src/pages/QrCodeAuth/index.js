import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-reader';
import { useHistory, useParams, useLocation } from "react-router-dom";
import { setConta, setLogin, getLogin, setColab } from '../../utils/utils-context';

import api from "../../services/api";

import '../../styles/qrCode.css';

//import hotellogo from '../../assets/hotellogo.png';

function QrCodeAuth() {

	const { id } = useParams();
	
	const history = useHistory();
	const location = useLocation();
	
	setColab(location.pathname.indexOf('/login') !== -1);

	const [result, setResult] = useState("Aponte a câmera do seu celular para o QR CODE");

	const [login] = useState(getLogin());

	const handleScan = code => {
		if (code) {
			api.get(`/api/order/info/${code}`).then(response => {
				console.log('Conta:', response.data);
				setConta(response.data);
				setLogin(null);
				history.push({ pathname: `/home/${code}` });
			});
		}
	}

	const handleError = err => {
		console.log("ERROR:", err);
	}

	useEffect(() => {

		console.log('QrCodeAuth.login:', login, id);

		if (login == null || login.uuid !== id) {

			api.get(`/api/order/info/${id}`).then(response => {
				console.log('Conta:', response.data);
				setConta(response.data);
				setLogin(null);
				history.push({ pathname: `/home/${id}/${Date.now()}` });
			});		
	
		} else {

			history.push({ pathname: `/menu/${id}/${Date.now()}` });

		}

	},[]);

	//handleScan('e7886e3d-c81c-4829-8a57-7768d8148754'); // WinResta
	//handleScan('d88b870b-5ac4-4836-9c31-47d91f94e648'); // WinLetoh
	//return('d88b870b-5ac4-4836-9c31-47d91f94e650'); // WinLetom
	return ('');

	return (
		<div id="qrCode">
			<p style={{ fontSize: 28, paddingTop: '30px' }}>Seja bem-vindo(a)</p>
			<div className="qrContent">
				<QrReader
					delay={300}
					onError={handleError}
					onScan={handleScan}
					style={{ width: '80%', paddingTop: '20px', maxWidth: '300px' }}
				/>
				
				<p style={{ 
					borderRadius:'15px', 
					position: 'static', 
					background: '#3E3B47', 
					margin:'10%', 
					padding: '10%', 
					color: '#F4EDE8', 
					display: 'flex', 
					alignItems: 'center', 
					justifyContent: "center" }}>
						{result}
				</p>

			</div>
		</div>
	);
}

export default QrCodeAuth;

/*
	<div className="hotelContent">
		<img src={hotellogo} alt="Hotel" />
		<p style={{ color: '#F4EDE8', fontSize: '20px', fontSize: '5vw' }}>Hotel Fradíssimo</p>
	</div>
*/
