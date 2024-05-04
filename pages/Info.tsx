import { Linking, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";

export default function Info() {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
        gap: 8,
      }}
    >
      <Text variant="bodyMedium">Esse aplicativo não é feito pela UFJF</Text>
      <Text variant="bodyMedium">
        Os dados são obtidos a partir do site da UFJF, portanto, o app depende
        da estabilidade do Siga.
      </Text>
      <Text variant="bodyMedium">
        Os dados de login são salvos localmente no seu dispositivo, e não são
        compartilhados com ninguém.
      </Text>
      <Text variant="bodyMedium">
        O código fonte do aplicativo está disponível em{" "}
        <Text
          variant="bodyMedium"
          style={{ color: colors.primary }}
          onPress={() =>
            Linking.openURL("https://github.com/LeonardoVieira25/siga2")
          }
        >
          https://github.com/LeonardoVieira25/siga2
        </Text>
      </Text>
      <Text variant="bodyMedium">
        Se você tiver alguma dúvida ou sugestão, entre em contato comigo no{" "}
        <Text
          variant="bodyMedium"
          style={{ color: colors.primary }}
          onPress={() => Linking.openURL("https://wa.me/+5531991822315")}
        >
          <Icon source={"whatsapp"} size={16} color={colors.primary} />{" "}
          WhatsApp
        </Text>
      </Text>
    </View>
  );
}
