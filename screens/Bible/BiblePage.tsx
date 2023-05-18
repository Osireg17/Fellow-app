
import React, { useState, useEffect } from 'react';
import {Text, View, TextInput, TouchableOpacity, Image, Platform, Alert, Button, KeyboardAvoidingView, Pressable, SafeAreaView, Modal, ScrollView } from 'react-native';
import styles from '../../styles/Feeds/Bible.styles'
import { Header as HeaderRNE } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ModalAccordion from '../../components/ModalAccordion';
import AccordionItem from '../../components/ModalAccordion';



function Header({ selectedVersion, selectedBook, onPressVersion, onPressBook }) {
  const navigation = useNavigation();

  return (
    <HeaderRNE
      containerStyle={styles.header}
      leftComponent={{ icon: 'arrow-back', color: '#000', onPress: () => navigation.goBack() }}
      centerComponent={{
        text: (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Pressable style={styles.leftbutton} onPress={onPressBook}>
              <Text style={styles.buttonText}>{selectedBook}</Text>
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




export default function BiblePage() {

  const EnglishBibleVersions = ["YLT", "KJV", "NKJV", "WEB", "RSV", "CJB", "TS2009", "LXXE", "TLV", "NASB", "ESV", "GNV", "DRB", "NIV2011", "NIV", "NLT", "NRSVCE", "NET", "NJB1985", "AMP", "MSG", "LSV"];

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleBook, setModalVisibleBook] = useState(false);
  const [modalVisibleChapter, setModalVisibleChapter] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('NIV');
  const [selectedBook, setSelectedBook] = useState('Genesis');
  const [selectedChapter, setSelectedChapter] = useState('1');

  const [versionsData, setVersionsData] = useState([]);
  const [booksData, setBooksData] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [versesData, setVersesData] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);



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

    const getInitialBooks = async () => {
      try {
        const response = await fetch(`https://bolls.life/get-books/NIV/`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setBooksData(data);
      } catch (error) {
        console.error(error);
      }
    };

    getBibleVersions();
    getInitialBooks();  // fetch the initial set of books for NIV version
  }, []);


  const handleVersionPress = async (version: any) => {
    try {
      const response = await fetch(`https://bolls.life/get-books/${version}/`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data from fetch:", data);

      setSelectedVersion(version);
      setBooksData(data);

      console.log("Set state: selectedVersion =", version, "; booksData =", data);
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleBookPress = (book: any) => {
    setSelectedBook(book.name);
    setModalVisibleBook(false);

    setSelectedBook(book.name);
    setSelectedBookId(book.bookid);  // Set the selectedBookId state here
    
    // Create an array of chapters from 1 to book.chapters
    const chaptersArray = Array.from({length: book.chapters}, (_, i) => i + 1);
    
    setSelectedChapters(chaptersArray);
  };



  const handleSelectVersion = (version: any) => {
    handleVersionPress(version);
    setModalVisible(false);
  };

  const handleSelectBook = (book: any) => {
    handleBookPress(book);
    setModalVisibleBook(false);
  };

  

    
  return (
    <SafeAreaProvider>
      <Header 
        selectedVersion={selectedVersion} 
        selectedBook={selectedBook} 
        onPressVersion={() => setModalVisible(true)}
        onPressBook={() => setModalVisibleBook(true)} 
      />
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <SafeAreaView style={styles.modalView}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>Pick a version</Text>
            {versionsData.map((version) => (
              <TouchableOpacity key={version.version} onPress={() => handleSelectVersion(version.version)}>
                <Text style={styles.modalText}>{version.version}</Text>
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
      <Modal
        animationType="slide"
        visible={modalVisibleBook}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisibleBook(!modalVisibleBook);
        }}>
        <SafeAreaView style={styles.modalView}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>Pick a book</Text>
            {booksData.map((book) => (
              <AccordionItem key={book.id} title={book.name} onPress={() => handleSelectBook(book)}>
                {/* Body content goes here */}
                <Text style={styles.modalText}>This is a placeholder for the body content.</Text>
              </AccordionItem>
            ))}
          </ScrollView>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisibleBook(!modalVisibleBook)}>
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </SafeAreaProvider>
  );
}
