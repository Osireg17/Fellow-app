import {Text, View, TouchableOpacity, Image, Platform, Alert, Button, KeyboardAvoidingView, Pressable, SafeAreaView, ScrollView } from 'react-native';
import React,{useState, useEffect} from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Header as HeaderRNE } from 'react-native-elements';
import { FontAwesome, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../../styles/Feeds/Activity.styles'
import { getAuth } from 'firebase/auth';
import { database } from '../../config/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';



// This is the Activity screen, where there will be a header that just says "Activity" and a list of notifications
// TODO: function to show who liked your post
// TODO: function to show who commented on your post

// TODO: function to show who liked your question

// TODO: function to show who commented on your question

function Header() {
  return (
    <HeaderRNE
      centerComponent={{ text: 'Activity', style: { 
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold', 
    } }}
      containerStyle={styles.header}
    />
  );
}

const Activity = () => {
  const [activity, setActivity] = useState([]); // array of objects, each object is a notification
  const [loading, setLoading] = useState(true);

  // get the current user's id
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user?.uid; // Get the user's id

  // find posts that is linked to the current user, and display the other users that liked the post. 
  // The other users id are stored in the likes array in the post object
  const getPostLikes = async () => {
    // Step 1: Get all the posts that the current user has made
    const publicCollection = collection(database, 'public');
    const q = query(publicCollection, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    const privateCollection = collection(database, 'private');
    const q2 = query(privateCollection, where('uid', '==', uid));
    const querySnapshot2 = await getDocs(q2);


    let activities = [];

    for (const postDoc of querySnapshot.docs || querySnapshot2.docs) {
      let postData = postDoc.data();

      // Step 2: Get the likes array from each post
      if (postData.praises) {
        for (let likerId of postData.praises) {

          // Step 3: With each uid in the likes array, get the username of the user
          const userDocRef = doc(database, 'user', likerId); // Document reference to the user who liked
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            let likerData = userDoc.data();

            // Step 4: Add the username to the activities array
            activities.push({
              type: 'post',
              username: likerData.username,
              userOpinionTitle: postData.userOpinionTitle,
              profilePic: likerData.profilePicture,
            });
          }
        }
      }
    }

    // Step 5: Set the activities array to the state
    setActivity(activities);

    // Step 6: Set loading to false
    setLoading(false);
}

  useEffect(() => {
    getPostLikes();
  }, []);




  return (
    <SafeAreaProvider>
        <Header />
        <ScrollView>
            {activity.map((item, index) => (
                <View key={index} style={styles.item}>
                    <Image source={{uri: item.profilePic || 'https://via.placeholder.com/30' }} style={styles.profilePic} />
                    <View>
                        <Text style={styles.username}>{item.username}</Text>
                        <Text style={styles.action}>liked your post</Text>
                        <Text style={styles.postTitle}>"{item.userOpinionTitle}"</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    </SafeAreaProvider>
);
}

export default Activity