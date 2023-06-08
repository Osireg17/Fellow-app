import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  leftComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    color: 'black',
    fontSize: 22,
    marginRight: 5,
  },
  rightComponent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    marginLeft: 15,
    backgroundColor: "transparent",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  scene: {
    flex: 1,
  },
  indicator: {
    backgroundColor: 'black',
  },
  tabBar: {
    backgroundColor: 'white',
    paddingTop: 10
  },
  label: {
    color: 'black',
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    width: 150,
    height: 40,
  },
  dropdownContainer: {
    position: 'absolute',
    zIndex: 9999, // Ensure it is above other elements
    top: 0, // Adjust this value to position the dropdown correctly
    left: 10,
    borderColor: "transparent"
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '110%', // Increase the width percentage
    marginRight: 10,
    marginLeft: -20, // Add a negative margin on the left side to move it over
    height: 20,
  },
  postContainer: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  
  postUserOpinion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  
  postTimestamp: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  
  postBibleInformation: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    marginBottom: 10,
  },
  
  postBibleText: {
    fontSize: 14,
    marginBottom: 5,
  },
  
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postStatsText: {
    fontSize: 14,
    color: '#666',
  },
  postBibleReference: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 5,
  },
});
