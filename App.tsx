import React, { useCallback, useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from 'react-native';
import BottomSheet, { BottomSheetView, TouchableOpacity } from "@gorhom/bottom-sheet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Progress from 'react-native-progress';
import { PurchaseButton } from './PurchaseButton';

export default function App() {
    const sheetRef = useRef<BottomSheet>(null);
    const [isOpen, setIsOpen] = useState(true);
    const [electricitatActual, setScore] = useState(0);
    const [nRodesDeHamster, setRodesDeHamster] = useState(0);
    const [nGeneradors, setGeneradors] = useState(0);
    const [nPanellsSolars, setPanells] = useState(0);
    const [nCentralsNuclears, setCentralsNuclears] = useState(0);
    const [nAcceleradorsParticules, setAcceleradorsParticules] = useState(0);
    const [progress, setProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(false);
    const baseCosts = {rodaHamster: 15, generador: 100, panellSolar: 500, centralNuclear: 1000, acceleradorParticules: 2000};

    const snapPoints = ["90%"];

    // Carregar les dades (punts i items comprats) guardades a AsyncStorage al iniciar
    useEffect(() => {
        const loadProgress = async () => {
            try {
                const storedProgress = await AsyncStorage.getItem('@gameProgress');
                if (storedProgress) {
                    const progress = JSON.parse(storedProgress);
                    setScore(progress.electricitatActual || 0);
                    setRodesDeHamster(progress.nRodesDeHamster || 0);
                    setGeneradors(progress.nGeneradors || 0);
                    setPanells(progress.nPanellsSolars || 0);
                    setCentralsNuclears(progress.nCentralsNuclears || 0);
                    setAcceleradorsParticules(progress.nAcceleradorsParticules || 0);
                    setShowProgress(progress.showProgress || false);
                }
            } catch (error) {
                console.error("Error loading progress from AsyncStorage:", error);
            }
        };
        loadProgress();
    }, []);

    // Guardar el progres en AsyncStorage per cada canvi relevant
    useEffect(() => {
        const saveProgress = async () => {
            try {
                const progress = {
                    electricitatActual,
                    nRodesDeHamster,
                    nGeneradors,
                    nPanellsSolars,
                    nCentralsNuclears,
                    nAcceleradorsParticules,
                    showProgress
                };
                await AsyncStorage.setItem('@gameProgress', JSON.stringify(progress));
            } catch (error) {
                console.error("Error saving progress to AsyncStorage:", error);
            }
        };
        saveProgress();
    }, [electricitatActual, nRodesDeHamster, nGeneradors, nPanellsSolars, nCentralsNuclears, nAcceleradorsParticules, showProgress]);

    // Efecto para iniciar la barra de progreso
    useEffect(() => {
        if (nAcceleradorsParticules > 0) {
            setShowProgress(true); // Muestra la barra al comprar un acelerador
            setProgress(0); // Reinicia el progreso

            const interval = setInterval(() => {
                setProgress(prevProgress => {
                    if (prevProgress >= 1) {
                        clearInterval(interval);
                        setShowProgress(false); // Oculta la barra al terminar el tiempo
                        return 1;
                    }
                    return prevProgress + 1 / 30; // Incremento para completar en 30 segundos
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [nAcceleradorsParticules]);


    //calculem el que es genera per click basat en els items comprats
    const calculateGainPerClick = () => {
        const baseGain = 1 + 0.1 * nRodesDeHamster + 5 * nCentralsNuclears;
        return showProgress ? baseGain * 2 : baseGain;
    };
    //calculem el que es genera automaticament basat en els items
    const calculatePassiveElectricity = () => {
        const baseElectricity = nGeneradors * 0.5 + 2 * nPanellsSolars;
        return showProgress ? baseElectricity * 2 : baseElectricity;
    };

    let requestID: number;
    const startAnimation = () => {
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
        startAnimation();
    
        return () => {
            cancelAnimationFrame(requestID);
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

                {/* Mostrem la barra només si hi ha acceleradors de particules */}
                {showProgress && (
                   <Progress.Bar style={styles.progressBar} progress={progress} />
                )}

                {/* Botó principal */}
                <TouchableOpacity style={styles.incrementButton} onPress={() => changeScore(calculateGainPerClick())}>
                    <Image 
                        source={require('./electricButton.png')} 
                        style={styles.clicker} 
                    />
                </TouchableOpacity>

                {/* Botó per obrir el desplegable */}
                <TouchableOpacity style={styles.button} onPress={() => handleSnapPress(0)}>
                    <Image 
                        source={require('./arrow.png')} 
                        style={styles.icon} 
                    />
                </TouchableOpacity>

                {/* Bottom Sheet per comprar */}
                <BottomSheet ref={sheetRef} snapPoints={snapPoints} enablePanDownToClose={true} onClose={() => setIsOpen(false)}>
                    <BottomSheetView style={styles.bottomSheetContent}>
                        <PurchaseButton
                            name="Roda de Hamster"
                            description="Genera més electricitat per cada clic."
                            baseCost={baseCosts["rodaHamster"]}
                            currentAmount={nRodesDeHamster}
                            setAmount={setRodesDeHamster}
                            electricitatActual={electricitatActual}
                            getCostForItem={getCostForItem}
                            buyItem={buyItem}
                        />

                        <PurchaseButton
                            name="Generador d'Energia"
                            description="Genera electricitat per segon automàticament."
                            baseCost={baseCosts["generador"]}
                            currentAmount={nGeneradors}
                            setAmount={setGeneradors}
                            electricitatActual={electricitatActual}
                            getCostForItem={getCostForItem}
                            buyItem={buyItem}
                        />

                        <PurchaseButton
                            name="Panell Solar"
                            description="Genera encara més electricitat per segon."
                            baseCost={baseCosts["panellSolar"]}
                            currentAmount={nPanellsSolars}
                            setAmount={setPanells}
                            electricitatActual={electricitatActual}
                            getCostForItem={getCostForItem}
                            buyItem={buyItem}
                        />

                        <PurchaseButton
                            name="Central Nuclear"
                            description="Genera encara més electricitat per clic."
                            baseCost={baseCosts["centralNuclear"]}
                            currentAmount={nCentralsNuclears}
                            setAmount={setCentralsNuclears}
                            electricitatActual={electricitatActual}
                            getCostForItem={getCostForItem}
                            buyItem={buyItem}
                        />

                        <PurchaseButton
                            name="Accelerador de partícules"
                            description="Durant 30 segons generes el doble"
                            baseCost={baseCosts["acceleradorParticules"]}
                            currentAmount={nAcceleradorsParticules}
                            setAmount={setAcceleradorsParticules}
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
        width: '8%',  
        height: undefined, 
        aspectRatio: 1,    
        resizeMode: 'contain', 
    },
    clicker:{
        width: '100%', 
        height: undefined,
        aspectRatio: 1,  
        resizeMode: 'contain',
    },
    progressBar: {
        width: 200,
        height: 10,
        borderColor: 'white',
        borderWidth: 2,
        
    },
});