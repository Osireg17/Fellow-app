import {Text, View, TextInput, TouchableOpacity, Image, Platform, Alert, Button, KeyboardAvoidingView, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react'
import styles from '../../styles/Profile/profilePage.style'
import { Header as HeaderRNE,  Avatar } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { database } from '../../config/firebase';
import { doc, onSnapshot, collection, where, query, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as Clipboard from 'expo-clipboard';
import { DrawerActions } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';


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
        setPraises(userDocSnap.data().totalPraises);
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

  // write a function that will get all the praisesCount from every post with the same userID, and add them up and display it


  return (
    <View style={styles.container}>
      <Avatar
        rounded
        size={120}
        source={{ uri: profilePic || 'https://via.placeholder.com/200' }}
        containerStyle={styles.avatar}
      />
      <TouchableOpacity onPress={copyToClipboard}>
        <Text style={styles.username}>{
          // add an @ in front of the username
          '@' + username
        }</Text>
      </TouchableOpacity>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          {/* connection in the firebase database is an array of userID. Display the length of the array */}
          <Text style={styles.statValue}>{connections.length}</Text>
          <Text style={styles.statLabel}>Connections</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{praises ? praises : 0}</Text>
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
  const [posts, setPosts] = useState([]); // [postID, postID, postID
  const auth = getAuth();
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;

    const fetchPosts = async () => {
      const publicCollection = collection(database, 'public');
      const privateCollection = collection(database, 'private');

      const publicQuery = query(publicCollection, where('uid', '==', userId));
      const privateQuery = query(privateCollection, where('uid', '==', userId));

      const publicDocs = await getDocs(publicQuery);
      const privateDocs = await getDocs(privateQuery);

      let allPosts = [];

      publicDocs.forEach(doc => {
          allPosts.push({ ...doc.data(), id: doc.id });
      });

      privateDocs.forEach(doc => {
          allPosts.push({ ...doc.data(), id: doc.id });
      });

      setPosts(allPosts);
    };

    fetchPosts();

  }, []);

  return (
    <SafeAreaProvider>
      <ProfileHeader navigation={navigation} />
      <UserProfile/>
      {/* In a scrollView display all the posts created by the user */}
      <ScrollView>
        {posts.map((post) => (
          <View key={post.id} style={styles.postContainer}>
            <Text style={styles.postTitle}>{post.userOpinionTitle}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaProvider>
  )
}