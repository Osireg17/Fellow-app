import {Text, View, TouchableOpacity } from 'react-native';
import React, {useState, useEffect} from 'react';
import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Avatar } from 'react-native-elements';
import { database } from '../../config/firebase';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styles from '../../styles/Profile/OtherUserProfilePage.style'

function OtherUserProfilePage({navigation, route}) {
  const { uid } = route.params;
  const [username, setUsername] = useState('');
  const [connections, setConnections] = useState([]);
  const [praises, setPraises] = useState([]);
  const [favoriteVerse, setFavoriteVerse] = useState('');
  const [church, setChurch] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [connect, setConnect] = useState(false);

  const handleConnect = async () => {
    const auth = getAuth();
    const currentUserUid = auth.currentUser.uid;
    
    // Update the user's connections in Firestore
    const userDocRef = doc(database, 'user', currentUserUid);
    await updateDoc(userDocRef, {
      connections: arrayUnion(uid),
    });

    setConnect(true);
  };

  useEffect(() => {
    const userDocRef = doc(database, 'user', uid);
    
    const unsubscribe = onSnapshot(userDocRef, (userDocSnap) => {
      if (userDocSnap.exists()) {
        setUsername(userDocSnap.data().username);
        setConnections(userDocSnap.data().connections);
        setPraises(userDocSnap.data().praises);
        setFavoriteVerse(userDocSnap.data().favoriteVerse);
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

  return (
    <SafeAreaProvider style={styles.container}>
      <Avatar
        rounded
        size={120}
        source={{ uri: profilePic || 'https://via.placeholder.com/200' }}
        containerStyle={styles.avatar}
      />
      <Text style={styles.username}>{username}</Text>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{connections.length}</Text>
          {/* show the number of connections like this connections: 0 */}
          <Text style={styles.statLabel}>Connections</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{praises.length}</Text>
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleConnect}
          disabled={connect}
        >
          <Text style={styles.buttonText}>{connect ? 'Connected' : 'Connect'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>

  );
}

export default OtherUserProfilePage;