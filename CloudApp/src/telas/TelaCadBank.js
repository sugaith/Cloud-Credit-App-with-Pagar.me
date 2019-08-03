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
    Alert, ScrollView, TouchableOpacity, TextInput
} from 'react-native';
import TextInputMask from "react-native-text-input-mask";
import {styles} from '../styles/styles'
import colors from '../styles/colors'
import metrics from '../styles/metrics'
import fonts from '../styles/fonts'
import consts from '../styles/consts'


const instructions = Platform.select({
    ios: 'sadasdasdad to reload,\n' +
    'Cmd+D oasdasdasdasd dev menu',
    android: 'Dsadasdadad,\n' +
    'Shakeaaaahhh mulekeeeeeeee dev menu',
});

type Props = {};
export default  class TelaCadBank extends Component<Props> {
    constructor(props) {
        super(props);
        //linha original::::::
        const params = this.props.navigation.state.params;

        //linha para teste::::
        // const params = {user: {usuario: 'teste', id: 83, email: 'a@a.com'}};

        this.state = {
            user: params.user,
            amount: params.amount,
            isLoading: false ,

            nome: params.user.nome ,

            // nome: "fela da egua" ,
            // datanasci: '18/18/1879',
            // rg: '584654654',
            // cpf: '04809304906',
            // cep: '85867010',
            // complemento: '129',
            // logradouro: 'por do sol',
            // bairro: 'vila b',
            // cidade: 'foz ',
            // uf: 'PR',

            bank_code: '341', //itau
            agencia: '8294',
            agencia_dv: '0',
            conta: "04436",
            conta_dv: "0",
            legal_name: "THIAGO CORREA LIMA DA SILVA",
            cpf: "04809304906",
            type: 'conta_corrente'



        };
    }


