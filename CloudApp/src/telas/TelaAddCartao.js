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
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import pagarme from 'pagarme';



import {styles} from '../styles/styles'
import colors from '../styles/colors'
import metrics from '../styles/metrics'
import fonts from '../styles/fonts'
import consts from '../styles/consts'
import TextInputMask from "react-native-text-input-mask";
import {TextMask,  MaskService } from "react-native-masked-text";



const instructions = Platform.select({
    ios: 'ola,\n' +
    'voce esta usando IOS',
    android: 'oi,\n' +
    'voce esta usando ANDROID',
});

type Props = {};
export default class TelaAddCartao extends Component<Props> {


    constructor(props) {
        super(props);

        //linha original::::::
        const params = this.props.navigation.state.params;
        //linha para teste::::
        // const params = {user: {usuario: 'teste',nome: 'Thiago C L da Silva',  id: 83, email: 'a@a.com', avatar: '83_avatar.jpg'}};

        // this.state = {
        //     user: params.user,
        //     isLoading: false ,
        //     card_hash: '',
        //     cardForm: {},
        //     nome: '',
        //     datanasci: '',
        //     cep: '',
        //     cpf: '',
        //     complemento: '',
        //     logradouro: '',
        //     bairro: '',
        //     cidade: '',
        //     uf: '',
        // };
        this.state = {
            user: params.user,
            amount: params.amount,

            isLoading: false ,
            card_hash: '',
            cep: '85867010',
            cpf: '04809304906',
            complemento: '129',
            nome: 'THIAGO C L DA SILVA',
            cardForm: {
                values: {
                    number: '123456789456',
                    expiry: '12/12',
                    cvc: '123',
                    type: 'hypercard',
                }
            },
            novaTransacao: {}
        };



    }

