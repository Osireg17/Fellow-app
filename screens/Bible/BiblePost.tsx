import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { database } from '../../config/firebase';

function BiblePost({route, navigation}) {
    const { selectedVerses } = route.params;

    console.log('selectedVerses', selectedVerses);

    return (
      <View>
        <Text>
          Selected Verses: {JSON.stringify(selectedVerses)}
        </Text>
        {
            selectedVerses && selectedVerses.map((verse, index) => {
                return (
                    <Text key={index}>{verse.verse}</Text>
                )
            })
        }
      </View>
    )
}


const styles = StyleSheet.create({})

export default BiblePost