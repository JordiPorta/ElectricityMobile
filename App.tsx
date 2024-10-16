import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View } from 'react-native';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
    const sheetRef = useRef<BottomSheet>(null);
    const [isOpen, setIsOpen] = useState(true);

    const snapPoints = ["40%", "90%"];

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
            <Text>HOLAAAAA</Text>
            <BottomSheet ref={sheetRef} snapPoints={snapPoints} enablePanDownToClose={true} onClose={() => setIsOpen(false)}>
                <BottomSheetView>
                    <Text>Hello</Text>
                </BottomSheetView>
            </BottomSheet>
        </View>
      </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
    },
});