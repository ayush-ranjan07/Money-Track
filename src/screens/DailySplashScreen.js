import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window'); // Use 'window' instead of 'screens'

const DailySplashScreen = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainApp' }], // Replace 'MainApp' with the correct name for your tab navigator
            });
        }, 5000);

        return () => clearTimeout(timer); // Cleanup on unmount
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image 
                style={styles.splash} 
                source={require('../../assets/splash.png')} 
                resizeMode="cover" // This will maintain the aspect ratio and fill the screen without distortion
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#101010', // Background color can be modified as needed
    },
    splash: {
        height: height,  // Use the height and width from 'window'
        width: width,
    }
});

export default DailySplashScreen;
