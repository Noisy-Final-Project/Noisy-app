import { StyleSheet } from "react-native";

const NoisyStyles = StyleSheet.create({
    welcomeContainer: {
        flex: 1,
        backgroundColor: "powderblue",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        zIndex: 1,
    },
    header: {
        fontSize: 70,
        fontFamily: "serif",
        fontWeight: "bold",
        marginLeft: "10%",
        marginRight: "10%",
    },
    logo: {
        resizeMode: "contain",
        width: "80%",
        height: "30%",
        marginVertical: 100,
        marginHorizontal: 50,
        marginTop: "20%",
        marginBottom: "25%",
    },
    footer: {
        fontFamily: "serif",
        fontSize: 18,
        fontWeight: "bold",
        width: "90%",
    },
    container: {
        marginVertical: 100,
        marginHorizontal: 20,
        justifyContent: 'center',
        //alignSelf: "center",
    },
    title: {
        marginTop: 20,
        fontSize: 32,
        fontFamily: "serif",
        textAlign: "center",
        fontWeight: "bold"
    },
    link: {
        marginTop: 50,
        fontSize: 24,
        fontWeight: "700",
        fontFamily: "serif",
        textAlign: "center",
        color: "teal",
    },
    text: {
        marginTop: 5,
        fontSize: 18,
        fontWeight: "600",
    },
    centerText: {
        marginTop: 50,
        fontSize: 24,
        fontWeight: "300",
        fontFamily: "serif",
        textAlign: "center",
    },
    submitButton: {
        backgroundColor: "powderblue",
        height: 50,
        margin: 20,
        fontSize: 20,
        justifyContent: "center",
        marginHorizontal: 15,
        borderRadius: 24,
    },
    navigateLink: {
        marginVertical: 20,
        fontSize: 16,
        textAlign: "center",
        color: "teal",
    },
    isChecked: {
        fontSize: 16,
        textAlign: "center",
    },
    navigateMainMenu: {
        marginTop: 40,
        fontSize: 24,
        textAlign: "center",
        color: "teal",
    },
    linkButton: {
        backgroundColor: "powderblue",
        height: 45,
        fontSize: 20,
        justifyContent: "center",
        textAlignVertical: "center",
        textAlign: "center",
        alignSelf: "center",
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginHorizontal: 5,
        marginVertical: 15,
        borderRadius: 24,
    },
});

export default NoisyStyles;