import React from 'react';import ReactDOM from 'react-dom/client';import {Provider} from 'react-redux';import {store} from './store/store';import {AuthProvider} from './context/AuthContext';import App from './App';import './styles.css';
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));}
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><Provider store={store}><AuthProvider><App/></AuthProvider></Provider></React.StrictMode>);
