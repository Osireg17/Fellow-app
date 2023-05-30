// BiblePageBottomSheet.js
import React, { forwardRef, useRef, useImperativeHandle, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const BiblePageBottomSheet = forwardRef((props, ref) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['1%','15%', '45%'], []);

  useImperativeHandle(ref, () => ({
    expand: () => {
      bottomSheetRef.current?.expand();
    },
    collapse: () => {
      bottomSheetRef.current?.collapse();
    },
  }));

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create a revelation</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
  },
  button: {
    marginTop: 20,
    width: '80%',
    backgroundColor: '#282C35',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  }
});

export default BiblePageBottomSheet;
