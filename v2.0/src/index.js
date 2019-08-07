import React from 'react';
import ReactDOM from 'react-dom';

import './assets/css/style.css';
import App from './App';
import ScrollToTop from './ScrollToTop';
import * as serviceWorker from './serviceWorker';

import store from './redux/store';
import history from './redux/history';
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router/immutable';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import firebase from './config/firebaseConfig'

//react redux firebase configure
const rrfConfig = { userProfile: 'users', firebaseStateName: 'firebase'};
//react redux firebase props
const rrfProps = {
	firebase,
	config: rrfConfig,
	dispatch: store.dispatch
}
ReactDOM.render(
	<Provider store={store}>
		<ReactReduxFirebaseProvider {...rrfProps}>
			<ConnectedRouter history={history}>
				<ScrollToTop>
					<App />
				</ScrollToTop>
			</ConnectedRouter>
		</ReactReduxFirebaseProvider>
	</Provider>,
	document.getElementById('root')
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
