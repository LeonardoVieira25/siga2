export type Avaliacao = {
    dataAplicacao: string;
    descricao: string;
    nota: string;
    peso: string;
}
export type Disciplina = {
    anoSemestre: string;
    avaliacoes: Avaliacao[];
    codDisciplina: string;
    nomeDisciplina: string;
    nota: string;
    situacao: string;
    turma: string;
    tipoCalc: string;
}

export type SessionCredentials = {
    cpf: string;
    passwordHash: string;
}

export type States = "loading" | "logged" | "notLogged" | "error" | "success" | "idle";

export type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    Config: undefined;
    Info: undefined;
};