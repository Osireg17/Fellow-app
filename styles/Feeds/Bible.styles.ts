import { Dimensions, StyleSheet } from "react-native";

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    marginTop: 10,
  },
  leftbutton: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 2,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  rightbutton: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 2,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
  buttonText: {
    color: '#000',
  },
  modalText: {
    marginTop: 15,
    textAlign: "center"
  },
  modalView: { // 10% of screen height
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 0,
    paddingTop: 35,
    paddingBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 0,
    height: '100%', // 80% of screen height
  },
  modalContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#000',
    marginBottom: 15,
    width: 120, // Reduce button width
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  chapterGrid: {
    flexDirection: 'row', // Arrange children in rows
    flexWrap: 'wrap', // Allow the rows to wrap if there are too many
    justifyContent: 'space-around', // Distribute children evenly with space around them
  },
  chapterItem: {
    margin: 5, // Margin around each grid item
    padding: 10, // Padding inside each grid item
    borderRadius: 5, // Rounded corners on each grid item
    backgroundColor: '#ddd', // Background color for each grid item
  },
});

export default styles;




