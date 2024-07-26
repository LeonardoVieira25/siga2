import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionCredentials } from './types';
import GetData, { generateHashMd5 } from './scraper';

class Session {
    async getSessionCredentials() {
        return new Promise<SessionCredentials>(async (resolve, reject) => {
            try {
                const cpf = await AsyncStorage.getItem('cpf');
                const passwordHash = await AsyncStorage.getItem('passwordHash');

                if (cpf !== null && passwordHash !== null) {
                    resolve({ cpf, passwordHash } as SessionCredentials);
                } else {
                    reject();
                }
            } catch (error) {
                reject();
            }
        });
    }
    async setSessionCredentials(cpf: string, passwordHash: string) {
        return new Promise<void>(async (resolve, reject) => {
            try {
                await AsyncStorage.setItem('cpf', cpf);
                await AsyncStorage.setItem
                    ('passwordHash', passwordHash);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    async login(cpf: string, password: string) {
        return new Promise<void>(async (resolve, reject) => {
            generateHashMd5(password)
                .then((passwordHash) => {
                    console.log("passwordHash");
                    console.log(passwordHash);
                    AsyncStorage.setItem('cpf', cpf);
                    AsyncStorage.setItem('passwordHash', passwordHash);
                    GetData(cpf, passwordHash).then((data) => {
                        console.log(data);
                        return this.setSessionCredentials(cpf, passwordHash);
                    }).then(() => {
                        resolve()
                    }).catch((error) => {
                        reject(error);
                    });
                })
                .catch((error) => {
                    console.log("Error: ", error);
                    reject(error);
                });
        });
    }
    async logout() {
        return new Promise<void>(async (resolve, reject) => {
            try {
                await AsyncStorage.removeItem('cpf');
                await AsyncStorage.removeItem('passwordHash');
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}

const session = new Session();
export default session;