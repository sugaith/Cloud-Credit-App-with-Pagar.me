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


const instructions = Platform.select({
    ios: 'sadasdasdad to reload,\n' +
    'Cmd+D oasdasdasdasd dev menu',
    android: 'Dsadasdadad,\n' +
    'Shakeaaaahhh mulekeeeeeeee dev menu',
});

type Props = {};
export default  class TelaCadUsuario extends Component<Props> {
    constructor(props) {
        super(props);
        //linha original::::::
        const params = this.props.navigation.state.params;

        //linha para teste::::
        // const params = {user: {usuario: 'teste', id: 83, email: 'a@a.com'}};

        this.state = {
            user: params.user,
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

            // nome: '',
            datanasci: '',
            rg: '',
            cpf: '',
            cep: '',
            complemento: '',
            logradouro: '',
            bairro: '',
            cidade: '',
            uf: '',

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
                            Por favor complete seus dados: {this.state.user.email}
                        </Text>

                        <View style={[styles2.viewForm,{  }]}>
                            <Text style={[styles.text2b,{  }]}>
                                Nome Completo:
                            </Text>

                            <TextInput
                                style={styles2.txtInputb}
                                // underlineColorAndroid = "transparent"
                                placeholder="João Pessoa"

                                 onChangeText={(formatted) => {
                                     console.log(formatted); // +1 (123) 456-78-90
                                     this.setState({nome: formatted})
                                     // this.state.nome = formatted;
                                 }}
                                value={this.state.nome}

                                // onChangeText={(nome) => this.setState({nome})}
                                // value={this.state.nome}
                            />
                        </View>

                        <View style={[styles2.viewForm,{  }]}>
                            <Text style={[styles.text2b,{  }]}>
                                Data de Nascimento:
                            </Text>

                            <TextInputMask
                                keyboardType="numeric"

                                style={styles2.txtInputb}
                                // underlineColorAndroid = "transparent"
                                placeholder="DD/MM/AAAA"
                                value={this.state.datanasci}
                                //textAlign={'center'}
                                refInput={ref => { this.input = ref }}
                                onChangeText={(formatted, extracted) => {
                                    console.log(formatted); // +1 (123) 456-78-90
                                    console.log(extracted); // 1234567890
                                    this.state.datanasci = formatted;
                                }}
                                mask={"[00]/[00]/[0000]"}
                            />
                        </View>

                        <View style={[styles2.viewForm,{  }]}>
                            <Text style={[styles.text2b,{  }]}>
                                Registro Geral (RG):
                            </Text>

                            <TextInputMask
                                keyboardType="numeric"

                                style={styles2.txtInputb}
                                // underlineColorAndroid = "transparent"
                                placeholder="81.011.02-0"
                                value={this.state.rg}

                                //textAlign={'center'}
                                refInput={ref => { this.input = ref }}
                                onChangeText={(formatted, extracted) => {
                                    console.log(formatted); // 123.456.789-09.
                                    console.log(extracted); // 1234567890
                                    this.state.datanasci = extracted;
                                }}
                                // mask={"[00].[000].[00]-[09]"}
                            />
                        </View>

                        <View style={[styles2.viewForm,{  }]}>
                            <Text style={[styles.text2b,{  }]}>
                                C.P.F.:
                            </Text>

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

                        <View style={[styles2.viewForm,{  }]}>
                            <Text style={[styles.text2b,{  }]}>
                                CEP:
                            </Text>

                            <TextInputMask
                                style={styles2.txtInputb}
                                keyboardType="numeric"
                                // underlineColorAndroid = "transparent"
                                placeholder="33666-999"
                                value={this.state.cep}

                                refInput={ref => { this.input = ref }}
                                onChangeText={(formatted, extracted) => {
                                    console.log(formatted); // 123.456.789-09.
                                    console.log(extracted); // 1234567890
                                    this.state.cep = extracted;

                                }}
                                onBlur={(formatted, extracted) => {
                                    console.log("focus lost");
                                    this.state.isLoading = true;
                                    this.getCepInfo(this.state.cep);
                                }}
                                mask={"[00000]-[000]"}
                            />
                        </View>

                        <View style={[styles2.viewForm,{  }]}>
                            <Text style={[styles.text2b,{  }]}>
                                Nº da residência / Complemento
                            </Text>

                            <TextInput
                                style={styles2.txtInputb}
                                // underlineColorAndroid = "transparent"
                                placeholder="nro 00, apto 00, esquina"
                                value={this.state.complemento}
                                onChangeText={ (comp) => {this.setState({complemento: comp})}}
                            />
                        </View>

                        <View style={[styles2.viewForm,{  }]}>
                            <Text style={[styles.text2b,{  }]}>
                                Logradouro
                            </Text>

                            <TextInput
                                style={styles2.txtInputb}
                                // underlineColorAndroid = "transparent"
                                editable={false}
                                placeholder="rua Nome de Rua"

                                value={this.state.logradouro}

                            />
                        </View>



                        <View style={[styles2.viewForm,{  }]}>
                            <Text style={[styles.text2b,{  }]}>
                                Bairro
                            </Text>

                            <TextInput
                                style={styles2.txtInputb}
                                // underlineColorAndroid = "transparent"
                                editable={false}
                                placeholder="Nome do bairro"
                                value={this.state.bairro}

                            />
                        </View>

                        <View style={[styles2.viewForm,{  }]}>
                            <Text style={[styles.text2b,{  }]}>
                                Cidade
                            </Text>

                            <TextInput
                                style={styles2.txtInputb}
                                // underlineColorAndroid = "transparent"
                                editable={false}
                                placeholder="Nome da cidade"
                                value={this.state.cidade}

                            />
                        </View>

                        <View style={[styles2.viewForm,{  }]}>
                            <Text style={[styles.text2b,{  }]}>
                                Estado UF
                            </Text>

                            <TextInput
                                style={styles2.txtInputb}
                                // underlineColorAndroid = "transparent"
                                editable={false}
                                placeholder="Estado (UF)"
                                value={this.state.uf}

                            />
                        </View>


                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                this.state.isLoading = true;
                                this.preCadastro();

                                // Alert.alert(this.state.nome);
                                // this.props.navigation.navigate('CadUsuarioImgs');
                            }}>

