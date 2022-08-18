import React from "react";
import { View, TextInput, Text } from "react-native";
import NoisyStyles from "../NoisyStyles";

const DateInput = ({
    name,
    value,
    setValue,
    namePosition
}) => {
    return (
        <View>
            {namePosition === "text" && (<Text style={NoisyStyles.text}>{name + ": "}</Text>)}
            <TextInput
                style={{
                    borderWidth: 2,  // size/width of the border
                    borderColor: 'lightgrey',  // color of the border
                    paddingLeft: 15,
                    height: 48,
                    marginVertical: 10,
                    flex: 5
                }}
                value={value}
                maxLength={10}
                placeholder={(namePosition === "placeholder") ? name + ": DD/MM/YYYY"
                                                                : "DD/MM/YYYY"}
                onChangeText={setValue}
            />
            
        </View>
    );
};

export default DateInput;