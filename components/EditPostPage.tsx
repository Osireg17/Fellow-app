import {Text, View, TouchableOpacity, Image, FlatList, Dimensions, Alert, StyleSheet} from 'react-native';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { doc, onSnapshot, collection, where, query, getDocs, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { database } from "../config/firebase";
import { useState, useEffect } from "react";
import { FontAwesome, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';



const EditPostPage = ({navigation,route}) => {
    const {postId, postType} = route.params;
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');;

    
    
  return (
    <View>
      <Text>EditPostPage</Text>
    </View>
  )
}

export default EditPostPage

const styles = StyleSheet.create({})