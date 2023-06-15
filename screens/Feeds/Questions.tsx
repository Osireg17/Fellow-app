import {Text, View, TextInput, TouchableOpacity, Image, Platform, Alert, Button, KeyboardAvoidingView, Pressable, SafeAreaView } from 'react-native';
import React,{useState, useEffect} from 'react'
import styles from '../../styles/Feeds/Questions.style';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Header as HeaderRNE } from 'react-native-elements';
import { FontAwesome, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { database } from '../../config/firebase';
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';

async function fetchProfilePicture(uid) {
  try {
    const userDocRef = doc(database, "user", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data().profilePicture;
    } else {
      console.log("No such document!");
      return '';
    }
  } catch (error) {
    console.log("Error fetching user's profile picture:", error);
    return '';
  }
}




function QuestionHeader({ navigation }) {

  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const auth = getAuth();
  const uid = auth.currentUser.uid;

  useEffect(() => {
    fetchProfilePicture(uid).then((pictureUrl) => {
      console.log('Profile picture URL:', pictureUrl);
      setProfilePicture(pictureUrl);

    });
  }, [uid]);

  const handleSearchIconPress = () => {
    setSearchBarVisible(!searchBarVisible);
  };
  
  
  const NavigateToProfile = () => {
    //complete the function to navigate to the profile page
    navigation.navigate('Profile');
  }
  return (
    <>
    <HeaderRNE
  leftComponent={
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.leftComponent}>
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  }
  centerComponent={{
    text: 'Questions',
    style: styles.centerComponent,
  }}
  rightComponent={
    <View style={styles.rightComponent}>
          {/* <TouchableOpacity style={styles.optionsButton}>
            <Ionicons name="ios-options-outline" size={24} color="black" />
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.profileImageContainer} onPress={NavigateToProfile}>
            <Image
              source={{ uri: profilePicture || 'https://via.placeholder.com/40' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
      </View>
  }
  containerStyle={styles.headerContainer}
  />
    </>
  );
}

export default function Questions({navigation}) {

  
  const NavigateToProfile = () => {
    //complete the function to navigate to the profile page
    navigation.navigate('Profile');
  }

  const NavigateToPostQuestion = () => {
    // replace 'PostQuestion' with the route name of your question post page
    navigation.navigate('QuestionPost');
  }

  return (
    <SafeAreaProvider>
      <QuestionHeader navigation={navigation} />
      <TouchableOpacity 
        style={styles.fab}
        onPress={NavigateToPostQuestion}
      >
        <Ionicons name="md-create" size={25} color="white" />
      </TouchableOpacity>
    </SafeAreaProvider>
  )
}
