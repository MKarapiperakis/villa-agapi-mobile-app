import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";

function LoadingOverlay({ message, backgroundColor }) {
  return (
    <View style={[styles.rootScreen, { backgroundColor: backgroundColor }]}>
      <Text style={styles.message}>{message}</Text>
      <ActivityIndicator size="large" color="#4169E1" />
    </View>
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
  },

  message: {
    fontSize: 16,
    marginBottom: 12,
    color: "white",
  },
});
