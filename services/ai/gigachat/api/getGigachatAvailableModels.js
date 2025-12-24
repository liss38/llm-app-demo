import fetch from 'node-fetch';
import getGigachatAccessToken from './_getGigachatAccessToken.js';
import {
  gigachatApiUrl,
  disablesSSLVerificationAgentMode__NOT_FOR_PRODUCTION__,
} from '../gigachat.config.js'


const getGigachatAvailableModels = async () => {
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

        const modelsResponse = await fetch(`${gigachatApiUrl}/models`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json'
            },
            agent: disablesSSLVerificationAgentMode__NOT_FOR_PRODUCTION__,
        });

        if (!modelsResponse.ok) {
            const text = await modelsResponse.text();

            return ({
                isError: true,
                error: `GigaChat API error  (${gigachatApiUrl}/models)`,
                status: modelsResponse.status,
                body: text,
                payload: {},
            });
        }

        const data = await modelsResponse.json();
        console.log(`modelsResponse >>>>>  `,  data  );

        return ({
            isError: false,
            payload: {
                models: data.data,
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


export default getGigachatAvailableModels;
