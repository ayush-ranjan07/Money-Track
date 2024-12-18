import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const UserDetailsScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [currency, setCurrency] = useState('INR');

    const handleSubmit = async () => {
        if (!name || !age || !monthlyIncome || !currency) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        try {
            const userDetails = { name, age, monthlyIncome, currency };
            await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainApp' }],
            });
        } catch (error) {
            console.error('Error saving user details:', error);
            Alert.alert('Error', 'Failed to save user details.');
        }
    };

    return (
        <LinearGradient colors={['#059212', '#000000']} style={styles.gradient}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <Text style={styles.title}>Welcome to MoneyTrack</Text>
                <Text style={styles.subtitle}>Let’s personalize your experience</Text>
                
                <View style={styles.card}>
                    <View style={styles.inputWrapper}>
                        <MaterialIcons name="person" size={20} color="#F3FF90" />
                        <TextInput
                            style={styles.input}
                            placeholder="First Name"
                            placeholderTextColor="#F3FF90"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <MaterialIcons name="calendar-today" size={20} color="#F3FF90" />
                        <TextInput
                            style={styles.input}
                            placeholder="Age"
                            placeholderTextColor="#F3FF90"
                            keyboardType="numeric"
                            value={age}
                            onChangeText={setAge}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <MaterialIcons name="attach-money" size={20} color="#F3FF90" />
                        <TextInput
                            style={styles.input}
                            placeholder="Monthly Income"
                            placeholderTextColor="#F3FF90"
                            keyboardType="numeric"
                            value={monthlyIncome}
                            onChangeText={setMonthlyIncome}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <MaterialIcons name="language" size={20} color="#F3FF90" />
                        <TextInput
                            style={styles.input}
                            placeholder="Preferred Currency (e.g., INR)"
                            placeholderTextColor="#F3FF90"
                            value={currency}
                            onChangeText={setCurrency}
                        />
                    </View>
                </View>
                
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <LinearGradient
                        colors={['#06D001', '#059212']}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>Submit</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        color: '#F3FF90',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#9BEC00',
        textAlign: 'center',
        marginBottom: 30,
    },
    card: {
        backgroundColor: '#1E1E1E',
        padding: 20,
        borderRadius: 15,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        paddingHorizontal: 10,
        borderRadius: 10,
        borderColor: '#9BEC00',
        borderWidth: 1,
        marginBottom: 15,
    },
    input: {
        flex: 1,
        color: '#F3FF90',
        padding: 10,
        fontSize: 16,
    },
    button: {
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 20,
    },
    buttonGradient: {
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default UserDetailsScreen;
