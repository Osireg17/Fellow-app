// UserProfileStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
  },
  avatar: {
    marginBottom: 15,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#888',
  },
  detailsContainer: {
    width: '100%',
  },
  detail: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    paddingLeft: 20,
  },
  value: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
    paddingLeft: 20,
    paddingTop: 20,
  },
  postContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    padding: 15,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  postUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },
  postUsername: {
    marginRight: 5,
    fontWeight: 'bold',
  },
  postUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postBibleInformation: {
    marginTop: 10,
    backgroundColor: '#f5f8fa',
    padding: 10,
    borderRadius: 10,
  },
  postBibleReference: {
    fontSize: 16,
    fontWeight: '500',
  },
  postBibleText: {
    fontSize: 14,
    marginTop: 5,
  },
  postUserOpinion: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
    marginTop: 10,
  },
  postTimestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 15,
  },
  scene : {
    flex: 1,
  },
});

export default styles;

