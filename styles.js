import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    // Color palette
    colors: {
        primary: '#3498db',  // Bright blue
        secondary: '#e74c3c', // Bright red
        background: '#ecf0f1', // Light grayish blue, good for backgrounds
        white: '#ffffff',  // Crisp white
        black: '#2c3e50',  // Soft black
        grey: '#bdc3c7',  // Light grey
        error: '#e74c3c',  // Same as secondary, consistent for errors
    },

    // Text styles
    text: {
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#000',
        },
        subtitle: {
            fontSize: 14,
            color: '#666',
        },
        error: {
            fontSize: 14,
            color: '#FF6347', // use secondary color for errors
        },
        info: {
            fontSize: 18,
            color: '#2c3e50', // Soft black for informational text
        }
    },

    // Container styles
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f0f0f0', // using background color from palette
    },

    // Button styles
    button: {
        backgroundColor: '#007BFF', // primary color
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    buttonText: {
        color: '#fff', // white color for text on buttons
        fontSize: 14,
    },

    // Input styles
    input: {
        backgroundColor: '#fff', // white background for input fields
        borderColor: '#ccc', // grey border color
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 20,
    },

    // Section headers
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },

    picker: {
        width: '100%',
        height: 50,
    },
    info: {
        marginTop: 20,
    }
});
