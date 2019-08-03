/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Button,
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert, TextInput, TouchableHighlight, Image, ScrollView
} from 'react-native';
import {List, ListItem} from "react-native-elements";

import {styles} from '../styles/styles'
import colors from '../styles/colors'
import metrics from '../styles/metrics'
import fonts from '../styles/fonts'
import consts from '../styles/consts'


const instructions = Platform.select({
    ios: 'ola,\n' +
    'voce esta usando IOS',
    android: 'oi,\n' +
    'voce esta usando ANDROID',
});

const defs = {
    uri_paid: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr-ZGPPy9A4K7rdvB8dRLN4mTUa7wwJ8XWIdud8F_v4PRxH4zR',
    uri_rep: 'data:image/png;base64,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'
};

type Props = {};
export default class TelaListaTransacoes extends Component<Props> {


    constructor(props) {
        super(props);
        //linha original::::::
        const params = this.props.navigation.state.params;
        //linha para teste::::
        //const params = {user: {usuario: 'teste',nome: 'Thiago C L da Silva',  id: 83, email: 'a@a.com', avatar: '83_avatar.jpg'}};

        this.state = {
            user: params.user,
            listaTransacoes: [] ,

        };

        this.consultaTransacoes();
    }

    render() {
        return (
            <View style={styles2.precontainer}>
                <View style={styles2.container}>
                    <ScrollView
                    >
                        <List>
                            {this.state.listaTransacoes.map((cartao) => (
                                <ListItem
                                    key={cartao.id_pagarme}
                                    roundAvatar
                                    // avatar={{ uri: cartao.picture.thumbnail }}
                                    avatar={{ uri: defs.uri_paid }}

                                    title={`${cartao.status.toUpperCase() + ' R$ ' + (cartao.valor/100)}`}
                                    subtitle={
                                        cartao.data_transacao
                                    }
                                    // onPress={() => this.onLearnMore(cartao)}
                                />
                            ))}
                        </List>


                    </ScrollView>
                </View>
            </View>

        );
    }

    consultaTransacoes() {
        const nav = this.props.navigation.navigate;
        fetch(consts.rest_url + "/select/transacoes/" + this.state.user.id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify(this.state),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(":::: resposta /select/transacoes/ ::::");
                console.log(responseJson);
                if (responseJson.error){
                    if (responseJson.error === "error"){
                        console.warn(responseJson.msg);
                    }
                    if (responseJson.error === "warn"){
                        Alert.alert(responseJson.msg);
                    }

                    return responseJson;
                }else{
                    // console.log(responseJson);
                    this.setState({listaTransacoes: responseJson});

                    //Alert.alert(JSON.stringify(responseJson));

                    // nav('Profile', {user: this.state.user});

                    console.log(this.state.listaTransacoes);

                    return responseJson;
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

const styles2 = StyleSheet.create({
    precontainer: {
        backgroundColor: colors.lightgrafit,
        justifyContent: 'center',
        alignItems: 'center',
        flex:1,
    },
    container: {
        flex: 1,
        width: 300,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: colors.grafit,
        // alignSelf: 'center',
    },
});
