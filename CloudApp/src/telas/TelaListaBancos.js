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

type Props = {};
export default class TelaListaBancos extends Component<Props> {


    constructor(props) {
        super(props);
        //linha original::::::
        const params = this.props.navigation.state.params;
        //linha para teste::::
        //const params = {user: {usuario: 'teste',nome: 'Thiago C L da Silva',  id: 83, email: 'a@a.com', avatar: '83_avatar.jpg'}};

        this.state = {
            user: params.user,
            listaBancos: [] ,

        };

        this.consultaBancos();
    }

    render() {
        return (
            <View style={styles2.precontainer}>
                <View style={styles2.container}>
                    <ScrollView
                    >
                        <List>
                            {this.state.listaBancos.map((contaBanco) => (
                                <ListItem
                                    key={contaBanco.id_pagarme}
                                    roundAvatar
                                    // avatar={{ uri: cartao.picture.thumbnail }}
                                    avatar={{ uri: "https://cdn6.aptoide.com/imgs/5/6/7/567a06c01001b3ae995645ad0f14f3e3_icon.png?w=256" }}

                                    title={`${"AG: " + contaBanco.agencia + ((this.state.user.id_pagarme_contaBank_padrao === contaBanco.id_pagarme) ? " #Recebedor padrão " : "") }`}
                                    subtitle={
                                        "Conta: " +
                                        contaBanco.conta
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

    consultaBancos() {
        const nav = this.props.navigation.navigate;
        fetch(consts.rest_url + "/select/bancos/" + this.state.user.id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify(this.state),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(":::: resposta consultaBancos() ::::");
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
                    this.setState({listaBancos: responseJson});

                    //Alert.alert(JSON.stringify(responseJson));

                    // nav('Profile', {user: this.state.user});

                    console.log(this.state.listaBancos);

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
