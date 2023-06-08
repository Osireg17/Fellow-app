import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { database } from '../../config/firebase';
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import RNPickerSelect from "react-native-picker-select";


function BiblePost({route, navigation}) {
    const { selectedVerses } = route.params;
    const [userOpinionTitle, setUserOpinionTitle] = useState("");
    const [userOpinion, setUserOpinion] = useState("");
    const [postType, setPostType] = useState("");

    const postOpinion = async () => {
        if (userOpinion === "" || postType === "") {
            alert("Please enter an opinion and select a post type.");
            return;
        }

        try {
            const auth = getAuth();
            const uid = auth.currentUser.uid;

            // I want the timestamp to be in the format of "2021-10-10 10:10:10 and I want it to be in the user's timezone"

            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();

            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();

            const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            const postData = {
                userOpinionTitle,
                userOpinion,
                postType,
                BibleInformation: selectedVerses.map(verse => ({
                    BibleBook: verse.book,
                    BibleChapter: verse.chapter,
                    BibleVerse: verse.verse,
                    BibleText: verse.text,
                })),
                timestamp,
                uid,
                praises: 0,
                comments: 0,
            };
            
            const collectionPath = postType === "public" ? "publicPosts" : "privatePosts";

            await addDoc(collection(database, collectionPath), postData);

            alert("Post successful");
            navigation.goBack();

        } catch (error) {
            console.log(error);
        }

    };
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
                    style={styles.TitleInput}
                    onChangeText={setUserOpinionTitle}
                    value={userOpinionTitle}
                    placeholder="Enter a title for your opinion..."
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setUserOpinion}
                    value={userOpinion}
                    placeholder="Enter your opinion on the verse..."
                    multiline={true}
                />
               <RNPickerSelect
                onValueChange={(value) => setPostType(value)}
                items={[
                    { label: "Public", value: "public" },
                    { label: "Private", value: "private" },
                ]}
                placeholder={{
                    label: "Select a post type...",
                    value: null,
                }}
                style={pickerSelectStyles}
                value={postType}
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
    TitleInput: {
        height: 40,
        width: '100%',
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000',
    },
    input: {
        height: 100,
        width: '100%',
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000',
    },
    buttonContainer: {
        marginTop: 40,
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

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        marginTop: 20,
    },
    // Similar styling for Android
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        marginTop: 20, // to ensure the text is never behind the icon
    },
});

export default BiblePost;