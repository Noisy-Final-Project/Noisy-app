import { StyleSheet } from "react-native";

const NoisyStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "powderblue",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        zIndex: 1
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
    linkSmallButton: {
        backgroundColor: "powderblue",
        height: 50,
        fontSize: 20,
        justifyContent: "center",
        textAlignVertical: "center",
        textAlign: "center",
        marginHorizontal: 10,
        marginVertical: 15,
        borderRadius: 24,
    },
    linkLargeButton: {
        backgroundColor: "powderblue",
        height: 50,
        margin: 20,
        fontSize: 20,
        justifyContent: "center",
        textAlignVertical: "center",
        textAlign: "center",
        marginHorizontal: 10,
        marginVertical: 15,
        borderRadius: 24,
    },
    cardText: {
        marginTop: 5,
        fontSize: 18,
        fontWeight: "600",
    }
  });

  export default NoisyStyles;