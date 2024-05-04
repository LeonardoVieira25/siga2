import { View } from "react-native";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Modal,
  Portal,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { States } from "../utils/types";

export function StatusModal({
  localState,
  setLocalState,
  tryAgain,
}: {
  localState: States;
  setLocalState: (state: States) => void;
  tryAgain?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Portal>
      <Modal
        visible={localState != "idle"}
        onDismiss={() => setLocalState("idle")}
      >
        <Surface
          style={{
            margin: 32,
          }}
        >
          {localState != "success" && (
            <IconButton
              onPress={() => setLocalState("idle")}
              icon={() => (
                <Ionicons name="close" size={24} color={colors.primary} />
              )}
              style={{
                alignSelf: "flex-end",
              }}
            />
          )}
          <View
            style={{
              padding: 32,
              paddingTop: localState != "success" ? 0 : 32,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            {localState === "loading" && (
              <>
                <Text variant="bodyLarge">Carregando...</Text>
                <ActivityIndicator
                  animating={true}
                  color={colors.primary}
                  size="large"
                />
              </>
            )}
            {localState === "error" && (
              <>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 16,
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Ionicons
                    name="alert-circle"
                    size={48}
                    color={colors.error}
                  />
                  <Text variant="bodyLarge">Erro ao fazer login</Text>
                </View>
                <Text variant="bodyMedium">
                  Verifique sua matrícula e senha. Se o erro persistir, tente
                  novamente mais tarde.
                </Text>
                {tryAgain && (
                  <Button mode="contained-tonal" onPress={tryAgain}>
                    Tentar novamente
                  </Button>
                )}
              </>
            )}
            {localState === "success" && (
              <>
                <Ionicons
                  name="checkmark-circle"
                  size={128}
                  color={colors.primary}
                />
              </>
            )}
          </View>
        </Surface>
      </Modal>
    </Portal>
  );
}
