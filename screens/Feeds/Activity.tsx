import {Text, View, TextInput, TouchableOpacity, Image, Platform, Alert, Button, KeyboardAvoidingView, Pressable, SafeAreaView } from 'react-native';
import React,{useState, useEffect} from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Header as HeaderRNE } from 'react-native-elements';
import { FontAwesome, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../../styles/Feeds/Activity.styles'


// This is the Activity screen, where there will be a header that just says "Activity" and a list of notifications

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
  return (
    <SafeAreaProvider>
      <Header />
    </SafeAreaProvider>
  )
}

export default Activity