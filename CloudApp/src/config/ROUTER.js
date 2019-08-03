import React from 'react';
import { StackNavigator ,createStackNavigator } from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";
import { YellowBox } from 'react-native';
import TelaLogin from '../telas/TelaLogin';
import TelaCadUsuarioImgs from '../telas/TelaCadUsuarioImgs';
import TelaCadastrese from "../telas/TelaCadastrese";
import TelaCadUsuario from "../telas/TelaCadUsuario";
import TelaProfile from "../telas/TelaProfile";
import TelaSimulacao from "../telas/TelaSimulacao";
import TelaAddCartao from "../telas/TelaAddCartao";
import TelaListaCartoes from "../telas/TelaListaCartoes";
import TelaCadBank from "../telas/TelaCadBank";
import TelaListaBancos from "../telas/TelaListaBancos";
import TelaListaTransacoes from "../telas/TelaListaTransacoes";


YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);





export const SimulacaoStack = createStackNavigator({
    Simulacao: {
        screen: TelaSimulacao,
        navigationOptions: {
            headerTitle: 'Simulação',
            // headerLeft: (
            //     <Icon
            //         name="md-arrow-back"
            //         color="#4F8EF7"
            //         size={30}
            //         onPress={() => alert('This is a button!')}
            //
            //     />
            // ),
        },
    },
    Profile: {
        screen: TelaProfile,
        navigationOptions: {
            headerTitle: 'Perfil',
        },
    },
    ListaTransacoes: {
        screen: TelaListaTransacoes,
        navigationOptions: {
            headerTitle: 'Meus Bancos',
        },
    },
    ListaCartoes: {
        screen: TelaListaCartoes,
        navigationOptions: {
            headerTitle: 'Meus Cartões',
        },
    },
    ListaBancos: {
        screen: TelaListaBancos,
        navigationOptions: {
            headerTitle: 'Meus Bancos',
        },
    },
    AddCartao: {
        screen: TelaAddCartao,
        navigationOptions: {
            headerTitle: 'CheckOut',
        },
    },

},
{
    initialRouteName: 'Profile',
    mode: 'modal',
});

export const RootStack = createStackNavigator({
    Login: {
        screen: TelaLogin,
    },
    Cadastrese: {
        screen: TelaCadastrese,
    },
    CadUsuario: {
        screen: TelaCadUsuario,
    },
    CadUsuarioImgs: {
        screen: TelaCadUsuarioImgs,
    },
    SimulacaoStack: {
        screen: SimulacaoStack,
    },
    CadBank: {
        screen: TelaCadBank,
    },
    // Profile: {
    //     screen: TelaProfile,
    //     navigationOptions: {
    //         headerTitle: 'Perfil',
    //     },
    // },
},
{
    initialRouteName: 'Login',
     mode: 'modal',
     headerMode: 'none',
});






