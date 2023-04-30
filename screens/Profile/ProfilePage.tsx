import {Text, View, TextInput, TouchableOpacity, Image, Platform, Alert, Button, KeyboardAvoidingView, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react'
import styles from '../../styles/Profile/profilePage.style'
import { Header as HeaderRNE,  Avatar } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { database } from '../../config/firebase';
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as Clipboard from 'expo-clipboard';


function ProfileHeader({ navigation }) {
  return (
    <HeaderRNE
      leftComponent={
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      }
      centerComponent={{ text: 'Profile', style: { color: 'black', fontSize: 18 } }}
      rightComponent={
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity>
            <MaterialCommunityIcons name="pencil" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 10 }}>
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
  const [copiedText, setCopiedText] = useState(null);
  const [username, setUsername] = useState(null);
  const [connections, setConnections] = useState(0);
  const [praises, setPraises] = useState(0);
  const [favoriteVerse, setFavoriteVerse] = useState(null);
  const [church, setChurch] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;

    const readData = async (userId) => {
      try {
        const userDocRef = doc(database, 'user', userId);
        const userDocSnap = await getDoc(userDocRef);

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
      } catch (error) {
        console.log("Error fetching user's profile picture:", error);
      }
    };
    readData(userId);
  }, []);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(username);
    alert('Copied to Clipboard!');
  };

  return (
    <View style={styles.container}>
      <Avatar
        rounded
        size={150}
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
