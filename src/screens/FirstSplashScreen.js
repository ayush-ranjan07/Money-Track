import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,SafeAreaView, Image,Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-swiper';
import Button from '../components/Button';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const FirstSplashScreen = ({ navigation }) => {
    const handleGetStarted = async () => {
        await AsyncStorage.setItem('isFirstTime', 'false');
        navigation.replace('UserDetails');
    };

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <View style={styles.slideshow}>
                <Swiper 
                    autoplay
                    autoplayTimeout={4} 
                    showsPagination={true} 
                    loop={true} 
                    paginationStyle={styles.pagination} // Custom pagination style
                    dot={<View style={styles.dot} />} // Inactive dot
                    activeDot={<View style={styles.activeDot} />} // Active dot
                    >
                    <View style={styles.slide}>
                        <Image
                        source={require('../../assets/poster1.png')}
                        style={styles.image}
                        />
                    </View>
                    <View style={styles.slide}>
                        <Image
                        source={require('../../assets/poster2.png')}
                        style={styles.image}
                        />
                    </View>
                    <View style={styles.slide}>
                        <Image
                        source={require('../../assets/poster3.png')}
                        style={styles.image}
                        />
                    </View>
                    <View style={styles.slide}>
                        <Image
                        source={require('../../assets/poster4.png')}
                        style={styles.image}
                        />
                    </View>
                    </Swiper>
                </View>
                <View style={styles.authentication}>
                    <Button onPress={handleGetStarted} title={'Get Started'}/>
                    
                </View>
            </View>  
            </SafeAreaView>
            
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor:'black'
      },
      slideshow: { 
        height:windowHeight*(13/15),
        justifyContent: 'center',
        alignItems: 'center', 
          
      },
      text:{
        color:'white'
      },
      authentication: {
        height:windowHeight*(2/15),
        alignItems: 'center',
      },
      slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      },
      image: {
        width: windowWidth-50,
        height: windowHeight*(12/15),
        resizeMode: 'cover',
        borderRadius:15
      },
      dot: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        width: 8,
        height: 8,
        borderRadius: 4,
        margin: 3,
      },
      activeDot: {
        backgroundColor: '#fff',
        width: 10,
        height: 10,
        borderRadius: 6,
        margin: 3,
      },
      
      pagination: {
        bottom: 40,
        backgroundColor:'rgba(0, 0, 0, 0.5)',
        borderColor:'rgba(0, 0, 0, 0.5)',
        borderRadius:50,
        borderWidth:2,
        alignContent:'center',
        width:80,
        justifyContent:'center',
        marginLeft:windowWidth*1.15/3
      },
      alreadybutton:{
        backgroundColor:'black',
        color:'white',
        borderColor:'white',
      }
});

export default FirstSplashScreen;


