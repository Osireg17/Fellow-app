import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row', // Added to layout icon and text horizontally
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25
    },
    icon: {
        marginRight: 10, // Space between icon and text
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#14171A', // Twitter's dark text color
    },
    username: {
        color: '#657786', // Twitter's lighter text color
        // make the username bold
        fontWeight: 'bold',
    },
    action: {
        color: '#14171A', // Twitter's dark text color
    },
    postTitle: {
        color: '#14171A', // Twitter's dark text color
        fontWeight: 'bold',
    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 10,
    },
});

export default styles;
