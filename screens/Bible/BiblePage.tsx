
import React, { useState, useEffect } from 'react';
import {Text, View, TextInput, TouchableOpacity, Image, Platform, Alert, Button, KeyboardAvoidingView, Pressable, SafeAreaView, Modal, ScrollView } from 'react-native';
import styles from '../../styles/Feeds/Bible.styles'
import { Header as HeaderRNE } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const EnglishBibleVersions = ["YLT", "KJV", "NKJV", "WEB", "RSV", "CJB", "TS2009", "LXXE", "TLV", "NASB", "ESV", "GNV", "DRB", "NIV2011", "NIV", "NLT", "NRSVCE", "NET", "NJB1985", "AMP", "MSG", "LSV"];



function Header({ selectedVersion, onPressVersion }) {
  const navigation = useNavigation();

  return (
    <HeaderRNE
      containerStyle={styles.header}
      leftComponent={{ icon: 'arrow-back', color: '#000', onPress: () => navigation.goBack() }}
      centerComponent={{
        text: (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Pressable style={styles.leftbutton} onPress={() => { /* Your action here */ }}>
              <Text style={styles.buttonText}>Proverbs3</Text>
            </Pressable>
            <Pressable style={styles.rightbutton} onPress={onPressVersion}>
              <Text style={styles.buttonText}>{selectedVersion}</Text>
            </Pressable>
          </View>
        ), 
        style: { color: '#000' } 
      }}
      rightComponent={{ icon: 'search', color: '#000', onPress: () => { /* Your action here */ }}}
    />
  );
}


function GetBible() {
  const [versionsData, setVersionsData] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [booksData, setBooksData] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [versesData, setVersesData] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);



  useEffect(() => {
    const getBibleVersions = async () => {
      try {
        const data = EnglishBibleVersions.map((version) => ({
          version,
          url: `https://bolls.life/get-books/${version}/`,
        }));

        setVersionsData(data);
      } catch (error) {
        console.error(error);
      }
    };

    getBibleVersions();
  }, []);

  const handleVersionPress = async (version: any) => {
    try {
      const response = await fetch(version.url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Received data from fetch:", data); // Debugging line
  
      setSelectedVersion(version.version);
      setBooksData(data);
  
      console.log("Set state: selectedVersion =", version.version, "; booksData =", data); // Debugging line
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleBookPress = (book: any) => {
    setSelectedBook(book.name);
    setSelectedBookId(book.bookid);  // Set the selectedBookId state here
    
    // Create an array of chapters from 1 to book.chapters
    const chaptersArray = Array.from({length: book.chapters}, (_, i) => i + 1);
    
    setSelectedChapters(chaptersArray);
  };

  const handleChapterPress = async (chapterNumber: Number) => {
    setSelectedChapter(chapterNumber);
    try {
      const response = await fetch(`https://bolls.life/get-text/${selectedVersion}/${selectedBookId}/${chapterNumber}/`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setVersesData(data);
      console.log("Received data from fetch:", data); // Debugging line
    } catch (error) {
      console.error(error);
    }
  };
  
  const renderVersion = ({ item}) => (
    <TouchableOpacity style={styles.versionContainer} onPress={() => handleVersionPress(item)}>
      <Text style={styles.versionText}>{item.version}</Text>
    </TouchableOpacity>
  );

  const renderBook = ({ item }) => (
    <TouchableOpacity style={styles.bookContainer} onPress={() => handleBookPress(item)}>
      <Text style={styles.bookText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderChapter = ({ item }) => (
    <TouchableOpacity style={styles.chapterContainer} onPress={() => handleChapterPress(item)}>
      <Text style={styles.chapterText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderVerse = ({ item }) => (
    <View style={styles.verseContainer}>
      <Text style={styles.verseNumber}>{item.verse}</Text>
      <Text style={styles.verseText}>{item.text}</Text>
      {item.comment && <Text style={styles.verseComment}>{item.comment}</Text>}
    </View>
  );
}




export default function BiblePage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('NIV');

  const handleVersionPress = (version) => {
    setSelectedVersion(version);
    setModalVisible(false);
  };
  

    return (
    <SafeAreaProvider>
      <Header selectedVersion={selectedVersion} onPressVersion={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <SafeAreaView style={styles.modalView}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {/* Add text that says pick a version */}
            <Text style={styles.modalTitle}>Pick a version</Text>
            {EnglishBibleVersions.map((version) => (
              <TouchableOpacity key={version} onPress={() => handleVersionPress(version)}>
                <Text style={styles.modalText}>{version}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </SafeAreaProvider>
  );
}


