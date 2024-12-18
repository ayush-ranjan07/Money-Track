import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native';
import { ExpenseContext } from '../../ExpenseContext';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const AnalyticsScreen = () => {
    const { expenses } = useContext(ExpenseContext);
    const [selectedDate, setSelectedDate] = useState(new Date()); // State for the selected date

    // Filter expenses based on the selected month and year
    const expensesForSelectedDate = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
            expenseDate.getFullYear() === selectedDate.getFullYear() &&
            expenseDate.getMonth() === selectedDate.getMonth()
        );
    });

    // Calculate total expenses for the selected month
    const totalExpense = expensesForSelectedDate.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );

    // Calculate category totals
    // Calculate category totals
const categoryTotals = expensesForSelectedDate.reduce((acc, expense) => {
    const category = (expense.category || 'Uncategorized').trim().toLowerCase(); // Normalize category
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
}, {});


    // Prepare data for the PieChart
    const pieData = Object.keys(categoryTotals).map((category, index) => ({
        name: category,
        amount: categoryTotals[category],
        color: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)}, 0.8)`, // Generate random colors
        legendFontColor: '#fff',
        legendFontSize: 12,
    }));

    const screenWidth = Dimensions.get('window').width;

    // Function to navigate between months
    const navigateDate = (direction) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setSelectedDate(newDate);
    };

    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../../assets/analytics.png')} />


            {/* Date Navigation */}
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

            {/* Total Expense */}
            <View style={styles.totalExpenseContainer}>
                <Text style={styles.totalExpenseText}>Total Expense: ₹{totalExpense.toFixed(2)}</Text>
            </View>

            {/* Display PieChart */}
            {pieData.length === 0 ? (
                <Text style={styles.noDataText}>No data available. Add some expenses!</Text>
            ) : (
                <PieChart
                    data={pieData}
                    width={screenWidth - 32} // Dynamic width
                    height={220}
                    chartConfig={{
                        backgroundColor: '#000',
                        backgroundGradientFrom: '#1E90FF',
                        backgroundGradientTo: '#000080',
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    }}
                    accessor="amount"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
            )}

            {/* Display Category Data */}
            <FlatList
                data={pieData}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        <Text style={styles.itemAmount}>₹{Number(item.amount).toFixed(2)}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'black',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
        color: '#fff',
    },
    dateNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    dateText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
    },
    totalExpenseContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    totalExpenseText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00FF00',
    },
    noDataText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#1F1F1F',
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        borderWidth:2,
        borderColor:'#F3FF90'
    },
    itemText: {
        fontSize: 18,
        color: '#fff',
    },
    itemAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#06D001',
    },
    logo:{width:140,height:30,marginBottom: 15,marginTop: 25},
});

export default AnalyticsScreen;
