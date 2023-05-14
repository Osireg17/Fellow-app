
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import styles from '../../styles/Feeds/Bible.styles'
import { Header as HeaderRNE } from 'react-native-elements';

const EnglishBibleVersions = ["YLT", "KJV", "NKJV", "WEB", "RSV", "CJB", "TS2009", "LXXE", "TLV", "NASB", "ESV", "GNV", "DRB", "NIV2011", "NIV", "NLT", "NRSVCE", "NET", "NJB1985", "AMP", "MSG", "LSV"];

export default function BiblePage() {
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
  
  
  
  
  return (
    <View style={styles.container}>
      {selectedVersion && !selectedBook ? (
        <View>
          <Text>{selectedVersion}</Text>
          <FlatList 
            data={booksData} 
            renderItem={renderBook} 
            keyExtractor={(item) => item.bookid.toString()}
          />
        </View>
      ) : selectedBook && !selectedChapter ? (
        <View>
          <Text>{selectedBook}</Text>
          <FlatList 
            data={selectedChapters} 
            renderItem={renderChapter} 
            keyExtractor={(item, index) => index.toString()} 
          />
        </View>
      ) : selectedChapter ? (
        <View>
          <Text>{selectedBook} - Chapter {selectedChapter}</Text>
          <FlatList 
            data={versesData} 
            renderItem={renderVerse} 
            keyExtractor={(item) => item.pk.toString()} 
          />
        </View>
      ) : (
        <FlatList 
          data={versionsData} 
          renderItem={renderVersion} 
          keyExtractor={(item) => item.version} 
        />
      )}
    </View>
  );

  
}


