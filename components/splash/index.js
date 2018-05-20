import React from 'react';
import { View, Text, Image } from 'react-native';
import { SplashStyles } from '../../assets/styles/main';

export default Splash = () => {
    return (
        <View style={SplashStyles.wrapper}>
            <View style={SplashStyles.titleWrapper}>
                <View style={SplashStyles.title}>
                    <Image source={require('../../assets/img/logo.png')}/>
                </View>
                <View>
                    <Text style={SplashStyles.loading}>Loading...</Text>
                </View>
            </View>
            <View>
                <Text style={SplashStyles.suplier}>by mmVirtual</Text>
            </View>
        </View>
    );
}