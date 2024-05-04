import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { useEffect } from "react";
import { Drawer, Text, useTheme } from "react-native-paper";
import { States } from "../utils/types";

export default function DrawerContent({
  props,
  state,
  setState,
}: {
  props: DrawerContentComponentProps;
  state: States;
  setState: (state: States) => void;
}) {
  useEffect(()=>{
    console.log('DrawerContent: ',state)
  },[state])
  const { colors } = useTheme();
  return (
    <DrawerContentScrollView
      style={{
        backgroundColor: colors.background,
      }}
    >
      <Drawer.Section
        style={{
          marginTop: 16,
        }}
      >
        {state === "notLogged" && (
          <Drawer.Item
            label="Home"
            onPress={() => {
              props.navigation.navigate("Home");
            }}
          />
        )}
        {state === "logged" && (
          <Drawer.Item
            label="Login"
            onPress={() => {
              props.navigation.navigate("Login");
            }}
          />
        )}
      </Drawer.Section>
    </DrawerContentScrollView>
  );
}
