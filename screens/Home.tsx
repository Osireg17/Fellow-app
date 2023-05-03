import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  useWindowDimensions,
  KeyboardAvoidingView,
  SafeAreaView, 
  ScrollView,
  TextInput,
} from 'react-native';
import { Header as HeaderRNE } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { database } from '../config/firebase';
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import styles from "../styles/Home.style"
import DropDownPicker from 'react-native-dropdown-picker';

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

export default function MainFeed({navigation}) {

  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'For You' },
    { key: 'second', title: 'Following' },
  ]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Trending', value: 'trending'},
    {
      label: 'Latest',
      value: 'latest',
    },
    {
      label: 'Home',
      value: 'Home',
    }
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
  
  const NavigateToProfile = () => {
    //complete the function to navigate to the profile page
    navigation.navigate('Profile');
  }

  const handleSearchIconPress = () => {
    setSearchBarVisible(true);
  };

  const [selectedValue, setSelectedValue] = useState("home");

  const layout = useWindowDimensions();


  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <HeaderRNE
          containerStyle={{
            height: 120,
            paddingBottom: 30,
            paddingTop: 20,
            backgroundColor: '#FFFFFF',
            zIndex: 100
          }}
          leftComponent={
            <View style={styles.dropdownContainer}>
              <DropDownPicker
                placeholder='Home'
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                style={{
                  backgroundColor: "#ffffff",
                  borderWidth: 0,
                  borderColor: "white",
                  borderRadius: 0,
                }}
                containerStyle={{
                  width: 150,
                  height: 40,
                  borderRadius: 0,
                }}
                
              />
            </View>
          }
          // rightComponent={
          //   <View style={styles.rightComponent}>
          //     <TouchableOpacity onPress={handleSearchIconPress}>
          //       <FontAwesome name="search" size={24} color="black" />
          //     </TouchableOpacity>
          //     <TouchableOpacity style={styles.profileImageContainer} onPress={NavigateToProfile}>
          //     <Image
          //         source={{ uri: profilePicture || 'https://via.placeholder.com/40' }}
          //         style={styles.profileImage}
          //       />
          //     </TouchableOpacity>
          //   </View>
          // }
          rightComponent={
            <View style={styles.rightComponent}>
              {searchBarVisible ? (
                <TextInput
                  style={styles.searchBar}
                  onChangeText={text => setSearchText(text)}
                  value={searchText}
                  placeholder="Search"
                  autoFocus={true}
                  onBlur={() => setSearchBarVisible(false)}
                />
              ) : (
                <>
                  <TouchableOpacity onPress={handleSearchIconPress}>
                    <FontAwesome name="search" size={24} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.profileImageContainer} onPress={NavigateToProfile}>
                    <Image
                      source={{ uri: profilePicture || 'https://via.placeholder.com/40' }}
                      style={styles.profileImage}
                    />
                  </TouchableOpacity>
                </>
              )}
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
