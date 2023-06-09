import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: 80,
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
    buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    },
    button: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#282C35',
    },
    buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    },
});

export default styles;
