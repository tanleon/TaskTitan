import React from "react";
import { Text, Image, View, StyleSheet, TouchableOpacity } from "react-native";

export function Book({ title, image, author, availability, isSelected, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.card, isSelected && styles.selectedCard]}>
            <View style={styles.bookinfo}>
                <Image style={styles.image} source={{ uri: image }}
                    resizeMode="cover" />
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.author}>{author}</Text>
                </View>
            </View>
            <View>
                {availability ? (
                    <Text style={styles.available}>Available</Text>
                ) : (
                    <Text style={styles.notAvailable}>Not Available</Text>
                )}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '49%',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: 'white',
        margin: '0.5%',
        padding: 5,

        /* 
        backgroundColor: 'white',
        borderRadius: 16,
        alignItems: 'center',
        padding: '1%',
        marginTop: '3%',
        flexDirection: 'row',
        justifyContent: "space-between"
*/
    },
    selectedCard: {
        borderColor: '#f7e00f',
        borderWidth: 2,
    },
    bookinfo: {
        alignItems: 'center',
        flexShrink: 1
    },
    image: {
        height: 225,
        width: 155,
        borderRadius: 5
    },
    infoContainer: {
        padding: 5,
        flexShrink: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        flexShrink: 1,
    },
    author: {
        fontSize: 13,
        fontWeight: '400',
        marginBottom: 1,
        color: 'black'
    },
    available: {
        color: 'green',
        paddingRight: '1%'
    },
    notAvailable: {
        color: 'red',
        paddingRight: '1%'
    }
})