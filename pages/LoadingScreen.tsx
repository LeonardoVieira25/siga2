import { useEffect } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import session from "../utils/sessionManager";

export default function LoadingScreen({
  setState,
}: {
  setState: (state: "loading" | "logged" | "notLogged") => void;
}) {
  useEffect(() => {
    session
      .getSessionCredentials()
      .then((sessionCredentials) =>
        session.login(sessionCredentials.cpf, sessionCredentials.passwordHash)
      )
      .then(() => {
        setState("logged");
      })
      .catch(() => {
        setState("notLogged");
      });
  }, []);
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
      <ActivityIndicator animating={true} color={colors.primary} size={"large"} />
    </View>
  );
}
