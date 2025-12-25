import fetch from 'node-fetch';
import getGigachatAccessToken from './_getGigachatAccessToken.js';
import {
  gigachatApiUrl,
  disablesSSLVerificationAgentMode__NOT_FOR_PRODUCTION__,
} from '../gigachat.config.js'


const getGigachatBalance = async () => {
    try {
        const {
            accessToken,
            tokenExpiresAt,
            fromCache,
            isError,
            error,
        } = await getGigachatAccessToken();

        if (isError) {
            return ({   // @TODO/FIX
                error,
                accessToken,
                tokenExpiresAt,
                fromCache,
                payload: {},
            });
        }

        const balanceResponse = await fetch(`${gigachatApiUrl}/balance`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json'
            },
            agent: disablesSSLVerificationAgentMode__NOT_FOR_PRODUCTION__,
        });

        if (!balanceResponse.ok) {
            const text = await balanceResponse.text();

            return ({
                isError: true,
                error: `GigaChat API error  (${gigachatApiUrl}/balance)`,
                status: balanceResponse.status,
                body: text,
                payload: {},
            });
        }

        const data = await balanceResponse.json();

        return ({
            isError: false,
            payload: {
                gigachatBalance: data.balance,
            },
        });
  } catch (catchedError) {
    return ({
        isError: true,
        error: catchedError,
        payload: {},
    });
  }
};


export default getGigachatBalance;
