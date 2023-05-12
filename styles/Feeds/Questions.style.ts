import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  profileImageContainer: {
    marginLeft: 15,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerContainer: {
    backgroundColor: 'white',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
  leftComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 9
  },
  centerComponent: {
    color: 'black',
    fontSize: 24,
    paddingRight: 25,
    paddingTop: 5
  },
  rightComponent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    marginRight: 10,
  },
  optionsButton: {
    marginLeft: 10,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '110%',
    marginRight: 10,
    marginLeft: -20,
    marginTop: 5,
  },
});

export default styles;
