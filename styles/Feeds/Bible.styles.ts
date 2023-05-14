import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  versionContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  versionText: {
    fontSize: 18,
    fontWeight: '600',
  },
  bookContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#bbb',
    borderRadius: 5,
  },
  bookText: {
    fontSize: 16,
  },
  chapterContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#aaa',
    borderRadius: 5,
  },
  chapterText: {
    fontSize: 16,
  },
  verseContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#999',
    borderRadius: 5,
  },
  verseText: {
    fontSize: 14,
  },
  verseNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  verseComment: {
    fontSize: 12,
    color: '#777',
  },
});

export default styles;

