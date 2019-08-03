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

import {styles} from '../styles/styles'
import colors from '../styles/colors'
import metrics from '../styles/metrics'
import fonts from '../styles/fonts'


const instructions = Platform.select({
    ios: 'ola,\n' +
    'voce esta usando IOS',
    android: 'oi,\n' +
    'voce esta usando ANDROID',
});

type Props = {};
export default class TelaSnippet extends Component<Props> {
    negocioLogin = () => {
        this.props.navigation.navigate('CadUsuario');
    };

    constructor(props) {
        super(props);
        this.state = {
            text: '' ,
            passw: ''
        };
    }

    render() {
        return (
            <View style={styles2.precontainer}>
                <ScrollView
                    contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}
                >


                </ScrollView>

            </View>

        );
    }
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
});
