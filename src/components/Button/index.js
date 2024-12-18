import React from "react";
import { Text, Touchable, TouchableOpacity} from "react-native";
import { styles } from "./style";

const Button = ({title,onPress, style })=>{
    const handlePress=()=>{
        console.log("Button pressed")
    }

    return(
        <TouchableOpacity activeOpacity={0.6} style={[styles.container, style]} onPress={onPress}>
            <Text style={[styles.ButtonText,style]}>{title}</Text>
        </TouchableOpacity>
    )
}

export default React.memo(Button);