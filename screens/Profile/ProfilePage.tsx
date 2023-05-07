import {Text, View, TextInput, TouchableOpacity, Image, Platform, Alert, Button, KeyboardAvoidingView, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react'
import styles from '../../styles/Profile/profilePage.style'
import { Header as HeaderRNE,  Avatar } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { database } from '../../config/firebase';
import { doc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as Clipboard from 'expo-clipboard';
import { DrawerActions } from '@react-navigation/native';


function ProfileHeader({ navigation }) {
  // open the drawer when the menu icon is pressed
  const openMenu = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  return (
    <HeaderRNE
      rightComponent={
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('EditProfilePage');
            }}
          >
            <MaterialCommunityIcons name="pencil" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={openMenu}>
            <Feather name="menu" size={24} color="black" />
          </TouchableOpacity>
        </View>
      }
      containerStyle={{
        backgroundColor: 'white',
        justifyContent: 'space-around',
      }}
    />
  );
}

function UserProfile() {
  const [username, setUsername] = useState('');
  const [connections, setConnections] = useState([]);
  const [praises, setPraises] = useState([]);
  const [favoriteVerse, setFavoriteVerse] = useState('');
  const [church, setChurch] = useState('');
  const [profilePic, setProfilePic] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    

    const userDocRef = doc(database, 'user', userId);
    
    const unsubscribe = onSnapshot(userDocRef, (userDocSnap) => {
      if (userDocSnap.exists()) {
        setUsername(userDocSnap.data().username);
        setConnections(userDocSnap.data().connections);
        setPraises(userDocSnap.data().praises);
        setFavoriteVerse(userDocSnap.data().favouriteVerse);
        setChurch(userDocSnap.data().church);
        setProfilePic(userDocSnap.data().profilePicture);
      } else {
        console.log('No such document!');
      }
    }, (error) => {
      console.log("Error fetching user's profile picture:", error);
    });

    // Clean up the listener when the component is unmounted
    return () => {
      unsubscribe();
    };
  }, []);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(username);
    alert('Copied to Clipboard!');
  };

  return (
    <View style={styles.container}>
      <Avatar
        rounded
        size={120}
        source={{ uri: profilePic || 'https://via.placeholder.com/200' }}
        containerStyle={styles.avatar}
      />
      <TouchableOpacity onPress={copyToClipboard}>
        <Text style={styles.username}>{username}</Text>
      </TouchableOpacity>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{connections}</Text>
          <Text style={styles.statLabel}>Connections</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{praises}</Text>
          <Text style={styles.statLabel}>Praises</Text>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.detail}>
          <Text style={styles.label}>Favorite Verse:</Text>
          <Text style={styles.value}>{favoriteVerse}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.label}>Church:</Text>
          <Text style={styles.value}>{church}</Text>
        </View>
      </View>
    </View>
  );
}

export default function ProfilePage({navigation}) {
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  return (
    <SafeAreaProvider>
      <ProfileHeader navigation={navigation} />
      <UserProfile/>
    </SafeAreaProvider>
  )
}