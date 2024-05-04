import { DrawerHeaderProps } from "@react-navigation/drawer";
import { SafeAreaView, View } from "react-native";
import { Appbar, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DrawerHeader(props: DrawerHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  return (
    <Appbar
      style={{
        paddingTop: insets.top,
        backgroundColor: colors.surface,
        height: "auto"
      }}
    >
        <Appbar.Action
          icon="menu"
          onPress={() => props.navigation.openDrawer()}
        />
        <Appbar.Content title="Siga do Leleo" />
    </Appbar>
  );
}
