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
import { StackActions,NavigationActions } from 'react-navigation';



import {styles} from '../styles/styles'
import colors from '../styles/colors'
import metrics from '../styles/metrics'
import fonts from '../styles/fonts'
import consts from '../styles/consts'

import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';


const FBSDK = require('react-native-fbsdk');
const {
    LoginButton,
    AccessToken,
    GraphRequest,
    GraphRequestManager
} = FBSDK;

const instructions = Platform.select({
    ios: 'ola,\n' +
    'voce esta usando IOS',
    android: 'oi,\n' +
    'voce esta usando ANDROID',
});

type Props = {};
export default class TelaLogin extends Component<Props> {


    constructor(props) {
        super(props);
        //linha original::::::
        //const params = this.props.navigation.state.params;

        //linha para teste::::
        // const params = {user: {usuario: 'teste', id: 83, email: 'a@a.com'}};
        this.state = {
            login: '' ,
            passw: '',
            FB_login: {},
            user: {},
        };

        AccessToken.getCurrentAccessToken().then(
            (data) => {
                if (data){
                    console.log("::::: acces tokem contructor  :::::");
                    console.log(data);
                    this.setState({FB_login: data});
                    // alert(data.accessToken.toString());
                    this.initUserFB();
                }
            }
        )
    }


    async componentDidMount() {
        await this._configureGoogleSignIn();
        await this._getCurrentUser();
    }
    async _configureGoogleSignIn() {
        await GoogleSignin.hasPlayServices({ autoResolve: true });
        const configPlatform = {
            ...Platform.select({
                ios: {
                    iosClientId: '',
                },
                android: {},
            }),
        };

        await GoogleSignin.configure({
            ...configPlatform,
            webClientId: '',
            offlineAccess: false,
        });
    }

    async _getCurrentUser() {
        try {

            const user = await GoogleSignin.currentUserAsync();
            console.log("::::: google current user :::::");
            console.log(user);

            this.setState({ user, error: null });
        } catch (error) {
            console.log("::::: google current user error! :::::");
            console.warn(error);
            // this.setState({
            //     error,
            // });
        }
    }


    render() {
        return (
            <View style={styles2.precontainer}>
                <ScrollView
                    contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}
                >
                    <View
                        style={styles2.container}>

                        {/*{instructions}*/}
                        <Image
                            style={{height: 60, width: 280, marginBottom: metrics.padding}}
                            source={require('../../img/cloud-logo.png')}
                        />

                        <Text style={[styles.text2, {marginHorizontal: metrics.padding}]}>
                            Bem Vindo ao App de Adiantamento de Crédito da CloudCrm ®
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

                        <GoogleSigninButton
                            style={{ width: 200, height: 48 }}
                            size={GoogleSigninButton.Size.Wide}
                            color={GoogleSigninButton.Color.Dark}
                            onPress={this._signIn}
                        />

                        <TouchableHighlight

                            onPress={this._signOut}>
                            <Image
                                style={styles2.googleLogin}
                                source={require('../../img/googlelogin.png')}
                            />
                        </TouchableHighlight>

                        <Text style={styles.text2}> ou </Text>


                        <TextInput
                            keyboardType='email-address'
                            style={styles.txtInput}
                            placeholder="seu@email.com"
                            onChangeText={(login) => this.setState({login: login})}
                            value={this.state.login}
                            underlineColorAndroid={colors.white}
                            placeholderTextColor={colors.white}
                        />

                        <TextInput
                            style={styles.txtInput}
                            placeholder="Senha"
                            secureTextEntry = {true}
                            onChangeText={(passw) => this.setState({passw})}
                            value={this.state.passw}
                            underlineColorAndroid={colors.white}
                            placeholderTextColor={colors.white}
                        />

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                // Alert.alert('Logar!');
                                // this.props.navigation.navigate('Cadastrese');
                                this.negocioLogin();
                            }}>

                            <Text style={styles.buttonTxt}> ENTRAR </Text>
                        </TouchableOpacity>

                        <View styles={{}}>
                            <TouchableOpacity
                                style={{marginTop: 25 }}
                                onPress={() => {
                                    Alert.alert('Ir Para tela de registro ou reaver senha');
                                    // this.props.navigation.navigate('CadUsuario');
                                }}>

                                <Text style={styles.text3}> Esqueceu a senha? </Text>
                            </TouchableOpacity>

                        </View>

                        <View styles={{}}>
                            <TouchableOpacity
                                style={{marginTop: 25 }}
                                onPress={() => {
                                    // Alert.alert('Ir Para tela de registro ou reaver senha');
                                    this.props.navigation.navigate('Cadastrese');
                                }}>

                                <Text style={styles.text3}> Cadastre-se </Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </ScrollView>

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
        let urlll = consts.rest_url + "/loginFB/";
        console.log("::: negocioLoginFB.. urlll :::");
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
                                    // this.props.navigation.dispatch(StackActions.reset(
                                    //     {
                                    //         index: 0,
                                    //         actions: [
                                    //             NavigationActions.navigate({ routeName: 'Profile', params: {user: this.state.user}})
                                    //         ]
                                    //     }));
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

    negocioLogin = () => {
        const nav = this.props.navigation.navigate;
        fetch(consts.rest_url + "/login/" +
              this.state.login + '/' + this.state.passw + '/', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify(this.state),
        })
            .then((response) => response.json())
            .then((responseJson) => {
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
                        //Alert.alert(JSON.stringify(responseJson));
                        nav('Profile', {user: this.state.user});
                    }

                    return responseJson;
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };


    _signIn = async () => {
        try {
            const userGoogle = await GoogleSignin.signIn();
            console.log("_signIn userGoogle CARALHOOOwwww");
            console.log(userGoogle);
            this.setState({user:
                {name: userGoogle.name, email: userGoogle.email, googleid: userGoogle.id,
                    picurl: userGoogle.photo }});
            // this.setState({ user });
            this.negocioLoginGoogle();
        } catch (error) {
            if (error.code === 'CANCELED') {
                console.log(":: google cancelou o login");
                console.log(user);
                console.log(user);
                // user cancelled the login flow
            } else {
                console.log("::: GOOGLELOGIN - clicou fora da janela cancelando ::: ");
                console.log(error);
            }
        }
    };
    _signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            this.setState({ user: null });
            console.log(":::: GOOGLE LOGGED OUT::::");
            alert("Desconectado do Google");
        } catch (error) {
            console.log(":::: GOOGLELOGIN ::::");
            alert("Nao conectado");

            this.setState({
                error,
            });
        }
    };

    negocioLoginGoogle = () => {
        const nav = this.props.navigation.navigate;
        let urlll = consts.rest_url + "/loginGoogle/";
        console.log("::: negocioLoginGoogle.. urlll :::");
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
                    googleid: this.state.user.googleid,
                    picurl: this.state.user.picurl,
                }
            ),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(":::: response /loginGoogle/ :::: ");
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
                            // this.props.navigation.dispatch(StackActions.reset(
                            //     {
                            //         index: 0,
                            //         actions: [
                            //             NavigationActions.navigate({ routeName: 'Profile', params: {user: this.state.user}})
                            //         ]
                            //     }));
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
}

const styles2 = StyleSheet.create({
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
        backgroundColor: colors.grafit,
        // alignSelf: 'center',
    },
    faceLogin: {
        // flex:1,
        width:200,
        height: 42,
        marginVertical: metrics.padding,
    },
    googleLogin: {
        // flex:1,
        width:200,
        height: 41,
        marginVertical: metrics.padding,


    },
});
