import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface PurchaseButtonProps {
    name: string;
    description?: string; // Nueva propiedad para la descripción
    baseCost: number;
    currentAmount: number;
    setAmount: React.Dispatch<React.SetStateAction<number>>;
    electricitatActual: number;
    getCostForItem: (baseCost: number, currentAmount: number, scaleFactor?: number) => number;
    buyItem: (baseCost: number, currentAmount: number, setAmount: React.Dispatch<React.SetStateAction<number>>, scaleFactor?: number) => void;
}

export const PurchaseButton: React.FC<PurchaseButtonProps> = ({
    name,
    description, // Descripción opcional
    baseCost,
    currentAmount,
    setAmount,
    electricitatActual,
    getCostForItem,
    buyItem
}) => {
    const cost = getCostForItem(baseCost, currentAmount);
    const isAffordable = electricitatActual >= cost;

    return (
        <TouchableOpacity
            style={[styles.purchaseButton, !isAffordable && styles.disabledButton]}
            onPress={() => buyItem(baseCost, currentAmount, setAmount)}
            disabled={!isAffordable}
        >
            <Text style={styles.buttonText}>{name}</Text>
            {description && <Text style={styles.descriptionText}>{description}</Text>}
            <Text style={styles.infoText}>Cost: {cost}</Text>
            <Text style={styles.infoText}>Quantitat: {currentAmount}</Text>
        </TouchableOpacity>
    );
};

// Estilos mejorados
const styles = StyleSheet.create({
    purchaseButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    disabledButton: {
        backgroundColor: '#A9A9A9',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    descriptionText: {
        color: '#d3d3d3',
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
    },
    infoText: {
        color: 'white',
        fontSize: 16,
        marginTop: 3,
    },
});
