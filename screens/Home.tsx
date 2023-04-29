import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  useWindowDimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { Header as HeaderRNE } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { database } from '../config/firebase';
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import styles from "../styles/Home.style"

const FirstRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#EDEDED' }]} />
);

const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#EDEDED' }]} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

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

export default function MainFeed() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'For You' },
    { key: 'second', title: 'Following' },
  ]);

  
  const [profilePicture, setProfilePicture] = useState('');

  const auth = getAuth();
  const uid = auth.currentUser.uid;

  useEffect(() => {
    fetchProfilePicture(uid).then((pictureUrl) => {
      console.log('Profile picture URL:', pictureUrl);
      setProfilePicture(pictureUrl);

    });
  }, [uid]);
  

  const [selectedValue, setSelectedValue] = useState("home");

  const layout = useWindowDimensions();

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <HeaderRNE
          containerStyle={{
            height: 115,
            paddingBottom: 10,
            paddingTop: 10,
            backgroundColor: '#FFFFFF',
          }}
          leftComponent={
            <View style={styles.leftComponent}>
              <Text style={styles.title}>Home</Text>
              <Feather name="chevron-down" size={24} color="black" />
            </View>
          }
          rightComponent={
            <View style={styles.rightComponent}>
              <TouchableOpacity>
                <FontAwesome name="search" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileImageContainer}>
              <Image
                  source={{ uri: profilePicture || 'https://via.placeholder.com/40' }}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>
          }
        />
        <TabView
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={styles.indicator}
              style={styles.tabBar}
              labelStyle={styles.label}
            />
          )}
        />
      </View>
    </SafeAreaProvider>
  );
}