    render() {
        return (
            <View style={styles2.precontainer}>
                <View style={styles2.container}>
                    <ScrollView
                        contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}
                    >
                        <Text style={{fontSize: fonts.big}} >Você está fazendo checkout no valor de:</Text>

                        <View style={{backgroundColor: colors.backgr}}>
                            <TextMask
                                style={styles2.fontValor}
                                // value={this.state.sliderValue}
                                value={this.state.amount}
                                type={'money'}
                                options={{
                                    unit: 'R$ ',
                                    obfuscated: true
                                }}
                                // onPress={() => { this.setState({isDialogVisible: true}) }}
                            />
                        </View>

                        <CreditCardInput
                            // requiresName={true}
                            allowScroll={true}
                            labels={{number: "Número do Cartão", expiry: "Expiração", cvc: "CCV" }}
                            placeholders={{ number: "1234 5678 1234 5678", expiry: "MM/AA", cvc: "123" }}
                            onChange={form =>  {
                                console.log(form);
                                this.setState({cardForm: form});
                            }} />

                        <View style={[styles2.viewForm,{ marginTop: metrics.padding }]}>
                            <Text style={[styles.text2b,{  }]}>
                                Nome (como está escrito no cartão)
                            </Text>

                            <TextInput
                                style={styles2.txtInputb}
                                // underlineColorAndroid = "transparent"
                                placeholder="Jõao da Silva"
                                value={this.state.nome}
                                onChangeText={ (nome) => {this.setState({nome: nome})}}
                            />
                        </View>

                        <View style={[styles2.viewForm,{  }]}>
                            <Text style={[styles.text2b,{  }]}>
                                Informe C.P.F do holder
                            </Text>
                            <TextInputMask
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
                            <Text style={[styles.text2b,{ paddingTop: metrics.padding, fontSize: fonts.regular}]}>
                                Informe os outros dados do cartão:
                            </Text>
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
                        <View style={{backgroundColor: colors.green}}>
                            <Button
                                title="FINALIZAR CHECKOUT"
                                buttonStyle={{ marginTop: 20 }}
                                onPress={() => {

                                    this.addCartao();
                                    // this.checkOut_pagarme();

                                }}
                            />
                        </View>

                    </ScrollView>
                </View>


            </View>

        );
    }

    addCartao() {
        if ( ! this.state.cardForm.valid){
            Alert.alert("Dados do cartão são inválidos");
        }else{

            //PARA TESTE.. NAO ESQUECER O ``!`` DO IF ACIMA
            // this.setState({
            //     cep: '85867100',
            //     cpf: '048056056605',
            //     complemento: 'compelemn teste',
            //     nome: 'Thiago correa l da aislva',
            //     cardForm: {
            //       values: {
            //           number: '123456789456',
            //           expiry: '12/12',
            //           cvc: '123',
            //           type: 'hypercard',
            //       }
            //     }
            // });


            const nav = this.props.navigation.navigate;
            fetch(consts.rest_url + '/insert/cartao/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state),
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.error){
                    if (responseJson.error === "error"){
                        console.warn(responseJson.msg);
                    }
                    if (responseJson.error === "warn"){
                        if (responseJson.msg.includes("cadastrado") === true){

                            this.checkOut_pagarme();

                        }else{
                            // alert("Erro ao cadastrar cartao..");
                            console.warn(responseJson.msg);
                        }
                    }

                    return responseJson;
                }else{
                    console.log(responseJson);
                    if (responseJson.id === this.state.user.id){
                        //se cadastou o caretao
                        this.checkOut_pagarme();

                    }else{

                    }

                    return responseJson;
                }
            })
            .catch((error) => {
                console.error(error);
            });
        }
    };

    checkOut_pagarme() {
        console.log("::: testePagarme ::: ");
        if ( ! this.state.cardForm.valid){
            Alert.alert("Dados do cartão são inválidos");
        }else{
            let card = {};
            //PARA TESTE
            // card.card_holder_name = 'THIAGO C L DA SILVA';
            // card.card_number = '5268920031571313';
            // card.card_expiration_date = '0126';
            // card.card_cvv = '301';

            card.card_holder_name = this.state.nome;
            card.card_number = this.state.cardForm.values.number.replace(" ","");
            card.card_expiration_date = this.state.cardForm.values.expiry.replace("/","");
            card.card_cvv = this.state.cardForm.values.cvc;

            //NAO FUNGA ABAIXO --  da api do pagarme
            // pega os erros de validação nos campos do form e a bandeira do cartão
            // const cardValidations = pagarme.validate({card: card});            //
            // //Então você pode verificar se algum campo não é válido
            // if(!cardValidations.card.card_number)
            //     console.log('Oops, número de cartão incorreto');

            //Mas caso esteja tudo certo, você pode seguir o fluxo
            pagarme.client.connect({ encryption_key: consts.pagarmeKey_PRODUCTION_encript })
                .then(client => client.security.encrypt(card))
                .then(card_hash => {
                    console.log(":::: CARD HASH:::: ");
                    console.log(card_hash);
                    this.setState({card_hash: card_hash});


                    //ENVIA DADOS PARA O SERVER FAZER A TRANSAÇAO
                    const nav = this.props.navigation.navigate;
                    fetch(consts.rest_url + '/pagarme/cobraCartao/', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(this.state),
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            console.log("::: RESPOSTA /pagarme/cobraCartao/ :::");
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
                                if (responseJson.status === 'paid'){
                                    this.setState({novaTransacao: responseJson});
                                    this.insereTransacao();

                                    Alert.alert("Pagamento Realizado Com Sucesso");
                                    nav('Profile', {user: this.state.user});

                                }else{
                                    Alert.alert("Ocorreu algum erro no pagamento");
                                    console.warn(responseJson);
                                }

                                // console.log(responseJson);
                                // this.setState({user: responseJson});

                                //Alert.alert(JSON.stringify(responseJson));

                                // nav('Profile', {user: this.state.user});

                                return responseJson;
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });

                })
                .catch((error) => {
                    console.error("::: ERRO AO GERAR CARD_HASH :::");
                    console.error(error);
                });
            // o próximo passo aqui é enviar o card_hash para seu servidor, e
            // em seguida criar a transação/assinatura


        }

    }
    getCepInfo(cep) {
        return fetch('https://viacep.com.br/ws/'+cep+'/json/')
        // return fetch('https://viacep.com.br/ws/'+cep+'/json/')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({isLoading: false});
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
                        logradouro: responseJson.logradouro,
                        complemento: responseJson.complemento,
                        bairro: responseJson.bairro,
                        cidade: responseJson.localidade,
                        uf: responseJson.uf,
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
    }


    insereTransacao = ()=> {


        fetch(consts.rest_url + '/insert/transacao/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("::: RESPOSTA /insert/transacao/ :::");
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
                    // Alert.alert("Pagamento Realizado Com Sucesso");
                    // nav('Profile', {user: this.state.user});

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
        paddingHorizontal: metrics.padding,
        // flexDirection: 'row',
        alignItems: 'flex-start',
        // justifyContent: 'flex-start'
        width: 280
    },
    txtInput: {
        height: 40, width: 250,
        // borderColor: 'gray', borderWidth: 1,
        marginBottom: metrics.padding,
        color: colors.white,
    },
    txtInputb: {
        height: 40, width: 250,
        // borderColor: 'gray', borderWidth: 1,
        marginBottom: metrics.padding,
        color: colors.grafit,

    },
    fontValor: {
        padding: metrics.padding2,
        fontFamily: 'sans-serif-medium',
        color: colors.red,
        fontSize: fonts.bigger,
        alignSelf: "center"
    },
    precontainer: {
        backgroundColor: colors.lightgrafit,
        flex:1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgr,
        // alignSelf: 'center',
    },
});
