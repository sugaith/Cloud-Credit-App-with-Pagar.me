import {Platform} from 'react-native';

export default {
    padding0: 5,
    padding: 10,
    padding2: 20,
    paddingH: 13,

    ...Platform.select({
        ios: { headerHeight: 64, headerPadding: 20 },

        android: { headerHeight: 44, headerPadding: 0 },
    }),

    tabBarHeight: 50,
}