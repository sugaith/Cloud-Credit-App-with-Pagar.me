import {StyleSheet} from 'react-native';
import metrics from '../styles/metrics';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export const styles = StyleSheet.create({
    precontainerLight: {
        backgroundColor: colors.lightgrafit,
        flex:1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    precontainerGrafit: {
        backgroundColor: colors.grafit,
        flex:1,
        // alignItems: 'center',

        // alignItems: 'flex-end',
        //  justifyContent: 'center',
    },
    containerLight: {
        flex: 1,
        width: 300,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgr,
        alignSelf: 'center',
    },
    containerGrafit: {
        flex: 1,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.grafit,
        // alignSelf: 'center',
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
    button: {
        // alignSelf: 'stretch',
        alignItems: 'center',
        padding: metrics.padding,
        paddingHorizontal: metrics.paddingH,
        backgroundColor: colors.lightgrafit,
    },
    buttonTxt: {
        fontSize: fonts.regular,
        color: colors.white,
        fontWeight: 'bold'
    },

    text1: {
        fontSize: fonts.big,
        textAlign: 'center',
        color: colors.white,

    },
    text2: {
        textAlign: 'center',
        color: colors.white,
    },
    text3: {
        textAlign: 'center',
        color: colors.white,
        fontSize: fonts.regular,

    },
    text1b: {
        fontSize: fonts.big,
        textAlign: 'center',
        color: colors.grafit,

    },
    text2b: {
        textAlign: 'center',
        color: colors.grafit,
    },
    text3b: {
        textAlign: 'center',
        color: colors.grafit,
        fontSize: fonts.smaller,

    },
});