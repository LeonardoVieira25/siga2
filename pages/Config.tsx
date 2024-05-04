import { useState } from "react";
import { RootStackParamList, States } from "../utils/types";
import { View } from "react-native";
import { Button, Icon, IconButton, Text, useTheme } from "react-native-paper";
import session from "../utils/sessionManager";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export default function Config({
  state,
  setState,
}: {
  state: States;
  setState: (state: States) => void;
}) {
  const { colors } = useTheme();
  const [localState, setLocalState] = useState<States>("logged");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <View
      style={{
        backgroundColor: colors.background,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        gap: 64,
      }}
    >
      <View>
        <Text variant="bodyMedium">
          Configure o espaço de tempo entre notificações
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <IconButton icon="minus" onPress={() => {}} />
          <Text>5 minutos</Text>
          <IconButton icon="plus" onPress={() => {}} />
        </View>
        <Button icon={"check"} mode="outlined">
          <Text>Salvar</Text>
        </Button>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Button
          icon={"information"}
          mode="outlined"
          onPress={() => navigation.navigate("Info")}
        >
          <Text>Saiba mais</Text>
        </Button>
        <Button
          onPress={() => {
            setLocalState("loading");
            session.logout().then(() => {
              setState("notLogged");
              navigation.replace("Login");
            });
          }}
        >
          Logout
        </Button>
      </View>
    </View>
  );
}
