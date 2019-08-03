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
    Alert, TouchableHighlight, TouchableOpacity, Image, TextInput
} from 'react-native';

import TextInputMask from 'react-native-text-input-mask';

import {styles} from '../styles/styles'
import colors from '../styles/colors'
import metrics from '../styles/metrics'
import fonts from '../styles/fonts'

const FBSDK = require('react-native-fbsdk');
const {
    LoginButton,
    AccessToken,
    GraphRequest,
    GraphRequestManager
} = FBSDK;


const instructions = Platform.select({
    ios: 'sadasdasdad to reload,\n' +
    'Cmd+D oasdasdasdasd dev menu',
    android: 'Dsadasdadad,\n' +
    'Shakeaaaahhh mulekeeeeeeee dev menu',
});


type Props = {};
export default  class TelaCadastrese extends Component<Props> {
    constructor(props) {
        super(props);

        this.state = {
            user: [],
            usuario: '' ,
            senha: '',
            email: ''
        };
    }

    render() {

        return (
            <View style={styles2.precontainer}>
                <View style={styles2.container}>
                    <Text style={styles.text1b}>
                        Cadastre-se
                    </Text>

                    <LoginButton
                        // publishPermissions={[""]}
                        readPermissions={["public_profile,email"]}
                        onLoginFinished={
                            (error, result) => {
                                if (error) {
                                    alert("login has error: " + result.error);
                                } else if (result.isCancelled) {
                                    alert("login is cancelled.");
                                } else {
                                    AccessToken.getCurrentAccessToken().then(
                                        (data) => {
                                            console.log(data);
                                            this.setState({FB_login: data});
                                            alert(data.accessToken.toString());
                                            this.initUserFB();
                                        }
                                    )
                                }
                            }
                        }
                        onLogoutFinished={() => alert("logout.")}
                    />

                    <TouchableHighlight
                        onPress={this._onPressButton}
                    >
                        <Image
                            style={styles2.googleLogin}
                            source={require('../../img/googlelogin.png')}
                        />
                    </TouchableHighlight>

                    <Text style={styles.text2b}> ou </Text>

                    {/*<TextInputMask*/}
                        {/*style={styles.txtInputb}*/}
                        {/*placeholder="email@email.com"*/}
                        {/*textAlign={'center'}*/}
                        {/*refInput={ref => { this.input = ref }}*/}
                        {/*onChangeText={(formatted, extracted) => {*/}
                            {/*console.log(formatted); // +1 (123) 456-78-90*/}
                            {/*console.log(extracted); // 1234567890*/}
                            {/*this.setState({email: formatted});*/}
                            {/*// this.state.email = formatted;*/}
                        {/*}}*/}
                        {/*mask={"[_-------------------------------------]@[_------------------------].[A----]"}*/}

                        {/*// mask={"[A...]@[A...].[AAaaa]"}*/}
                    {/*/>*/}

                    <TextInput
                        style={styles.txtInputb}
                        keyboardType="email-address"
                        placeholder="email@email.com"
                        textAlign={'center'}


                        onChangeText={(formatted) => this.setState({email: formatted})}
                    />


                    <TextInput
                        style={styles.txtInputb}
                        placeholder="Usuario"
                        textAlign={'center'}

                        onChangeText={(usuario) => this.setState({usuario})}
                        // value={this.state.usuario}
                    />

                    <TextInput
                        style={styles.txtInputb}
                        placeholder="Senha"
                        textAlign={'center'}
                        secureTextEntry = {true}
                        onChangeText={(senha) => {
                            this.state.senha = senha
                        }}
                        // value={this.state.passw}
                    />


                    <TouchableOpacity
                        style={styles.button}
                        onPress={() =>  {
                            this.state.isLoading = true;
                            this.preCadastro();
                        }}>

                        <Text style={styles.buttonTxt}> CADASTRAR </Text>
                    </TouchableOpacity>

                    <View styles={{}}>
                        <TouchableOpacity
                            style={{marginTop: 25 }}
                            onPress={() => {
                                Alert.alert('Ir Para tela de registro ou reaver senha');
                                // this.props.navigation.navigate('CadUsuario');
                            }}>

                            <Text style={styles.text3b}> Condições de serviço </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        );
    }

    initUserFB = () => {
        console.log(":::FBLOGIN:::::");
        console.log(this.state.FB_login);
        let accessToken = this.state.FB_login.accessToken;
        let userID = this.state.FB_login.userID;
        /*
        opcoes:
        /me , /fields

        picture.type(large)
         */
        let ADDR = '/' + userID +
            '?fields=name,email,about,picture.width(1000).height(1000)' +
            '&access_token=' + accessToken;
        console.log("::::ADDR::::");
        console.log(ADDR);

        const infoRequest = new GraphRequest(
            ADDR,
            null,
            this._responseInfoCallback,
        );
        // Start the graph request.
        new GraphRequestManager().addRequest(infoRequest).start();
    };
    //Create response callback.
    _responseInfoCallback = (error: ?Object, result: ?Object) => {
        if (error) {
            alert('Error fetching data: ' + error.toString());
        } else {
            console.log(":::: result FB GRAPH ::::");
            console.log(result);
            this.setState({user:
                {name: result.name, email: result.email, fbid: result.id,
                    picurl: result.picture.data.url }});
            this.negocioLoginFB();

        }
    };

    negocioLoginFB = () => {
        const nav = this.props.navigation.navigate;
        let urlll = "http://ec2-54-171-202-42.eu-west-1.compute.amazonaws.com/loginFB/";
        console.log(urlll);

        fetch(urlll, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    email: this.state.user.email,
                    name: this.state.user.name,
                    fbid: this.state.user.fbid,
                    picurl: this.state.user.picurl,
                }
            ),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(":::: response LoginFB server :::: ");
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
                    if (responseJson.success === "success"){
                        this.setState({user: responseJson});
                        //verificar se cadastro esta complemto ou nao
                        // if (this.state.user.fbid === '0'){
                        //
                        // }

                        //nao foi cadastrado
                        if (parseInt(this.state.user.statuscad) === 0){
                            nav('CadUsuario', {user: this.state.user});
                        }else
                        if (parseInt(this.state.user.statuscad) === 1) {//passou pelo cadastro CadUsuario (dados principais)
                            nav('CadUsuarioImgs', {user: this.state.user});
                        }else
                        if (parseInt(this.state.user.statuscad) > 1) {//passou pelo cadastro CadUsuarioImgs (fotos)
                            nav('Profile', {user: this.state.user});
                        }
                    }

                    return responseJson;
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    preCadastro = () => {
        const nav = this.props.navigation.navigate;

        fetch('http://ec2-54-171-202-42.eu-west-1.compute.amazonaws.com/cadastra/preusuario', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                usuario: this.state.usuario,
                senha: this.state.senha,
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

                    nav('CadUsuario', {user: this.state.user});

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
        backgroundColor: colors.grafit,
        flex:1,
        // alignItems: 'center',

        // alignItems: 'flex-end',
        //  justifyContent: 'center',
    },
    container: {
        flex: 1,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgr,
        alignSelf: 'center',
    },
    faceLogin: {
        // flex:1,
        width:200,
        height: 41,
        marginVertical: metrics.padding,
    },
    googleLogin: {
        // flex:1,
        width:200,
        height: 42,
        marginVertical: metrics.padding,


    },
});