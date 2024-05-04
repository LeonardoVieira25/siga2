import { useEffect, useState } from "react";
import { StyleProp, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { Disciplina, SessionCredentials, States } from "../utils/types";
import session from "../utils/sessionManager";
import GetData from "../utils/scraper";
import { StatusModal } from "../components/StatusModal";
import { useNavigation } from "@react-navigation/native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

const BlocoDisciplina = ({ disciplina }: { disciplina: Disciplina }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        padding: 16,
        marginTop: 16,
        backgroundColor: colors.elevation.level5,
        borderRadius: 8,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <View
          style={{
            width: "80%",
          }}
        >
          <Text variant="titleMedium">{disciplina.nomeDisciplina}</Text>
          <View
            style={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Text variant="labelSmall">{disciplina.turma}</Text>
            <Text variant="labelSmall">{disciplina.codDisciplina}</Text>
          </View>
        </View>
        <View>
          <AnimatedCircularProgress
            size={60}
            width={5}
            fill={Number(disciplina.nota)}
            backgroundColor={colors.elevation.level4}
            tintColor={colors.primary}
            onAnimationComplete={() => console.log("onAnimationComplete")}
          >
            {() => (
              <Text variant="labelLarge">
                {disciplina.nota}
                {disciplina.nota != "" ? "%" : "N/A"}
              </Text>
            )}
          </AnimatedCircularProgress>
        </View>
      </View>
      <View
        style={{
          marginTop: 16,
        }}
      >
        <Text variant="labelSmall">Avaliações</Text>
        {disciplina.avaliacoes.map((avaliacao, index) => (
          <View
            key={index}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <Text variant="labelSmall">{avaliacao.descricao}</Text>
            <Text variant="labelSmall">{avaliacao.dataAplicacao}</Text>
            <Text variant="labelSmall">
              {avaliacao.nota != "" ? avaliacao.nota : "N/A"}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function Home({
  setState
}:{
  setState: (newState: States) => void;
}) {
  const { colors } = useTheme();
  const [credentials, setCredentials] = useState<SessionCredentials>();
  const [localState, setLocalState] = useState<States>("loading");
  const [data, setData] = useState<Disciplina[]>();

  useEffect(() => {
    session
      .getSessionCredentials()
      .then((sessionCredentials) => {
        setCredentials(sessionCredentials);
        setLocalState("idle");
      })
      .catch(() => {
        console.log("Não conseguiu pegar as credenciais de sessão");
        setLocalState("error");
      });
  }, []);

  useEffect(() => {
    if (credentials) {
      setLocalState("loading");
      GetData(credentials?.cpf, credentials?.passwordHash)
        .then((data) => {
          setData(data as Disciplina[]);
          setLocalState("idle");
        })
        .catch(() => {
          console.log("Não conseguiu pegar os dados da página");
          setLocalState("error");
        });
    }
  }, [credentials]);

  return (
    <View
      style={{
        backgroundColor: colors.background,
        width: "100%",
        height: "100%",
        paddingHorizontal: 16,
      }}
    >
      <StatusModal
        localState={localState}
        setLocalState={(newState) => setLocalState(newState)}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={localState === "loading"}
            onRefresh={() => {
              if (credentials) {
                setLocalState("loading");
                GetData(credentials?.cpf, credentials?.passwordHash)
                  .then((data) => {
                    setData(data as Disciplina[]);
                    setLocalState("idle");
                  })
                  .catch(() => {
                    console.log("Não conseguiu pegar os dados da página");
                    setLocalState("error");
                  });
              }
            }}
          />
        }
      >
        <Text variant="titleLarge">Suas disciplinas</Text>
        {data?.map((disciplina) => {
          return (
            <BlocoDisciplina
              key={disciplina.nomeDisciplina}
              disciplina={{
                ...disciplina,
              }}
            />
          );
        })}
        <Button onPress={() => session.logout()}>
          Voltar para o login
        </Button>
      </ScrollView>
    </View>
  );
}
