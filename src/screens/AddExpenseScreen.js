import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Alert,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const AddExpenseModal = ({ isVisible, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');

    const handleSave = () => {
        if (!title || !amount || !category) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        onSave({ title, amount: parseFloat(amount), category });
        setTitle('');
        setAmount('');
        setCategory('');
        onClose();
    };

    return (
        <Modal visible={isVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add Expens</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Expense Title"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Amount"
                        value={amount}
                        keyboardType="numeric"
                        onChangeText={setAmount}
                    />
                    <RNPickerSelect
                        onValueChange={(value) => setCategory(value)}
                        items={[
                            { label: 'Food', value: 'Food' },
                            { label: 'Rent', value: 'Rent' },
                            { label: 'Shopping', value: 'Shopping' },
                            { label: 'Transportation', value: 'Transportation' },
                            { label: 'Other', value: 'Other' },
                        ]}
                        placeholder={{ label: 'Select Category', value: null }}
                        style={{
                            inputIOS: styles.pickerInput,
                            inputAndroid: styles.pickerInput,
                        }}
                        value={category}
                    />
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.button} onPress={handleSave}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        margin: 20,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
    pickerInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        padding: 10,
        backgroundColor: '#2196f3',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default AddExpenseModal;
