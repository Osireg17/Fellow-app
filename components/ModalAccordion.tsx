import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type AccordionItemPros = PropsWithChildren<{
  title: string;
}>;

function AccordionItem({ children, title }: AccordionItemPros): JSX.Element {
    const [ expanded, setExpanded ] = useState(false);
  
    function toggleItem() {
      setExpanded(!expanded);
    }
  
    const body = <View style={styles.accordBody}>{ children }</View>;

    return (
        <View style={styles.accordContainer}>
          <TouchableOpacity style={styles.accordHeader} onPress={ toggleItem }>
            <Text style={styles.accordTitle}>{ title }</Text>
            <Icon name={ expanded ? 'chevron-up' : 'chevron-down' }
                  size={20} color="#bbb" />
          </TouchableOpacity>
          { expanded && body }
        </View>
      );
    }


const styles = StyleSheet.create({
        accordContainer: {
            width: '100%',
            marginVertical: 5,
            borderWidth: 1,
            borderColor: '#bbb',
            borderRadius: 5,
            paddingHorizontal: 20,
            overflow: 'hidden',
        },
        accordHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 6,
        },
        accordTitle: {
            fontSize: 12,
        },
        accordBody: {
            padding: 10,
        },
    });

export default AccordionItem;
