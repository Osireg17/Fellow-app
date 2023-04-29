import {Text, View, TextInput, TouchableOpacity, Image, Platform, Alert, Button, KeyboardAvoidingView, Pressable } from 'react-native';
import React, {useState, useEffect} from 'react'
import styles from '../../styles/Profile/profilePage.style'
import { Header as HeaderRNE } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { database } from '../../config/firebase';
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";




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

async function UserProfile({userId}){
  
  // get data from firebase firestore
  const docRef = doc(database, "users", userId);
  const docSnap = await getDoc(docRef);
  const userData = docSnap.data();



  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text> Happy </Text>
    </View>
  );
}

export default function ProfilePage({navigation}) {

  const auth = getAuth();
  const userId = auth.currentUser.uid;

  return (
    <SafeAreaProvider>
      <ProfileHeader navigation={navigation} />
      <UserProfile  userId={userId}/>
    </SafeAreaProvider>
  )
}
