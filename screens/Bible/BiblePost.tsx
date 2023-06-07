import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


function BiblePost({route, navigation}) {
    const { selectedVerses } = route.params;
    const [userOpinion, setUserOpinion] = useState("");

    const postOpinion = () => {
        // Function to handle the posting of the user opinion to the database
        console.log(userOpinion);
    }
    console.log(selectedVerses);
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"} 
                style={styles.keyboardAvoidingView}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={32} style={styles.backArrow}/>
                </TouchableOpacity>
                <Text style={styles.title}>Create a revelation</Text>
            
                
                {
                    selectedVerses && selectedVerses.map((verse, index) => (
                        <View key={index} style={styles.verseContainer}>
                            <Text style={styles.text}>{'"' + verse.text + '"'}</Text>
                            <Text style={styles.reference}>{verse.book + " " + verse.chapter + ":" + verse.verse}</Text>
                        </View>
                    ))
                }
                <TextInput
                    style={styles.input}
                    onChangeText={setUserOpinion}
                    value={userOpinion}
                    placeholder="Enter your opinion on the verse..."
                    multiline
                />
                <TouchableOpacity style={styles.buttonContainer} onPress={postOpinion}>
                    <Text style={styles.buttonText}>Post</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 10,
        marginTop: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    verseContainer: {
        marginBottom: 20,
    },
    text: {
        fontStyle: 'italic',
    },
    reference: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 18,
    },
    input: {
        height: 200,
        width: '100%',
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
    },
    buttonContainer: {
        marginTop: 20,
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    backArrow: {
        marginBottom: 20,
    }
});

export default BiblePost;