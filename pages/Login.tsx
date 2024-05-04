import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import session from "../utils/sessionManager";
import { StatusModal } from "../components/StatusModal";
import { States } from "../utils/types";

export default function Login({
  setState,
}: {
  setState: (state: States) => void;
}) {
  const { colors } = useTheme();

  const [cpf, setCpf] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  const [localState, setLocalState] = useState<States>("idle");

  const handleLogin = () => {
    setLocalState("loading");
    session
      .login(cpf, senha)
      .then(() => {
        setLocalState("success");
      })
      .catch(() => {
        setLocalState("error");
      });
  };

  useEffect(() => {
    if (localState === "success") {
      console.log("Logged in");
      setState("logged");
    }
  }, [localState]);

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 32,
      }}
    >
      <StatusModal
        localState={localState}
        setLocalState={setLocalState}
        tryAgain={handleLogin}
      />
      <Text variant="titleLarge">Siga Fuçado</Text>
      <View
        style={{
          width: "100%",
          margin: 16,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <Text variant="bodyMedium">Faça login com a sua conta do siga:</Text>
        <TextInput
          label="cpf"
          mode="outlined"
          value={cpf}
          onChange={(e) => setCpf(e.nativeEvent.text)}
        />
        <TextInput
          label="Senha"
          mode="outlined"
          value={senha.replace(/./g, "*")}
          onChange={(e) => setSenha(e.nativeEvent.text)}
        />
        <Button
          mode="contained-tonal"
          style={{
            marginTop: 16,
          }}
          onPress={() => {
            handleLogin();
          }}
        >
          Entrar
        </Button>
      </View>
    </View>
  );
}
