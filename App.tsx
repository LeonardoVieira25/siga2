//* gerar apk: eas build -p android --profile preview

import "react-native-gesture-handler";

import { createDrawerNavigator } from "@react-navigation/drawer";

import {
  NavigationContainer,
  useNavigation
} from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import {
  MD3DarkTheme,
  MD3Theme,
  PaperProvider,
  Portal
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DrawerContent from "./components/DrawerContent";
import DrawerHeader from "./components/DrawerHeader";
import Home from "./pages/Home";
import LoadingScreen from "./pages/LoadingScreen";
import Login from "./pages/Login";

const drawerNavigator = createDrawerNavigator();
const DrawerNavigator = ({
  state,
  setState,
}: {
  state: States;
  setState: (state: States) => void;
}) => {
  if (state === "loading") {
    return <LoadingScreen setState={(newState) => setState(newState)} />;
  }
  useEffect(() => {
    console.log("Navigator: ", state);
  }, [state]);

  return (
    <drawerNavigator.Navigator
      drawerContent={(props) => (
        <DrawerContent
          props={props}
          setState={(newState) => setState(newState)}
          state={state}
        />
      )}
      screenOptions={{
        header: (props) => <DrawerHeader {...props} />,
      }}
    >
      {state === "logged" && (
        <drawerNavigator.Screen
          name="Home"
          children={() => <Home setState={(newState) => setState(newState)} />}
        />
      )}
      {state === "notLogged" && (
        <drawerNavigator.Screen
          name="Login"
          children={() => <Login setState={(newState) => setState(newState)} />}
        />
      )}
    </drawerNavigator.Navigator>
  );
};

import { createStackNavigator } from "@react-navigation/stack";
import StackHeader from "./components/StackHeader";
import Config from "./pages/Config";
import Info from "./pages/Info";
import { States } from "./utils/types";

const stackNavigator = createStackNavigator();

const StackNavigator = ({
  state,
  setState,
}: {
  state: States;
  setState: (state: States) => void;
}) => {
  const navigation = useNavigation();
  const getScreens = useMemo(() => {
    let screens = [];
    if (state === "loading") {
      screens.push(
        <stackNavigator.Screen
          key={"loading"}
          name="Loading"
          children={() => (
            <LoadingScreen setState={(newState) => setState(newState)} />
          )}
        />
      );
    }
    if (state === "logged") {
      screens.push(
        <stackNavigator.Screen
          key={"home"}
          name="Home"
          children={() => <Home setState={(newState) => setState(newState)} />}
        />
      );
    }
    if (state === "notLogged") {
      screens.push(
        <stackNavigator.Screen
          key={"login"}
          name="Login"
          children={() => <Login setState={(newState) => setState(newState)} />}
        />
      );
    }
    screens.push(
      <stackNavigator.Screen
        key={"info"}
        name="Info"
        children={() => <Info />}
      />
    );
    screens.push(
      <stackNavigator.Screen
        key={"config"}
        name="Config"
        children={() => (
          <Config setState={(newState) => setState(newState)} state={state} />
        )}
      />
    );
    return screens;
  }, [state]);

  return (
    <stackNavigator.Navigator
      screenOptions={{
        headerMode: "float",
        header: (props) => <StackHeader props={props} />,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            containerStyle: {
              backgroundColor: "transparent",
            },
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      {getScreens}
    </stackNavigator.Navigator>
  );
};

const theme: MD3Theme = {
  ...MD3DarkTheme,
  dark: true,
  roundness: 2,
  mode: "adaptive",
  colors: {
    ...MD3DarkTheme.colors,
    surface: "#080F0F",
    background: "#080F0F",
    secondaryContainer: "#EB5160",
    primary: "#EB5160",
  },
};

export default function App() {
  const [state, setState] = useState<States>("loading");

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <Portal.Host>
          <NavigationContainer>
            <StackNavigator
              state={state}
              setState={(newState) => setState(newState)}
            />
          </NavigationContainer>
        </Portal.Host>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
// export default function App() {
//   const [data, setData] = useState<Disciplina[]>();
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.tsx to start working on your app!</Text>
//       <Button
//         title="Press me"
//         onPress={() => {
//           GetData().then((data) => {
//             console.log(data);
//             if (isDisciplinaArray(data)) {
//               setData(data);
//             }
//           });
//         }}
//       />
//       {data?.map((disciplina) => (
//         <View key={disciplina.codDisciplina}>
//           <Text>{disciplina.nomeDisciplina}</Text>
//           <Text>{disciplina.anoSemestre}</Text>
//           <Text>{disciplina.nota}</Text>
//           <Text>{disciplina.situacao}</Text>
//           <Text>{disciplina.turma}</Text>
//           {disciplina.avaliacoes.map((avaliacao, index) => (
//             <View key={index}>
//               <Text>{avaliacao.dataAplicacao}</Text>
//               <Text>{avaliacao.descricao}</Text>
//               <Text>{avaliacao.nota}</Text>
//               <Text>{avaliacao.peso}</Text>
//             </View>
//           ))}
//         </View>
//       ))}
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
