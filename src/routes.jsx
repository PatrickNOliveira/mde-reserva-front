import React from 'react';
import {
	BrowserRouter,
	Switch,
	Route,
} from "react-router-dom";

//import Home from './pages/Home';
import QrCodeAuth from './pages/QrCodeAuth';
import Home       from './pages/Home';
//import Product from './pages/Product/Product';

import Cardapio from './components/Cardapio';
import Apartamentos from './components/Apartamentos';
import AdicionaItem from './components/AdicionaItem';
import Pedidos from './components/Pedidos';
import Informacoes from './components/Informacoes';
import Servicos from './components/Servicos';
import Notificacoes from './components/Notificacoes';
import Menu from './components/Menu';
import Entrar from './components/Entrar';
import {QrCodeLeitor} from "./pages/QrCodeLeitor/QrCodeLeitor";

function Routes() {

	return (
		<BrowserRouter>
			<Switch>

				<Route path="/login/:id">
					<QrCodeAuth />
				</Route>

				<Route exact path="/home/:id">
					<Home />
				</Route>

				<Route exact path="/home/:id/:rnd">
					<Home />
				</Route>

				<Route path="/menu/:id">
					<Menu />
				</Route>

				<Route exact path="/entrar/:id">
					<Entrar />
				</Route>

				<Route exact path="/entrar/:id/:rnd">
					<Entrar />
				</Route>

				<Route path="/cardapio/:id">
					<Cardapio />
				</Route>
				
				<Route path="/apartamentos/:id">
					<Apartamentos />
				</Route>

				<Route path="/adiciona/:id">
					<AdicionaItem />
				</Route>

				<Route path="/pedidos/:id">
					<Pedidos />
				</Route>
				
				<Route path="/informacoes/:id">
					<Informacoes />
				</Route>

				<Route path="/servicos/:id">
					<Servicos />
				</Route>

				<Route path="/notificacoes/:id">
					<Notificacoes />
				</Route>

				<Route exact path="/:id">
					<QrCodeAuth />
				</Route>

				<Route exact path="/:id/:rnd">
					<QrCodeAuth />
				</Route>

				<Route path="/">
					<QrCodeAuth />
				</Route>

			</Switch>
		</BrowserRouter>
	);
}

export default Routes;