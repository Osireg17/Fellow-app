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
});
