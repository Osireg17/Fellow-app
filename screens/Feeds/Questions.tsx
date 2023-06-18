import {Text, View, TouchableOpacity, Image, Platform, Alert, Button, KeyboardAvoidingView, Pressable, SafeAreaView, FlatList } from 'react-native';
import React,{useState, useEffect} from 'react'
import styles from '../../styles/Feeds/Questions.style';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Header as HeaderRNE } from 'react-native-elements';
import { FontAwesome, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { database } from '../../config/firebase';
import { doc, getDocs, collection, onSnapshot, getDoc } from "firebase/firestore";
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
  const [profilePicture, setProfilePicture] = useState('');

  const auth = getAuth();
  const uid = auth.currentUser.uid;

  useEffect(() => {
    fetchProfilePicture(uid).then((pictureUrl) => {
      console.log('Profile picture URL:', pictureUrl);
      setProfilePicture(pictureUrl);

    });
  }, [uid]);
  
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
  const [questions, setQuestions] = useState([]);

  const auth = getAuth();
  const uid = auth.currentUser.uid;

  useEffect(() => {
    const questionsCollection = collection(database, "questions");

    const unsubscribe = onSnapshot(questionsCollection, (querySnapshot) => {
      const fetchedQuestions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(fetchedQuestions);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const NavigateToPostQuestion = () => {
    navigation.navigate('QuestionPost');
  }

  return (
    <SafeAreaProvider>
      <QuestionHeader navigation={navigation} />
      <View style={[styles.scene, { backgroundColor: '#EDEDED' }]}>
  <FlatList
    data={questions}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item, index }) => {
      const createdAt = item.createdAt ? item.createdAt.toDate().toLocaleString() : '';
      return (
        <View style={styles.postContainer}>
          <View style={styles.postHeader}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <View style={styles.postUser}>
              <TouchableOpacity onPress={() => {if (item.uid === uid) {navigation.navigate('Profile');} else {
                navigation.navigate('OtherUserProfilePage', {uid: item.uid });}}}>
                <Text style={styles.postUsername}>{item.username}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {if (item.uid === uid) {navigation.navigate('Profile');} else {
                navigation.navigate('OtherUserProfilePage', {uid: item.uid });}}}>
                <Image
                  source={{ uri: item.userProfilePicture || 'https://via.placeholder.com/40' }}
                  style={styles.postUserImage}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.postUserOpinion}>{item.question}</Text>
          <View style={styles.postFooter}>
            <Text style={styles.postTimestamp}>{createdAt}</Text>
            <View style={styles.postFooterIcons}>
              <TouchableOpacity style={styles.postFooterIcon}>
                <FontAwesome name="comment-o" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.postFooterIcon}>
                <Feather name="share" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.postFooterIcon}>
                <MaterialCommunityIcons name="heart-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }}
  />
</View>
      <TouchableOpacity 
        style={styles.fab}
        onPress={NavigateToPostQuestion}
      >
        <Ionicons name="md-create" size={25} color="white" />
      </TouchableOpacity>
    </SafeAreaProvider>
  )
}
