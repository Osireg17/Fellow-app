import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { database } from '../../config/firebase';

function BiblePost({route, navigation}) {
    const { selectedVerses } = route.params;
    console.log(selectedVerses);

    return (
        <View style={styles.container}>
            {
                selectedVerses && selectedVerses.map((verse, index) => {
                    return (
                        <Text key={index} style={styles.text}>{verse.text}</Text>
                    );
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        textAlign: 'center',
    },
});

export default BiblePost;
