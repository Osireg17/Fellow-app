import React, { useState, useEffect } from 'react';
import {Text, View, TouchableOpacity, Alert, Pressable, SafeAreaView, Modal, ScrollView, FlatList } from 'react-native';
import styles from '../../styles/Feeds/Bible.styles'
import { Header as HeaderRNE } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AccordionItem from '../../components/AccordionItem';

function Header({ selectedVersion, selectedBook, selectedChapter, onPressVersion, onPressBook }) {
  const navigation = useNavigation();

  return (
    <HeaderRNE
      containerStyle={styles.header}
      leftComponent={{ icon: 'arrow-back', color: '#000', onPress: () => navigation.goBack() }}
      centerComponent={
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Pressable style={styles.leftbutton} onPress={onPressBook}>
            <Text style={styles.buttonText}>{selectedBook} {selectedChapter}</Text>
          </Pressable>
          <Pressable style={styles.rightbutton} onPress={onPressVersion}>
            <Text style={styles.buttonText}>{selectedVersion}</Text>
          </Pressable>
        </View>
      }
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

  const [expandedAccordion, setExpandedAccordion] = useState(null);

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
  
        // Find the bookId of Genesis in the booksData
        const genesisBook = data.find(book => book.name === 'Genesis');
  
        if (genesisBook) {
          // Set the selectedBookId state here
          setSelectedBookId(genesisBook.bookid);
  
          // Fetch Genesis 1 text
          handleChapterPress(genesisBook.bookid, '1');
        } else {
          console.error("Could not find Genesis in the books data");
        }
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

  const handleChapterPress = async (bookId: any, chapter: any) => {
    try {
      const response = await fetch(`https://bolls.life/get-text/${selectedVersion}/${bookId}/${chapter}/`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data from fetch:", data);

      setSelectedChapter(chapter);
      setVersesData(data);

      console.log("Set state: selectedChapter =", chapter, "; versesData =", data);

      // Close the modal here
      setModalVisibleBook(false);

    } catch (error) {
      console.error(error);
    }
  };



  
  const handleBookPress = (book: any, chapter: any = '1') => {
    setSelectedBook(book.name);
    setSelectedChapter(chapter);
  
    // Set the selectedBookId state here
    setSelectedBookId(book.bookid);
  
    // Create an array of chapters from 1 to book.chapters
    const chaptersArray = Array.from({length: book.chapters}, (_, i) => i + 1);
  
    setSelectedChapters(chaptersArray);
  };
  
  

  const ChapterGrid = ({ chapters, bookId }) => {
    const grid = [];
    for (let i = 1; i <= chapters; i++) {
      grid.push(
        <TouchableOpacity key={i} onPress={() => {
            handleChapterPress(bookId, i);
          }}>
          <View style={styles.chapterButton}>
            <Text style={styles.chapterText}>{i}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return <View style={styles.chapterGrid}>{grid}</View>;
  };

  
  


  const handleSelectVersion = (version: any) => {
    handleVersionPress(version);
    setModalVisible(false);
  };

  const handleSelectBook = (book: any) => {
    handleBookPress(book);
    setExpandedAccordion(null);
  };
  

  return (
    <SafeAreaProvider>
      <Header 
        selectedVersion={selectedVersion} 
        selectedBook={selectedBook}
        selectedChapter={selectedChapter}
        onPressVersion={() => setModalVisible(true)}
        onPressBook={() => setModalVisibleBook(true)} 
      />
      <FlatList
        data={versesData}
        renderItem={({item}) => (
          <Text>{item.text}</Text>
        )}
        keyExtractor={item => item.pk.toString()}  // Replace `item.id` with the appropriate key in your data
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
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
            <View style={{ height: 50 }} />
          </ScrollView>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleBook}
        onRequestClose={() => {
          setModalVisibleBook(!modalVisibleBook);
        }}>
        <SafeAreaView style={styles.modalView}>
        <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>Pick a book</Text>
            {booksData.map((book, index) => (
              <AccordionItem 
              key={index} 
              title={book.name} 
              id={index}
              expandedAccordion={expandedAccordion}
              setExpandedAccordion={setExpandedAccordion}
              onPressTitle={() => handleBookPress(book)}
            >
              <ChapterGrid chapters={book.chapters} bookId={book.bookid} />
            </AccordionItem>
            
          ))}
          </ScrollView>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisibleBook(false)}>
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>

    </SafeAreaProvider>
  );
}
