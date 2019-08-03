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
export default class TelaListaCartoes extends Component<Props> {


    constructor(props) {
        super(props);
        //linha original::::::
        const params = this.props.navigation.state.params;
        //linha para teste::::
        //const params = {user: {usuario: 'teste',nome: 'Thiago C L da Silva',  id: 83, email: 'a@a.com', avatar: '83_avatar.jpg'}};

        this.state = {
            user: params.user,
            listaCartoes: [] ,

        };

        this.consultaCartoes();
    }

    render() {
        return (
            <View style={styles2.precontainer}>
                <View style={styles2.container}>
                    <ScrollView
                    >
                        <List>
                            {this.state.listaCartoes.map((cartao) => (
                                <ListItem
                                    key={cartao.numero.replace(" ","")}
                                    roundAvatar
                                    // avatar={{ uri: cartao.picture.thumbnail }}
                                    avatar={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlzexEwWAPX9n59bfH9VHwlTUqEBFPWaBbDIppDYWLNkaBVJFe" }}

                                    title={`${cartao.vencimento}`}
                                    subtitle={
                                        "Final " +
                                        cartao.numero.replace(" ","")
                                            .substr(cartao.numero.replace(" ","").length-4,
                                                    cartao.numero.replace(" ","").length)
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

    consultaCartoes() {
        const nav = this.props.navigation.navigate;
        fetch(consts.rest_url + "/select/cartoes/" + this.state.user.id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify(this.state),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(":::: resposta consultaCartoes() ::::");
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
                    this.setState({listaCartoes: responseJson});

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
