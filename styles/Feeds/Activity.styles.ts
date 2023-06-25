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
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default styles;