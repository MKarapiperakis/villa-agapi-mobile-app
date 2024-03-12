import { View, Text, TextInput, StyleSheet } from "react-native";

import { Colors } from "../../constants/styles";

function Input({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
        {label}
      </Text>
      <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid]}
        keyboardType={keyboardType}
        secureTextEntry={secure}
        onChangeText={onUpdateValue}
        autoCapitalize="none"
        value={value}
      />
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    color: "#1A1A1A",
    marginBottom: 4,
    fontFamily: 'poppins'
  },
  labelInvalid: {
    color: "#F05555",
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: "#E4D4D4",
    borderRadius: 4,
    fontSize: 16,
    fontFamily: 'poppins'
  },
  inputInvalid: {
    backgroundColor: Colors.error100,
  },
});
