import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function ModalButton({ icon, color, size, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Ionicons name={icon} color={color} size={size} />
    </Pressable>
  );
}

export default ModalButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
  },
  pressed: {
    opacity: 0.7,
  },
});
