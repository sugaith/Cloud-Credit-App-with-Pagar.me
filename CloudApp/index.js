import './shim.js'

import { AppRegistry } from 'react-native';
// import App from './App';
import TelaLogin from './src/telas/TelaLogin';
import App from './src/App'

AppRegistry.registerComponent('CloudApp', () => App);
import crypto from 'crypto'
// use crypto
console.log(crypto.randomBytes(32).toString('hex'));