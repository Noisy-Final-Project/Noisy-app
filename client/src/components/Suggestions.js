import React from 'react';  
import { useRef, useState } from 'react';
import { StyleSheet, View, TextInput, FlatList } from 'react-native';  
import { SuggestionListItem } from './SuggestionListItems';
   
export function Suggestions(props) {  
  let searchInputRef = useRef(null);
   
  const handleOnPressItem = (item, event) => {  
    searchInputRef.current.blur()  
    props.onPressItem(item, event)  
  }
  
  return (<View style={styles.suggestionListContainer}>  
    <TextInput
      ref={searchInputRef}
      style={styles.searchInput}
      placeholder={props.placeholder}
      onChangeText={props.handleSearchTextChange}>
    </TextInput>  
    {props.showList &&
    <FlatList style={styles.searchList} keyExtractor={(item, index) => index.toString()}
        keyboardShouldPersistTaps="always" initialNumToRender={5} data={props.suggestionListData}
        renderItem={({item}) =>
            <SuggestionListItem onPressItem={handleOnPressItem} item={item}></SuggestionListItem>} />
    }  
  </View>);  
}

const styles = StyleSheet.create({ 
    searchInput: { 
      height: 40, 
      paddingLeft: 10, 
      paddingRight: 10, 
      borderWidth: 1,
      backgroundColor: "#FFFFFF"
    }, 
    suggestionListContainer: { 
      width: "90%", 
      marginLeft: "5%", 
    }, 
    searchList: { 
      width: "95%", 
      marginTop: 10, 
    } 
  });