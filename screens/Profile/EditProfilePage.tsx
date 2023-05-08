import {Text, View, TextInput, TouchableOpacity, Image, Platform, Alert, Button, KeyboardAvoidingView, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react'
import styles from '../../styles/Profile/EditProfilePage.style'
import { Header as HeaderRNE,  Avatar } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { database } from '../../config/firebase';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FontAwesome, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';


function ProfileHeader({navigation}) {
    return (
        <HeaderRNE
            centerComponent={{ text: 'Edit Profile', style: { color: 'black', fontSize: 20, fontWeight: 'bold' } }}
            containerStyle={{
            backgroundColor: 'white',
            justifyContent: 'space-around',
            }}
        />
        );
    }

function EditProfile({navigation}) {
    const [editUsername, setEditUsername] = useState('');
    const [editChurch, setEditChurch] = useState('');
    const [editFavouriteVerse, setEditFavouriteVerse] = useState('');
    const [editProfilePic, setEditProfilePic] = useState('');
    
    // function to get the users' profile picture from storage, then have them be able to change it
    const pickImage = async () => {
        // ask for permission before going into the image gallery
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
        // open the image gallery
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        // if the user selects an image, upload it to storage
        if (!result.canceled) {
            const auth = getAuth();
            const userId = auth.currentUser.uid;
            const storage = getStorage();
            const storageRef = ref(storage, `profilePictures/${userId}`);
            await uploadBytes(storageRef, result.uri);
            const url = await getDownloadURL(storageRef);
            setEditProfilePic(url);
        }
    };




    useEffect(() => {
        const fetchUserData = async () => {
            const auth = getAuth();
            const userId = auth.currentUser.uid;
            const userDocRef = doc(database, 'user', userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                setEditUsername(userData.username);
                setEditChurch(userData.church);
                setEditFavouriteVerse(userData.favoriteVerse);
                setEditProfilePic(userData.profilePic);
            }
        };

        fetchUserData();
    }, []);

    const editProfile = async () => {
        const auth = getAuth();
        const userId = auth.currentUser.uid;
        const userDocRef = doc(database, 'user', userId);
        await updateDoc(userDocRef, {
            username: editUsername,
            church: editChurch,
            favouriteVerse: editFavouriteVerse,
            profilePic: editProfilePic,
        });
        Alert.alert('Profile Updated!');
        navigation.navigate('Profile');
    }

    return (
        <View style={styles.container}>
            <Avatar
                rounded
                size={120}
                source={{ uri: editProfilePic || 'https://via.placeholder.com/200' }}
                containerStyle={styles.avatar}
            />
            <TextInput
                style={styles.usernameInput}
                placeholder="Username"
                onChangeText={setEditUsername}
                value={editUsername}
            />
            <View style={styles.detailsContainer}>
                <View style={styles.detail}>
                    <Text style={styles.label}>Favorite Verse:</Text>
                    <TextInput
                        style={styles.TextInputLarge}
                        placeholder="Favorite Verse"
                        onChangeText={setEditFavouriteVerse}
                        value={editFavouriteVerse}
                        multiline={true}
                        numberOfLines={4}
                    />
                </View>
                <View style={styles.detail}>
                    <Text style={styles.label}>Church:</Text>
                    <TextInput
                        style={styles.valueInput}
                        placeholder="Church"
                        onChangeText={setEditChurch}
                        value={editChurch}
                    />
                </View>
            </View>
            <TouchableOpacity onPress={editProfile} style={styles.button}>
                <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
}


export default function EditProfilePage({navigation}) {
    return (
        <SafeAreaProvider>
            <ProfileHeader navigation={navigation}/>
            <EditProfile navigation={navigation}/>
        </SafeAreaProvider>
    ) 
}
