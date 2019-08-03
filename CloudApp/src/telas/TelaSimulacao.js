import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
    Slider, View
} from 'react-native';
import {Tile, List, ListItem, Button, Text} from 'react-native-elements';
import {styles} from '../styles/styles'
import colors from '../styles/colors'
import metrics from '../styles/metrics'
import fonts from '../styles/fonts'
import {TextMask, TextInputMask, MaskService } from "react-native-masked-text";
import DialogInput from 'react-native-dialog-input';



const GLOBAL = require('../config/GLOBALS');

export default class TelaSimulacao extends Component<Props>  {
    constructor(props) {
        super(props);
        //linha original::::::
        const params = this.props.navigation.state.params;
        //linha para teste::::
        //const params = {user: {usuario: 'teste',nome: 'Thiago C L da Silva',  id: 83, email: 'a@a.com', avatar: '83_avatar.jpg'}};
        let valInit = 10;

        this.state = {
            user: params.user,
            parcelaX: '1x',
            q_parcelas: 1,
            parcelaValor: valInit + Number(valInit)*13/100,
            parValue: 1,
            sliderValueJur: valInit + Number(valInit)*13/100,

            sliderValue: valInit,
            inputValue: '',

            isDialogVisible: false

        };
    }





    render() {
        return (
            <View style={styles2.precontainer}>
                <DialogInput isDialogVisible={this.state.isDialogVisible}
                             // keyboardType = 'numeric'
                             textInputProps={{keyboardType:'numeric'}}
                             title={"Insira o valor desejado"}
                             message={"Valor máximo: R$5.000,00"}
                             hintInput ={"ex: 5000"}
                             submitInput={ (inputText) => {
                                 if (Number(inputText) > 5000)
                                     inputText = 5000;
                                 let valor_juros = Number(inputText) +  (Number(inputText) *13 /100);
                                 this.setState({
                                     isDialogVisible: false ,
                                     sliderValue: Number(inputText),
                                     sliderValueJur: valor_juros,

                                     q_parcelas: Math.floor( this.state.parValue ),
                                     parcelaX: String(Math.floor( this.state.parValue )) + 'x',
                                     parcelaValor: valor_juros / Math.floor( this.state.parValue )
                                 });


                                 this.setValueParcela();
                             }  }
                             closeDialog={ () => {this.setState({isDialogVisible: false})}}>
                </DialogInput>


                <View style={styles2.container}>
                    <ScrollView style={{flex: 10}}>
                        <View style={styles2.topView}>
                            <Text style={styles2.font1} >Qual valor gostaria de receber?</Text>
                            <Text style={[styles2.font1, {color: colors.lightgrafit, fontSize: fonts.small}]} >Juros Atual: 13%a.m.</Text>

                            <View style={{backgroundColor: colors.lightgrafit}}>
                                <TextMask
                                    style={styles2.fontValor}
                                    // value={this.state.sliderValue}
                                    value={this.state.sliderValue}
                                    type={'money'}
                                    options={{
                                        unit: 'R$ ',
                                        obfuscated: true
                                    }}
                                    onPress={() => { this.setState({isDialogVisible: true}) }}
                                />
                            </View>


                            {/*<Slider*/}
                                {/*thumbTintColor={colors.red}*/}
                                {/*style={{padding: metrics.padding}}*/}
                                {/*//trackStyle={customStyles7.track}*/}
                                {/*// thumbStyle={customStyles7.thumb}*/}
                                {/*minimumTrackTintColor='#2f2f2f'*/}
                                {/*maximumTrackTintColor='#d3d3d3'*/}
                                {/*minimumValue={50}*/}
                                {/*maximumValue={5000}*/}
                                {/*value={this.state.sliderValue}*/}
                                {/*onValueChange={(value)=> {*/}
                                    {/*let valor_juros = Number(value) +  (Number(value) *13 /100);*/}

                                    {/*this.setState({*/}
                                        {/*sliderValue: value,*/}
                                        {/*sliderValueJur: valor_juros,*/}

                                        {/*q_parcelas: Math.floor( this.state.parValue ),*/}
                                        {/*parcelaX: String(Math.floor( this.state.parValue )) + 'x',*/}
                                        {/*parcelaValor: valor_juros / Math.floor( this.state.parValue )*/}
                                    {/*});*/}

                                {/*} }*/}
                                {/*// maximumTrackTintColor='transparent'*/}
                                {/*// minimumTrackTintColor='transparent'*/}
                            {/*/>*/}

                            <Text style={styles2.font1} >Total com Juros:</Text>

                            <TextMask
                                style={styles2.fontValor}
                                // value={this.state.sliderValue}
                                value={this.state.sliderValueJur}
                                type={'money'}
                                options={{
                                    unit: 'R$ ',
                                    obfuscated: true
                                }}
                            />




                            <Text style={styles2.font1} >Parcelas:</Text>
                            <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between',}}>
                                <Text
                                    style={styles2.fontValorParcela}>
                                    {this.state.parcelaX}
                                </Text>
                                <TextMask
                                    style={styles2.fontValorParcela}
                                    // value={this.state.sliderValue}
                                    value={this.state.parcelaValor}
                                    type={'money'}
                                    options={{
                                        unit: 'R$ ',
                                        obfuscated: true
                                    }}
                                />
                            </View>

                            <Slider
                                thumbTintColor={colors.grafit}
                                style={{padding: metrics.padding}}
                                //trackStyle={customStyles7.track}
                                // thumbStyle={customStyles7.thumb}
                                minimumTrackTintColor='#2f2f2f'
                                maximumTrackTintColor='#d3d3d3'
                                minimumValue={1}
                                maximumValue={12.99}
                                value={this.state.parValue}
                                onValueChange={(value)=> {
                                    this.setState({ parValue: value});
                                    this.setValueParcela();
                                }}
                                // maximumTrackTintColor='transparent'
                                // minimumTrackTintColor='transparent'
                            />


                        </View>
                        <View style={styles2.bottomBtns}>
                            <Button
                                title="Voltar"
                                buttonStyle={{ marginTop: 20 }}
                                onPress={() => {this.props.navigation.goBack()}}
                            />
                            <Button
                                title="Efetuar Pedido"
                                buttonStyle={{ marginTop: 20 }}
                                onPress={() => {
                                    this.efetuarPedido();
                                    // this.props.navigation.navigate('CadBank',  {user: this.state.user} )
                                    // this.props.navigation.navigate('AddCartao',  {user: this.state.user} )
                                }}
                            />
                        </View>
                    </ScrollView>

                </View>
            </View>

        );
    }


