// import { Text, View, TextInput, TouchableOpacity, Image, Platform, Alert, Button, KeyboardAvoidingView, Pressable, SafeAreaView, ScrollView } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import styles from '../../styles/Feeds/Bible.styles'


// // const API_Key = 'bd20409d11afec8ec1d7a7dfebf3334a';





// export default function BiblePage() {
//   const [bibleVersions, setBibleVersions] = useState([]);
//   const [bibleBooks, setBibleBooks] = useState([]);
//   const [bibleChapters, setBibleChapters] = useState([]);
//   const [selectedVersion, setSelectedVersion] = useState(null);
//   const [selectedBook, setSelectedBook] = useState(null);

//   const EnglishBibleVersions = ["YLT", "KJV", "NKJV", "WEB", "RSV", "CJB", "TS2009", "LXXE", "TLV", "NASB", "ESV", "GNV", "DRB", "NIV2011", "NIV", "NLT", "NRSVCE", "NET", "NJB1985", "AMP", "MSG", "LSV"];


//   const getBibleVersions = async () => {
//     try {
//       // Map through the bibleVersions array and fetch data for each version
//       const promises = EnglishBibleVersions.map(async (version) => {
//         const response = await fetch(`https://bolls.life/get-books/${version}/`);
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
  
//         return await response.json(); // assuming API returns JSON
//       });
  
//       // Wait for all promises to resolve
//       const versionsData = await Promise.all(promises);
  
//       return versionsData;

//       console.log(versionsData);
//     } catch (error) {
//       console.error(error);
//     }
//   };
  


//   // const getBibleVersions = async () => {
//   //   try {
//   //     const response = await fetch('https://api.scripture.api.bible/v1/bibles', {
//   //       method: 'GET',
//   //       headers: {
//   //         'api-key': API_Key
//   //       },
//   //     });

//   //     const data = await response.json();
//   //     const versions = data.data
//   //       .filter((bible) => bible.language.id === 'eng') // filter for English bibles
//   //       .map((bible) => ({
//   //         id: bible.id,
//   //         abbreviation: bible.abbreviation,
//   //       }));

//   //     setBibleVersions(versions);
//   //     console.log(versions);
//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   // };

//   // useEffect(() => {
//   //   getBibleVersions();
//   // }, []);

//   // // function to get bible books
//   // const getBibleBooks = async (bibleVersionId) => {
//   //   try {
//   //     const response = await fetch(
//   //       `https://api.scripture.api.bible/v1/bibles/${bibleVersionId}/books`,
//   //       {
//   //         method: 'GET',
//   //         headers: {
//   //           'api-key': API_Key,
//   //         },
//   //       }
//   //     );
      
//   //     const data = await response.json();
//   //     const books = data.data.map((book) => ({
//   //       id: book.id,
//   //       name: book.name,
//   //     }));

//   //     setBibleBooks(books);
//   //     console.log(books);
//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   // };

//   // useEffect(() => {
//   //   if (selectedVersion) {
//   //     getBibleBooks(selectedVersion);
//   //   }
//   // }, [selectedVersion]);

//   // // function to get bible chapters
//   // const getBibleChapters = async (bibleVersionId, bibleBookId) => {
//   //   try {
//   //     const response = await fetch(
//   //       `https://api.scripture.api.bible/v1/bibles/${bibleVersionId}/books/${bibleBookId}/chapters`,
//   //       {
//   //         method: 'GET',
//   //         headers: {
//   //           'api-key': API_Key,
//   //         },
//   //       }
//   //     );
//   //     const data = await response.json();
//   //     const chapters = data.data.map((chapter) => ({
//   //       id: chapter.id,
//   //       number: chapter.number,
//   //     }));
    
//   //     setBibleChapters(chapters);
//   //     console.log(chapters);
//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   // };

//   // useEffect(() => {
//   //   if (selectedBook && selectedVersion) {
//   //     getBibleChapters(selectedVersion, selectedBook);
//   //   }
//   // }, [selectedBook, selectedVersion]);

//   // //function to get bible verses


//   // // function to handle bible version selection and get bible books

//   // const handleVersionSelection = (bibleVersionId) => {
//   //   setSelectedVersion(bibleVersionId);
//   //   getBibleBooks(bibleVersionId);
//   // };

//   // // function to handle bible book selection and get bible chapters
//   // const handleBookSelection = (bibleBookId) => {
//   //   setSelectedBook(bibleBookId);
//   //   getBibleChapters(selectedVersion, bibleBookId);
//   // };


  



//   return (
//     // <ScrollView style={styles.container}>
//     //   <Text style={styles.header}>Bible Versions</Text>
//     //   {bibleVersions.map((bible) => (
//     //     <Text
//     //       key={bible.id}
//     //       style={styles.item}
//     //       onPress={() => handleVersionSelection(bible.id)}
//     //     >
//     //       {bible.abbreviation}
//     //     </Text>
//     //   ))}

//     //   {selectedVersion && (
//     //     <>
//     //       <Text style={styles.header}>Books</Text>
//     //       {bibleBooks.map((book) => (
//     //         <Text
//     //           key={book.id}
//     //           style={styles.item}
//     //           onPress={() => handleBookSelection(book.id)}
//     //         >
//     //           {book.name}
//     //         </Text>
//     //       ))}
//     //     </>
//     //   )}

//     //   {selectedBook && (
//     //     <>
//     //       <Text style={styles.header}>Chapters</Text>
//     //       {bibleChapters.map((chapter) => (
//     //         <Text key={chapter.id} style={styles.item}>
//     //           {chapter.number}
//     //         </Text>
//     //       ))}
//     //     </>
//     //   )}
//     // </ScrollView>
//     <View>
//       <Text>hello</Text>
//     </View>
//   );
// }
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import styles from '../../styles/Feeds/Bible.styles'

const EnglishBibleVersions = ["YLT", "KJV", "NKJV", "WEB", "RSV", "CJB", "TS2009", "LXXE", "TLV", "NASB", "ESV", "GNV", "DRB", "NIV2011", "NIV", "NLT", "NRSVCE", "NET", "NJB1985", "AMP", "MSG", "LSV"];

export default function BiblePage() {
  const [versionsData, setVersionsData] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [booksData, setBooksData] = useState([]);

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

  const handleVersionPress = async (version) => {
    try {
      const response = await fetch(version.url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSelectedVersion(version.version);
      setBooksData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderVersion = ({ item }) => (
    <TouchableOpacity style={styles.versionContainer} onPress={() => handleVersionPress(item)}>
      <Text style={styles.versionText}>{item.version}</Text>
    </TouchableOpacity>
  );

  const renderBook = ({ item }) => (
    <View style={styles.bookContainer}>
      <Text style={styles.bookText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {selectedVersion ? (
        <View>
          <Text>{selectedVersion}</Text>
          <FlatList 
            data={booksData} 
            renderItem={renderBook} 
            keyExtractor={(item) => item.name} 
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

