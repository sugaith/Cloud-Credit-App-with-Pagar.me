import React, { Component } from 'react';
import {
    ScrollView, WebView,
    StyleSheet, View,
} from 'react-native';
import { Tile, List, ListItem, Button } from 'react-native-elements';
import {styles} from '../styles/styles'
import colors from '../styles/colors'
import metrics from '../styles/metrics'
import fonts from '../styles/fonts'

//import pagarme from 'pagarme'
const pagarme = require('pagarme');


const GLOBAL = require('../config/GLOBALS');

export default class TelaProfile extends Component<Props>  {
    constructor(props) {
        super(props);
        //linha original::::::
        const params = this.props.navigation.state.params;
        //linha para teste::::
        // const params = {user: {usuario: 'teste',nome: 'Thiago C L da Silva',  id: 83, email: 'a@a.com', avatar: '83_avatar.jpg'}};

        this.state = {
            user: params.user,
            showWebView: false,
        };
    }

    render() {
        return (
            <View style={styles2.precontainer}>
                { this.state.showWebView && this.renderContent() }
                <ScrollView>
                    <Tile
                        // titleStyle={styles2.tile}
                        height={180}
                        imageSrc={{ uri: `${GLOBAL.BASE_IMG_URL + this.state.user.avatar}` }}
                        featured
                        title={`${this.state.user.nome.toUpperCase()}`}
                        caption={this.state.user.email}
                    />

                    <Button
                        title="Minha Conta"
                        buttonStyle={{ marginTop: 20 }}
                        onPress={this.handleSettingsPress}
                    />

                    <List>
                        <ListItem
                            title="Histórico de Transações"
                            onPress={() => {this.props.navigation.navigate('ListaTransacoes',{user: this.state.user})}}
                            // rightTitle={this.props.email}
                            // hideChevron
                        />
                        <ListItem
                            title="Cartões Vinculados"
                            onPress={() => {this.props.navigation.navigate('ListaCartoes',{user: this.state.user})}}
                            // rightTitle={this.props.phone}
                            // hideChevron
                        />
                        <ListItem
                            title="Contas Bancárias"
                            onPress={() => {this.props.navigation.navigate('ListaBancos',{user: this.state.user})}}

                            // rightTitle={this.props.phone}
                            // hideChevron
                        />
                    </List>

                    <List>
                        <ListItem
                            title="Fazer Simulação"
                            onPress={() => this.abreSimulacao()}
                            // rightTitle={this.props.login.username}
                            // hideChevron
                        />
                    </List>

                </ScrollView>
            </View>

        );
    }

    renderContent() {
        let html = `
            <div id="myContent">
                This is my name
            </div>
        `;
            let jsCode = `
            document.querySelector('#myContent').style.backgroundColor = 'red';
        `;

        return (
            <WebView
                style={styles.webView}
                ref="myWebView"
                html={html}
                injectedJavaScript={jsCode}
                javaScriptEnabledAndroid={true}
            >
            </WebView>
        );
    }

    abreSimulacao() {
        this.props.navigation.navigate('Simulacao',  {user: this.state.user} );
    }

    abreModal = () => {


        // INICIAR A INSTÂNCIA DO CHECKOUT
        // declarando um callback de sucesso
        const checkout = new pagarme.PagarMeCheckout.Checkout({"encryption_key":"ENCRYPTION KEY", success: function(data) {
            console.log(data);
            //Tratar aqui as ações de callback do checkout, como exibição de mensagem ou envio de token para captura da transação
        }});

        // DEFINIR AS OPÇÕES
        // e abrir o modal
        // É necessário passar os valores boolean em "var params" como string
        let params = {"customerData":"false", "amount":"100000", "createToken": "true", "interestRate": 10 };
        checkout.open(params);

    };
}

const styles2 = StyleSheet.create({
    precontainer: {
        backgroundColor: colors.grafit,
        flex:1,
        // alignItems: 'center',

        // alignItems: 'flex-end',
        //  justifyContent: 'center',
    },
    tile :{
        height: 50,
    },
    webView: {
        backgroundColor: '#fff',
        height: 350,
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});



