import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View } from 'react-native';
import BottomSheet, { BottomSheetView, TouchableOpacity } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
    const sheetRef = useRef<BottomSheet>(null);
    const [isOpen, setIsOpen] = useState(true);
    const [electricitatActual, setScore] = useState(0);

    const snapPoints = ["90%"];

    const handleSnapPress = useCallback((index: any) => {
        sheetRef.current?.snapToIndex(index);
        setIsOpen(true);
    }, []);

    const changeScore = (amount: number) => {
        setScore(prevScore => prevScore + amount);
    };

    const buyItem = (cost: number) => {
        if (electricitatActual >= cost) {
            changeScore(-cost)
            console.log(`Item comprado por ${cost} puntos.`);
        } else {
            console.log("No tienes suficientes puntos para comprar este item.");
        }
    };

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
            <Text style={styles.scoreText}>Electricitat: {electricitatActual}</Text>

            {/* Botó obrir desplegable */}
            <TouchableOpacity style={styles.button} onPress={() => handleSnapPress(0)}>
                <Text style={styles.buttonText}>OBRE DESPLEGABLE</Text>
            </TouchableOpacity>

            {/* Main Botó */}
            <TouchableOpacity style={styles.incrementButton} onPress={() => changeScore(1)}>
                <Text style={styles.buttonText}>Incrementar Score</Text>
            </TouchableOpacity>

            {/* Bottom Sheet (zona de compres) */}
            <BottomSheet ref={sheetRef} snapPoints={snapPoints} enablePanDownToClose={true} onClose={() => setIsOpen(false)}>
                <BottomSheetView style={styles.bottomSheetContent}>
                <TouchableOpacity style={[styles.purchaseButton, electricitatActual < 10 && styles.disabledButton]} onPress={() => buyItem(10)} disabled={electricitatActual < 10}>
                    <Text style={styles.buttonText}>Comprar Item 1 (10 puntos)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.purchaseButton, electricitatActual < 20 && styles.disabledButton]} onPress={() => buyItem(20)} disabled={electricitatActual < 20}>
                    <Text style={styles.buttonText}>Comprar Item 2 (20 puntos)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.purchaseButton, electricitatActual < 30 && styles.disabledButton]} onPress={() => buyItem(30)} disabled={electricitatActual < 30}>
                    <Text style={styles.buttonText}>Comprar Item 3 (30 puntos)</Text>
                </TouchableOpacity>
                </BottomSheetView>
            </BottomSheet>
        </View>
      </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    scoreText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    incrementButton: {
        backgroundColor: '#28A745',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
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
    button: {
        backgroundColor: '#0080FB',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    bottomSheetContent: {
        padding: 20,
        alignItems: 'center',
    },
    bottomSheetText: {
        fontSize: 18,
        marginBottom: 20,
        color: '#333',
    },
});