                            <Text style={styles.text3}> PRÓXIMO </Text>
                        </TouchableOpacity>


                    </View>
                </ScrollView>

            </View>
        );
    }

    preCadastro = () => {
        const nav = this.props.navigation.navigate;

        fetch('http://ec2-54-171-202-42.eu-west-1.compute.amazonaws.com/update/usuario', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: this.state.nome,
                datanasci: this.state.datanasci,
                rg: this.state.rg,
                cpf: this.state.cpf,
                cep: this.state.cep,
                complemento: this.state.complemento,
                logradouro: this.state.logradouro,
                bairro: this.state.bairro,
                cidade: this.state.cidade,
                uf: this.state.uf,

                email: this.state.user.email,
                usuario: this.state.user.usuario,
                senha: this.state.user.senha,
                id: this.state.user.id,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.error){
                    if (responseJson.error === "error"){
                        console.warn(responseJson.msg);
                    }
                    if (responseJson.error === "warn"){
                        Alert.alert(responseJson.msg);
                    }

                    return responseJson;
                }else{
                    this.setState({user: responseJson});

                    //Alert.alert(JSON.stringify(responseJson));

                    nav('CadUsuarioImgs', {user: this.state.user});

                    return responseJson;
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    getCepInfo(cep) {
        return fetch('https://viacep.com.br/ws/'+cep+'/json/')
        // return fetch('https://viacep.com.br/ws/'+cep+'/json/')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({isLoading: false, jsonCep: responseJson});
                if (responseJson.erro == true){
                    Alert.alert('Cep não encontrado');
                    this.setState({
                        cep: '',
                        complemento: '',
                        bairro: '',
                        logradouro: '',
                        cidade: '',
                        uf: '',
                    });
                }else{
                    console.log(responseJson);
                    // Alert.alert(JSON.stringify(responseJson));
                    this.setState({
                        logradouro: this.state.jsonCep.logradouro,
                        complemento: this.state.jsonCep.complemento,
                        bairro: this.state.jsonCep.bairro,
                        cidade: this.state.jsonCep.localidade,
                        uf: this.state.jsonCep.uf,
                    });

                }
                return responseJson;
            })
            .catch((error) => {
                // console.log('ánimaiaasaoisjdoaisjdoiasjdoaisjdoiasjd');
                // console.error('Formato de cep invalido!');
                Alert.alert('Formato de cep invalido!');
                this.setState({
                    cep: '',
                    complemento: '',
                    bairro: '',
                    logradouro: '',
                    cidade: '',
                    uf: '',
                });
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
