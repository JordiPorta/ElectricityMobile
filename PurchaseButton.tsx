import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface PurchaseButtonProps {
    name: string;
    baseCost: number;
    currentAmount: number;
    setAmount: React.Dispatch<React.SetStateAction<number>>;
    electricitatActual: number;
    getCostForItem: (baseCost: number, currentAmount: number, scaleFactor?: number) => number;
    buyItem: (baseCost: number, currentAmount: number, setAmount: React.Dispatch<React.SetStateAction<number>>, scaleFactor?: number) => void;
}

export const PurchaseButton: React.FC<PurchaseButtonProps> = ({
    name,
    baseCost,
    currentAmount,
    setAmount,
    electricitatActual,
    getCostForItem,
    buyItem
}) => {
    const cost = getCostForItem(baseCost, currentAmount);

    return (
        <TouchableOpacity
            style={[styles.purchaseButton, electricitatActual < cost && styles.disabledButton]}
            onPress={() => buyItem(baseCost, currentAmount, setAmount)}
            disabled={electricitatActual < cost}
        >
            <Text style={styles.buttonText}>{name}</Text>
            <Text style={styles.infoText}>Cost: {cost}</Text>
            <Text style={styles.infoText}>Quantitat: {currentAmount}</Text>
        </TouchableOpacity>
    );
};

// Añade tus estilos
const styles = StyleSheet.create({
    purchaseButton: {
        backgroundColor: '#FFA500',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    disabledButton: {
        backgroundColor: '#C0C0C0',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    infoText: {
        color: 'white',
        fontSize: 16,
    }
});
