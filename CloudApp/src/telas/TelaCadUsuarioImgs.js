/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Alert, ScrollView, TouchableOpacity, TextInput, Image
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

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

const GLOBAL = require('../config/GLOBALS');


type Props = {};
export default  class TelaCadUsuarioImgs extends Component<Props> {
    constructor(props) {
        super(props);
        //linha original::::::
        const params = this.props.navigation.state.params;
        //linha para teste::::
        // const params = {user: {usuario: 'teste', id: 83, email: 'a@a.com'}};

        let avatar_loaded = {};
        if (params.user.avatar){
            avatar_loaded = {name: 'avatar', uri: `${GLOBAL.BASE_IMG_URL + params.user.avatar}` };
        }else{
            avatar_loaded = {name: 'avatar', uri: 'https://vignette.wikia.nocookie.net/the-enigma-corporation/images/0/01/Users-User-icon.png/revision/latest?cb=20140213102228'};
        }

        console.log("::::: avatar url ::::: ");
        console.log(avatar_loaded);


        this.state = {
            avatarSel: false,
            rgSel: false,
            user: params.user,
            avatarSource: avatar_loaded,
            // rgSource: {name: 'rg', uri: require('../../img/rgex.jpg')},
            rgSource: require('../../img/rgex.jpg'),
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
                        <Text style={styles.text1b}>
                            Insira uma selfie:
                        </Text>

                        <Image source={this.state.avatarSource}
                               style={styles2.uploadAvatar}
                               resizeMode='cover'
                        />

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                this.openPicker('selfie');
                                // this.props.navigation.navigate('CadUsuario');
                            }}>

                            <Text style={styles.text3}> Inserir Selfie</Text>
                        </TouchableOpacity>

                        <Text style={styles.text1b}>
                            Insira a foto 3x4 de sua identidade (RG):
                        </Text>

                        <Image source={this.state.rgSource} style={styles2.uploadRg} >
                        </Image>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                // this.openPicker('rg');
                                this.openPickerCrop()
                                // this.props.navigation.navigate('CadUsuario');
                            }}>

                            <Text style={styles.text3}> Inserir foto do RG </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                if (!this.state.rgSel){
                                    Alert.alert("A imagem do Rg é obrigatória")
                                }else{
                                    this.enviaImagens2();
                                }
                                // this.openPicker('rg');
                                // this.enviaImagens();
                                // this.props.navigation.navigate('CadUsuario');
                            }}>

                            <Text style={styles.text3}> ENVIAR E FINALIZAR </Text>
                        </TouchableOpacity>




                    </View>
                </ScrollView>

            </View>
        );
    }

    openPicker(fonte) {

        var ImagePicker = require('react-native-image-picker');

// More info on all the options is below in the README...just some common use cases shown here
        var options = {
            title: 'Select Avatar',
            customButtons: [
                {name: 'fb', title: 'Choose Photo from Facebook'},
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info below in README)
         */
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // let source = { uri: response.uri };
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                if (fonte === 'selfie'){
                    this.setState({
                        avatarSource: { uri: response.uri },
                        avatarSel: true,
                    });

                }
            }
        });

    }

    openPickerCrop() {
        ImagePicker.openCamera({
            width: 100,
            height: 133,
            cropping: true
        }).then(image => {
            this.setState({
                rgSource: {uri: image.path},
                rgSel: true,
                // rgSource: image
            });
            console.log(image);
        });
        // ImagePicker.openPicker({
        //     width: 100,
        //     height: 133,
        //     cropping: true
        // }).then(image => {
        //     this.setState({
        //         rgSource: image
        //     });
        // });

    }


    enviaImagens2(){
        let body = new FormData();

        body.append('user_id', this.state.user.id);
        body.append('rg', {uri: this.state.rgSource.uri, name: 'rg.jpg',type: 'image/jpg'});

        if (this.state.avatarSel) {
            body.append('avatar', {uri: this.state.avatarSource.uri, name: 'avatar.jpg', type: 'image/jpg'});
        }

        body.append('Content-Type', 'image/jpg');
        fetch('http://ec2-54-171-202-42.eu-west-1.compute.amazonaws.com/upload/usuarioImgs',
            { method: 'POST',
                headers:{
                    "Content-Type": "multipart/form-data",
                },
                body: body
            }
        )
        .then((response) => response.json())
        .then((responseJson) => {
            console.log("response==>" +JSON.stringify(responseJson));

            if (responseJson.error){
                if (responseJson.error === "error"){
                    console.warn(responseJson.msg);
                }
                if (responseJson.error === "warn"){
                    Alert.alert(responseJson.msg);
                }
                return responseJson;
            }else{
                // console.log("response2==>" +JSON.stringify(responseJson));
                this.setState({user: responseJson});
                this.props.navigation.navigate('Profile',{user: this.state.user});

                return responseJson;
            }

        })
        .catch((e) => {console.log("ERRO==> "+  e)})
        .done()
    }

    enviaImagens() {

        const nav = this.props.navigation.navigate;
        const data = new FormData();

        //SE FOR UMA UNICA FOTO:::::
        // data.append('user', this.state.user); // you can append anyone.
        // data.append('photo', {
        //     uri: photo.uri,
        //     type: 'image/jpeg', // or photo.type
        //     name: 'testPhotoName'
        // });


        // photos.forEach((photo) => {
        //     data.append(photo.name, {
        //         uri: photo.uri,
        //         type: 'image/jpeg', // or photo.type
        //         name: photo.name
        //     });
        // });
        data.append('user', this.state.user);

        data.append('avatar', {
            uri: this.state.avatarSource.uri,
            type: 'image/jpeg', // or photo.type
            name: this.state.avatarSource.name
        });

        fetch('http://ec2-54-171-202-42.eu-west-1.compute.amazonaws.com/upload/usuarioImgs', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                // 'Content-Type': 'application/json',


                // 'Accept': 'application/json',
                // 'Content-Type': 'multipart/form-data;',
            },
            body: data

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
                    Alert.alert(JSON.stringify(responseJson));

                    this.setState({user: responseJson});


                    // nav('CadUsuario', {user: this.state.user});

                    return responseJson;
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

const styles2 = StyleSheet.create({
    uploadRg: {
        width: 250,
        height: 200
    },
    uploadAvatar: {
        width: 300,
        height: 200
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
