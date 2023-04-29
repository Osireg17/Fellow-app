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
});