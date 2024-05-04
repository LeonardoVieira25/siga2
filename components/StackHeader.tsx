import { StackHeaderProps } from "@react-navigation/stack";
import { View } from "react-native";
import { Appbar, Text, useTheme } from "react-native-paper";
import Icon, {
  IconSource,
} from "react-native-paper/lib/typescript/components/Icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function getIcon(routeName: string): IconSource {
  switch (routeName) {
    case "Home":
      return "dots-horizontal";
    case "Login":
      return "information";
    case "Config":
      return "arrow-left";
    case "Info":
      return "arrow-left";
    default:
      return "dots-horizontal";
  }
}

function handleAction(props: StackHeaderProps) {
  const routeName = props.route.name;
  switch (routeName) {
    case "Home":
      props.navigation.navigate("Config");
      break;
    case "Login":
      props.navigation.navigate("Info");
      break;
    case "Config":
      props.navigation.goBack();
      break;
    case "Info":
      props.navigation.goBack();
      break;
    default:
      console.log("Default");
      break;
  }
}

export default function StackHeader({ props }: { props: StackHeaderProps }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Appbar
      style={{
        paddingTop: insets.top,
        backgroundColor: colors.surface,
        height: "auto",
      }}
    >
      <Appbar.Action
        icon={getIcon(props.route.name)}
        color={colors.primary}
        onPress={() => handleAction(props)}
      />
      <Appbar.Content title={props.route.name} color={colors.primary} />
    </Appbar>
  );
}
