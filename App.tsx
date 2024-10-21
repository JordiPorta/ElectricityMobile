import React, { useCallback, useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View } from 'react-native';
import BottomSheet, { BottomSheetView, TouchableOpacity } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Image } from 'react-native';


export default function App() {
    const sheetRef = useRef<BottomSheet>(null);
    const [isOpen, setIsOpen] = useState(true);
    const [electricitatActual, setScore] = useState(0);
    const [nRodesDeHamster, setRodesDeHamster] = useState(0);
    const [nGeneradors, setGeneradors] = useState(0);

    const snapPoints = ["90%"];

    const calculateGainPerClick = () => {
        return 1 + 0.1 * nRodesDeHamster;
    }

    const calculatePassiveElectricity = () => {
        return nGeneradors * 0.5;
    };

    let requestID: any;
    const startAnimation = () => {
        // Animation using requestAnimationFrame
        let lastUpdateTime = Date.now();
        
        function playAnimation() {
            const now = Date.now();
            const deltaTime = (now - lastUpdateTime) / 1000;
            lastUpdateTime = now;

            setScore(prevScore => prevScore + calculatePassiveElectricity() * deltaTime);
            
            requestID = requestAnimationFrame(playAnimation);
        }
        requestAnimationFrame(playAnimation);
    };

    useEffect(() => {
        startAnimation(); // Start the animation when the component mounts
    
        return () => {
            cancelAnimationFrame(requestID); // Clean up on unmount
        };
    }, [nGeneradors]);


    const handleSnapPress = useCallback((index: any) => {
        sheetRef.current?.snapToIndex(index);
        setIsOpen(true);
    }, []);

    const changeScore = (amount: number) => {
        setScore(prevScore => prevScore + amount);
    };

    const isItemBuyable = (cost: number) => {
        return electricitatActual >= cost;
    };

    const getCostForRodaHamster = () => {
        return Math.floor(15 * Math.pow(1.15, nRodesDeHamster)); // Exponential cost scaling
    };

    const buyRodaHamster = () => {
        const cost = getCostForRodaHamster();
        if (isItemBuyable(cost)) {
            changeScore(-cost);
            setRodesDeHamster(prevRodes => prevRodes + 1);
        }
    };

    const getCostForGenerador = () => {
        return Math.floor(100 * Math.pow(1.2, nGeneradors)); // Exponential cost scaling
    };

    const buyGeneradorEnergia = () => {
        const cost = getCostForGenerador();
        if (isItemBuyable(cost)) {
            changeScore(-cost);
            setGeneradors(prevGens => prevGens + 1);
        }
    };

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
            <Text style={styles.scoreText}>Electricitat: {electricitatActual.toFixed(1)}</Text>
            <Text style={styles.scoreText}>Electricitat / s: {calculatePassiveElectricity().toFixed(2)}</Text>

            {/* Main Botó */}
            <TouchableOpacity style={styles.incrementButton} onPress={() => changeScore(calculateGainPerClick())}>
                <Image 
                    source={require('./electricButton.png')} 
                    style={styles.clicker} 
                />
            </TouchableOpacity>

            {/* Botó obrir desplegable */}
            <TouchableOpacity style={styles.button} onPress={() => handleSnapPress(0)}>
                <Image 
                    source={require('./arrow.png')} 
                    style={styles.icon} 
                />
            </TouchableOpacity>
            {/* Bottom Sheet (zona de compres) */}
            <BottomSheet ref={sheetRef} snapPoints={snapPoints} enablePanDownToClose={true} onClose={() => setIsOpen(false)}>
                <BottomSheetView style={styles.bottomSheetContent}>
                <TouchableOpacity style={[styles.purchaseButton, electricitatActual < getCostForRodaHamster() && styles.disabledButton]} 
                                  onPress={() => buyRodaHamster()} 
                                  disabled={electricitatActual < getCostForRodaHamster()}>
                    <Text style={styles.buttonText}>Roda de Hamster</Text>
                    <Text style={styles.infoText}>Cost: {getCostForRodaHamster()}</Text>
                    <Text style={styles.infoText}>Cantitat: {nRodesDeHamster}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.purchaseButton, electricitatActual < getCostForGenerador() && styles.disabledButton]}
                                  onPress={() => buyGeneradorEnergia()} 
                                  disabled={electricitatActual < getCostForGenerador()}>
                    <Text style={styles.buttonText}>Generador d'Energia</Text>
                    <Text style={styles.infoText}>Cost: {getCostForGenerador()}</Text>
                    <Text style={styles.infoText}>Cantitat: {nGeneradors}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.purchaseButton, electricitatActual < 30 && styles.disabledButton]} disabled={electricitatActual < 30}>
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
        backgroundColor: '#343747',
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
        color: 'white',
        marginBottom: 20,
    },
    incrementButton: {
        paddingHorizontal: 24,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 0,
        width: '80%'
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
        bottom: '-300%',  // Fet amb percentatges per ser responsive, s'ha de provar en altres dispositius
        alignSelf: 'center', 
        padding: '3%',  
        borderRadius: 8,  
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    infoText: {
        color: 'white',
        fontSize: 16,
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
    icon: {
        width: '8%',  // Ícono ocupará el 10% del ancho de la pantalla
        height: undefined, // Para mantener la proporción
        aspectRatio: 1,    // Mantener la relación de aspecto cuadrada
        resizeMode: 'contain', // Asegura que la imagen se ajuste correctamente dentro del contenedor
    },
    clicker:{
        width: '100%', 
        height: undefined,
        aspectRatio: 1,  // Mantener proporción de la imagen
        resizeMode: 'contain',
    },
});