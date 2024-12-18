import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Modal,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExpenseContext } from '../../ExpenseContext';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList from 'react-native-draggable-flatlist';

const HomeScreen = () => {
    const { expenses, setExpenses } = useContext(ExpenseContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [newExpense, setNewExpense] = useState({
        title: '',
        amount: '',
        category: '',
        date: new Date(),
    });
    const [editingExpense, setEditingExpense] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {
        const savedExpenses = await AsyncStorage.getItem('expenses');
        const expenseList = savedExpenses ? JSON.parse(savedExpenses) : [];
        setExpenses(expenseList);
    };

    const saveExpenses = async (updatedExpenses) => {
        setExpenses(updatedExpenses);
        await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    };

    const addOrEditExpense = async () => {
        if (!newExpense.title || !newExpense.amount) return;

        let updatedExpenses;
        const numericAmount = parseFloat(newExpense.amount);

        if (editingExpense) {
            updatedExpenses = expenses.map((expense) =>
                expense.id === editingExpense.id
                    ? { ...expense, ...newExpense, amount: numericAmount }
                    : expense
            );
        } else {
            updatedExpenses = [
                ...expenses,
                {
                    id: Date.now(),
                    ...newExpense,
                    amount: numericAmount,
                },
            ];
        }

        saveExpenses(updatedExpenses);
        resetModal();
    };

    const deleteExpense = (id) => {
        Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
                    saveExpenses(updatedExpenses);
                },
            },
        ]);
    };

    const resetModal = () => {
        setNewExpense({ title: '', amount: '', category: '', date: new Date() });
        setEditingExpense(null);
        setModalVisible(false);
    };

    const expensesForSelectedDate = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
            expenseDate.getFullYear() === selectedDate.getFullYear() &&
            expenseDate.getMonth() === selectedDate.getMonth()
        );
    });

    const navigateDate = (direction) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setSelectedDate(newDate);
    };

    const handleDateChange = (event, selected) => {
        setShowDatePicker(false);
        if (selected) {
            setNewExpense({ ...newExpense, date: selected });
        }
    };

    const handleDragEnd = ({ data }) => {
        saveExpenses(data);
    };

    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../../assets/logo.png')} />
            <View style={styles.dateNavigation}>
                <TouchableOpacity onPress={() => navigateDate(-1)}>
                    <Ionicons name="chevron-back-circle" size={30} color="#9BEC00" />
                </TouchableOpacity>
                <Text style={styles.dateText}>
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Text>
                <TouchableOpacity onPress={() => navigateDate(1)}>
                    <Ionicons name="chevron-forward-circle" size={30} color="#9BEC00" />
                </TouchableOpacity>
            </View>

            <DraggableFlatList
                data={expensesForSelectedDate}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index, drag, isActive }) => (
                    <TouchableOpacity
                        style={[styles.item, { backgroundColor: isActive ? '#444' : 'black' }]}
                        onLongPress={drag}
                        onPress={() => {
                            setEditingExpense(item);
                            setNewExpense({
                                title: item.title,
                                amount: item.amount.toString(),
                                category: item.category,
                                date: new Date(item.date),
                            });
                            setModalVisible(true);
                        }}
                    >
                        <View >
                            <Text style={styles.itemText}>{item.title}</Text>
                            <Text style={styles.itemCategory}>{item.category}</Text>
                            <Text style={styles.itemDate}>{new Date(item.date).toLocaleString()}</Text>
                        </View>
                        <View style={styles.itemActions}>
                            <Text style={styles.itemAmount}>₹{item.amount}</Text>
                            <TouchableOpacity onPress={() => deleteExpense(item.id)}>
                                <Ionicons name="trash" size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
                onDragEnd={handleDragEnd}
            />

            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {editingExpense ? 'Edit Expense' : 'Add Expense'}
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            placeholderTextColor="#888"
                            value={newExpense.title}
                            onChangeText={(text) => setNewExpense({ ...newExpense, title: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Amount"
                            keyboardType="numeric"
                            placeholderTextColor="#888"
                            value={newExpense.amount}
                            onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Category"
                            placeholderTextColor="#888"
                            value={newExpense.category}
                            onChangeText={(text) => setNewExpense({ ...newExpense, category: text })}
                        />
                        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                            <Text style={styles.changeDateText}>
                                Change Date: {newExpense.date.toLocaleString()}
                            </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={newExpense.date}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.saveButton} onPress={addOrEditExpense}>
                                <Text style={styles.saveButtonText}>
                                    {editingExpense ? 'Save' : 'Add'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveButton, styles.cancelButton]}
                                onPress={resetModal}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black', padding: 20 },
    logo:{width:180,height:25,marginBottom: 15,marginTop: 25},
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#0F50CA' },
    dateNavigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginBottom:20 },
    dateText: { color: 'white', fontSize: 25, fontWeight: 'bold' },
    item: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, marginVertical: 5, borderWidth:2,borderColor:'#F3FF90', borderRadius: 15 },
    itemText: { color: 'white', fontSize: 18, fontWeight:'bold' },
    itemCategory: { color: '#9BEC00', fontSize: 14,fontWeight:'bold' },
    itemAmount: { color: '#06D001', fontWeight: 'bold',fontSize:22 },
    itemDate: { color: 'gray', fontSize: 12 },
    itemActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#06D001', padding:0, borderRadius: 50,height:70,width:70,justifyContent:'center',alignItems:'center' },
    fabText: { fontSize: 40, color: 'black' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' },
    modalContent: { backgroundColor: '#222', padding: 30, borderRadius: 10, width: '80%',borderWidth:2,borderColor:'#F3FF90' },
    modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#F3FF90', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#059212', marginBottom: 15, padding: 10, color: 'white', borderRadius: 5 },
    changeDateText: { color: '#9BEC00', textAlign: 'center', marginBottom: 10 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
    saveButton: { backgroundColor: '#06D001', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
    saveButtonText: { color: 'black', fontWeight: 'bold' },
    cancelButton: { backgroundColor: '#F44336' },
    cancelButtonText:{color:'white',fontWeight:'bold'}
});

export default HomeScreen;
