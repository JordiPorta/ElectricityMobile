import React, { useCallback, useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View } from 'react-native';
import BottomSheet, { BottomSheetView, TouchableOpacity } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Image } from 'react-native';
import { PurchaseButton } from './PurchaseButton';


export default function App() {
    const sheetRef = useRef<BottomSheet>(null);
    const [isOpen, setIsOpen] = useState(true);
    const [electricitatActual, setScore] = useState(0);
    const [nRodesDeHamster, setRodesDeHamster] = useState(0);
    const [nGeneradors, setGeneradors] = useState(0);
    const [nPanellsSolars, setPanells] = useState(0);
    const [nCentralsNuclears, setCentralsNuclears] = useState(0);

    const baseCosts = {rodaHamster: 15, generador: 100, panellSolar: 500}

    const snapPoints = ["90%"];

    const calculateGainPerClick = () => {
        return 1 + 0.1 * nRodesDeHamster;
    }

    const calculatePassiveElectricity = () => {
        return nGeneradors * 0.5 + 2 * nPanellsSolars;
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

    const getCostForItem = (baseCost: number, currentAmount: number, scaleFactor: number = 1.15): number => {
        return Math.floor(baseCost * Math.pow(scaleFactor, currentAmount));
    };
    
    const buyItem = (baseCost: number, currentAmount: number, setAmount: React.Dispatch<React.SetStateAction<number>>, scaleFactor: number = 1.15) => {
        const cost = getCostForItem(baseCost, currentAmount, scaleFactor);
        if (isItemBuyable(cost)) {
            changeScore(-cost);
            setAmount((prevAmount: number) => prevAmount + 1);
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
                    <PurchaseButton
                        name="Roda de Hamster"
                        baseCost={baseCosts["rodaHamster"]}
                        currentAmount={nRodesDeHamster}
                        setAmount={setRodesDeHamster}
                        electricitatActual={electricitatActual}
                        getCostForItem={getCostForItem}
                        buyItem={buyItem}
                    />

                    <PurchaseButton
                        name="Generador d'Energia"
                        baseCost={baseCosts["generador"]}
                        currentAmount={nGeneradors}
                        setAmount={setGeneradors}
                        electricitatActual={electricitatActual}
                        getCostForItem={getCostForItem}
                        buyItem={buyItem}
                    />

                    <PurchaseButton
                        name="Panell Solar"
                        baseCost={baseCosts["panellSolar"]}
                        currentAmount={nPanellsSolars}
                        setAmount={setPanells}
                        electricitatActual={electricitatActual}
                        getCostForItem={getCostForItem}
                        buyItem={buyItem}
                    />
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
    button: {
        bottom: '-300%',  // Fet amb percentatges per ser responsive, s'ha de provar en altres dispositius
        alignSelf: 'center', 
        padding: '3%',  
        borderRadius: 8,  
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