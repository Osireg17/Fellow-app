import { Text, View, TextInput, TouchableOpacity, Image, Platform, Alert, Button, KeyboardAvoidingView, Pressable, SafeAreaView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
//bd20409d11afec8ec1d7a7dfebf3334a

export default function BiblePage() {
  const [bibleVersions, setBibleVersions] = useState([]);

  const getBibleVersions = async () => {
    try {
      const response = await fetch('https://api.scripture.api.bible/v1/bibles', {
        method: 'GET',
        headers: {
          'api-key': '',
        },
      });

      const data = await response.json();
      const versions = data.data.map((bible) => ({
        id: bible.id,
        abbreviation: bible.abbreviation,
      }));

      setBibleVersions(versions);
      console.log(versions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBibleVersions();
  }, []);

  return (
    <SafeAreaView>
      {/* Display bible versions */}
      {bibleVersions.map((bible) => (
        <Text key={bible.id}>{bible.abbreviation}</Text>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
