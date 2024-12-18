import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const DailySplashScreen = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainApp' }], 
            });
        }, 5000);

        return () => clearTimeout(timer); 
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image 
                style={styles.splash} 
                source={require('../../assets/splash.png')} 
                resizeMode="cover" 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#101010', 
    },
    splash: {
        height: height, 
        width: width,
    }
});

export default DailySplashScreen;
