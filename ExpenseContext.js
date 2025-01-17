import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const loadExpenses = async () => {
            const savedExpenses = await AsyncStorage.getItem('expenses');
            const expenseList = savedExpenses ? JSON.parse(savedExpenses) : [];
            setExpenses(expenseList);
        };

        loadExpenses();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem('expenses', JSON.stringify(expenses));
    }, [expenses]);

    return (
        <ExpenseContext.Provider value={{ expenses, setExpenses }}>
            {children}
        </ExpenseContext.Provider>
    );
};