    render() {
        return (
            <View style={styles.precontainerGrafit}>
                <ScrollView
                    contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}
                >
                    <View style={styles.containerLight}>
                        {/*{instructions}*/}
                        <Text style={[styles.text1b,{ marginBottom: metrics.padding }]}>
                            {this.state.user.nome}, antes vc deve informar uma conta bancária para depositarmos o crédito
                        </Text>

                        <View style={[styles2.viewForm,{  }]}>
                            <Text style={[styles.text2b,{  }]}>
                                Código do banco:
                            </Text>

                            <TextInput
                                style={styles2.txtInputb}
                                keyboardType="numeric"
                                // underlineColorAndroid = "transparent"
                                placeholder="123"
                                value={this.state.bank_code}

                                onChangeText={(formatted) => {
                                    console.log(formatted); // +1 (123) 456-78-90
                                    this.setState({bank_code: formatted})
                                }}
                            />

                        </View>

                        <View style={[styles2.viewForm,{  }]}>
                            <Text style={[styles.text2b,{  }]}>
                                Agencia e Codigo de Verificação se houver
                            </Text>

                            <TextInput
                                style={styles2.txtInputb}
                                keyboardType="numeric"
                                // underlineColorAndroid = "transparent"
                                placeholder="33256"
                                value={this.state.agencia}

                                onChangeText={(formatted) => {
                                    console.log(formatted); // +1 (123) 456-78-90
                                    this.setState({agencia: formatted})
                                }}
                            />

                            <TextInput
                                style={styles2.txtInputb}
                                keyboardType="numeric"
                                // underlineColorAndroid = "transparent"
                                placeholder="0"
                                value={this.state.agencia_dv}

                                onChangeText={(formatted) => {
                                    console.log(formatted); // +1 (123) 456-78-90
                                    this.setState({agencia_dv: formatted})
                                }}
                            />
                        </View>

                        <View style={[styles2.viewForm,{  }]}>
                            <Text style={[styles.text2b,{  }]}>
                                Conta:
                            </Text>

                            <TextInput
                                style={styles2.txtInputb}
                                keyboardType="numeric"
                                // underlineColorAndroid = "transparent"
                                placeholder="1234456"
                                value={this.state.conta}

                                onChangeText={(formatted) => {
                                    console.log(formatted); // +1 (123) 456-78-90
                                    this.setState({conta: formatted})
                                }}
                            />

                            <TextInput
                                style={styles2.txtInputb}
                                keyboardType="numeric"
                                // underlineColorAndroid = "transparent"
                                placeholder="0"
                                value={this.state.conta_dv}

                                onChangeText={(formatted) => {
                                    console.log(formatted); // +1 (123) 456-78-90
                                    this.setState({conta_dv: formatted})
                                }}
                            />
                        </View>

                        <View style={[styles2.viewForm,{  }]}>
                            <Text style={[styles.text2b,{  }]}>
                                Tipo de conta:
                            </Text>

                            <TextInput
                                style={styles2.txtInputb}
                                keyboardType="numeric"
                                // underlineColorAndroid = "transparent"
                                placeholder="conta_corrente"
                                value={this.state.type}

                                onChangeText={(formatted) => {
                                    console.log(formatted); // +1 (123) 456-78-90
                                    this.setState({type: formatted})
                                }}
                            />
                        </View>

                        <View style={[styles2.viewForm,{  }]}>
                            <Text style={[styles.text2b,{  }]}>
                                Dados Da Pessoa Fisica:
                            </Text>

                            <TextInput
                                style={styles2.txtInputb}
                                // keyboardType="numeric"
                                // underlineColorAndroid = "transparent"
                                placeholder="Joaquim Silva"
                                value={this.state.legal_name}

                                onChangeText={(formatted) => {
                                    console.log(formatted); // +1 (123) 456-78-90
                                    this.setState({legal_name: formatted})
                                }}
                            />

                            <TextInputMask
                                keyboardType="numeric"
                                style={styles2.txtInputb}
                                // underlineColorAndroid = "transparent"
                                placeholder="123.456.789-09"
                                value={this.state.cpf}

                                refInput={ref => { this.input = ref }}
                                onChangeText={(formatted, extracted) => {
                                    console.log(formatted); // 123.456.789-09.
                                    console.log(extracted); // 1234567890
                                    this.state.cpf = extracted;
                                }}
                                mask={"[000].[000].[000]-[00]"}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                this.state.isLoading = true;
                                this.cadBank();

                                // Alert.alert(this.state.nome);
                                // this.props.navigation.navigate('CadUsuarioImgs');
                            }}>

                            <Text style={styles.text3}> OK </Text>
                        </TouchableOpacity>


                    </View>
                </ScrollView>

            </View>
        );
    }

    cadBank = () => {
        const nav = this.props.navigation.navigate;

        console.log(":::user:::");
        console.log(this.state.user);

        fetch( consts.rest_url + '/pagarme/insert/bank_accounts/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("::::  RESPOSTA  cadBank() :::: ");
                console.warn(responseJson);
                if (responseJson.error){
                    if (responseJson.error === "error"){
                        console.warn(responseJson.msg);
                    }
                    if (responseJson.error === "warn"){
                        Alert.alert(responseJson.msg);
                    }

                    return responseJson;
                }else{
                    if (responseJson.id_pagarme_recebedor){
                        this.setState({user: responseJson});
                        //Alert.alert(JSON.stringify(responseJson));
                        nav('AddCartao', {user: this.state.user, amount: this.state.amount});
                    }

                    return responseJson;
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

}

const styles2 = StyleSheet.create({
    viewForm: {
        flex: 1,
        // flexDirection: 'row',
        alignItems: 'flex-start',
        // justifyContent: 'flex-start'
        width: 280
    },

    txtInputb: {
        // flex:1,
        height: 35,
        alignSelf: 'stretch',
        borderColor: colors.grafit, borderWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        marginBottom: metrics.padding,
        color: colors.grafit,
        fontSize: fonts.regular,
        // justifyContent: 'flex-start',
        textAlignVertical: 'bottom',


    },

    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
