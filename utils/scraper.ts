import axios from 'axios';
import * as Crypto from 'expo-crypto';
import cheerio from 'cheerio';
import { Disciplina } from './types';


function makeRequest(url: string, method: "GET" | "POST", data: any = undefined, phpSessionId: string | undefined = undefined) {
    return new Promise((resolve, reject) => {
        // var data = JSON.stringify({
        //     "user": 10901228613,
        //     "password": "",
        //     "uid": 10901228613,
        //     "pwd": "",
        //     "tries": "",
        //     "redir": "",
        //     "url": "",
        //     "challenge": "",
        //     "response": "",
        //     "__ISAJAXCALL": "yes"
        // });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function (): void {
            // console.log("this.responseText: ");
            // console.log(this.responseText);
            if (this.readyState === 4) {
                console.log(this)
                console.log(xhr.getAllResponseHeaders())
                resolve({
                    responseText: this.responseText,
                    phpSessionId: (this.getResponseHeader("Set-Cookie") || "").match(new RegExp(`^${"PHPSESSID"}=(.+?);`))?.[1]
                });
            }
        });

        xhr.addEventListener("error", function () {
            reject({
                responseText: this.responseText,
                phpSessionId: (this.getResponseHeader("Set-Cookie") || "").match(new RegExp(`^${"PHPSESSID"}=(.+?);`))?.[1]
            });
        });

        xhr.open(method, url);
        // xhr.setRequestHeader("", "");
        phpSessionId && xhr.setRequestHeader("Cookie", `PHPSESSID=${phpSessionId}`);
        data && xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(data);
    });
}

async function authenticate(user: string, passwordHash: string): Promise<string | undefined> {
    const headers = {
        'Host': 'sigam1.ufjf.br',
        'Content-Length': '250',
        'Cache-Control': 'max-age=0',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Upgrade-Insecure-Requests': '1',
        'Origin': 'https://sigam1.ufjf.br',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.71 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-User': '?1',
        'Sec-Fetch-Dest': 'document',
        'Referer': 'https://sigam1.ufjf.br/index.php/siga/main',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Priority': 'u=0, i',
        'Connection': 'close'
    };

    const data = {
        'user': user,
        'password': '',
        'uid': user,
        'pwd': '',
        'tries': '',
        'redir': '',
        'url': '',
        'challenge': '',
        'response': '',
        '__ISAJAXCALL': 'yes'
    };

    try {
        // Perform the initial request to get the PHPSESSID and challenge value
        const mainRequest = await axios.post("https://sigam1.ufjf.br/index.php/siga/main", data, { headers });

        // const phpSeed = mainRequest.headers['set-cookie'][0].split('PHPSESSID=')[1].split(';')[0];
        const $ = cheerio.load(mainRequest.data);
        const challengeValue = $('#challenge').val();

        data.challenge = challengeValue;
        const hashResponse = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.MD5,
            `${user}:${passwordHash}:${challengeValue}`,
            { encoding: Crypto.CryptoEncoding.HEX }
        );

        data.response = hashResponse;
        // headers['Cookie'] = `PHPSESSID=${phpSeed}`;

        // Perform the authentication request
        const response = await axios.post("https://sigam1.ufjf.br/index.php/siga/login/authenticate/?", data, { headers });
        console.log(response);
        // return phpSeed;
    } catch (error) {
        console.error('Authentication failed:', error);
        return undefined;
    }
}





async function getDataPage(cpf: string, senhaHash: string) {
    console.log('getDataPage');
    let response;
    try {
        response = await axios.get("https://sigam1.ufjf.br/index.php/siga/academico/acessoaluno/formNota")
    } catch (error) {
        console.log('error');
        await authenticate(cpf, senhaHash);
        console.log('authenticate');
        response = await axios.get("https://sigam1.ufjf.br/index.php/siga/academico/acessoaluno/formNota").catch((error) => {
            console.log('error');
        console.log(error)
        })

    }
    console.log('response');
    // if (!estaLogado(responseText)) {
    //     await authenticate(cpf, senhaHash);
    // }
    const responseText = await response.data;
    return responseText;
}

function estaLogado(pageText: string) {
    return !pageText.includes("rio fazer login para acessar a aplica");
}



function getPageData(htmlPage: string): Disciplina[] {
    const avaliacoes: any[] = [];
    const disciplinasPattern = /gridMatriculas\.setData\((.*?)\);/s;
    const notasPattern = /gridNotas\d+\.setData\(\s*(\[[^;]+)\);/g;
    let match: RegExpExecArray | null;

    while ((match = notasPattern.exec(htmlPage))) {
        let resultado = match[1].replace(/\n/g, '');
        resultado = resultado.replace(/(\d+),(\d+)/g, '$1.$2');
        resultado = resultado.replace(/(\{|\,)(\w+):/g, '$1"$2":');

        try {
            const data = JSON.parse(resultado);
            avaliacoes.push(data);
        } catch (e) {
            console.log(`Não foi possível decodificar o JSON: ${e}`);
        }
    }

    const disciplinasMatch = disciplinasPattern.exec(htmlPage);
    let disciplinas: Disciplina[] = [];

    if (disciplinasMatch) {
        let objetos = disciplinasMatch[1];
        objetos = objetos.replace(/(\{|\,)(\w+):/g, '$1"$2":');

        try {
            disciplinas = JSON.parse(objetos);
        } catch (e) {
            console.log(`Não foi possível decodificar o JSON: ${e}`);
        }
    } else {
        console.log("Nenhum dado encontrado.");
    }

    disciplinas.forEach((disciplina, index) => {
        disciplina.avaliacoes = avaliacoes[index];
    });

    return disciplinas;
}

// export async function checkLogin() {
//     return new Promise(async (resolve, reject) => {
//         session.getSessionCredentials()
//         .them((credentials) => {

//             })
//         // if (SessionCredentials) {
//         //     resolve(true);
//         // } else {
//         //     resolve(false);
//         // }
//     });
// }

export async function generateHashMd5(input: string) {
    return Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.MD5,
        input,
        { encoding: Crypto.CryptoEncoding.HEX }
    );
}
export default async function GetData(cpf: string, senhaHash: string) {

    return new Promise((resolve, reject) => {
        console.log('scraper');
        // getDataPage(cpf, senhaHash).then((response) => {
        getDataPage(cpf, senhaHash).then((response) => {
            console.log('usuario logado');

            // const materiasString = response.split("gridMatriculas.setData(")[1].split(");")[0]
            // console.log(materiasString)
            // const materias = JSON.parse(materiasString);

            resolve(getPageData(response));
        }).catch(err => {
            reject(err);
        });
    });
}