    efetuarPedido = () =>{
        //verifica se usuario ja possui cadastros de recebedor e de conta de banco
        if (this.state.user.id_pagarme_recebedor){
            //se tiver vai pro checkout
            this.props.navigation.navigate('AddCartao',  {user: this.state.user, amount: this.state.sliderValueJur} )
        }else{
            //se nao tiver vmai pro cadastro de conta bancaria
            alert("Deve-se cadastrar uma conta bancária para depósito");
            this.props.navigation.navigate('CadBank',  {user: this.state.user, amount: this.state.sliderValueJur} )
        }
    };

    setValueParcela = () =>{
        // if (this.state.q_parcelas !== Math.floor( this.state.parValue ) )
        {
            this.setState({
                q_parcelas: Math.floor( this.state.parValue ),
                parcelaX: String(Math.floor( this.state.parValue )) + 'x',
                parcelaValor: this.state.sliderValueJur / Math.floor( this.state.parValue )
            });
        }
        // console.log(this.state);

    };
}

const styles2 = StyleSheet.create({
    precontainer: {
        backgroundColor: colors.grafit,
        flex:1,
        alignItems: 'center',


        // flexDirection: 'column',
        // justifyContent: 'space-between',
        // alignItems: 'flex-end',
        //  justifyContent: 'center',
    },
    container: {
        padding: metrics.padding,
        flex: 1,
        width: 300,
        backgroundColor: colors.backgr,


        // flexDirection: 'column',
        justifyContent: 'space-between',
        // justifyContent: 'center',
        alignItems: 'center',

    },
    topView: {
        flex:1,
        justifyContent: 'space-between',
    },
    bottomBtns:{
        // flex:1,
        // height: 500,
        // backgroundColor: colors.red,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },

    tile :{
        height: 50,
    },
    font1: {
        fontFamily: 'sans-serif',
        color: colors.grafit,
        fontSize: fonts.big,
    },
    font2:{
        color: colors.green,
        fontSize: fonts.regular,
    },
    fontValor: {
        padding: metrics.padding2,
        fontFamily: 'sans-serif-medium',
        color: colors.red,
        fontSize: fonts.bigger,
        alignSelf: "center"
    },
    fontValorParcela: {
        fontFamily: 'sans-serif-medium',
        color: colors.grafit,
        fontSize: fonts.bigger,
        alignSelf: "center"
    },
    fontValorCoin: {
        padding: metrics.padding2,
        fontFamily: 'sans-serif-medium',
        color: colors.red,
        fontSize: fonts.bigger,
        alignSelf: "center"
    }


});




