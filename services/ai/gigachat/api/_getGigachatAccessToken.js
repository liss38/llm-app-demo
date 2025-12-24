import fetch from 'node-fetch';
import {
  gigachatAuthHeaders,
  gigachatAuthParams,
  gigachatOAuthUrl,
  disablesSSLVerificationAgentMode__NOT_FOR_PRODUCTION__,
} from '../gigachat.config.js'



let cachedToken = null;
let tokenExpiresAt = 0;

const getGigachatAccessToken = async () => {
    const now = Date.now();

    if (cachedToken && now < tokenExpiresAt) {
        return ({
                accessToken: cachedToken,
                tokenExpiresAt,
                fromCache: true,
                isError: false,
                error: ``,
            });
    }

    try {
        const response = await fetch(gigachatOAuthUrl, {
            method: 'POST',
            headers: { ...gigachatAuthHeaders },
            body: gigachatAuthParams.toString(),
            agent: disablesSSLVerificationAgentMode__NOT_FOR_PRODUCTION__,
        });


        if (!response.ok) {
            const text = await response.text();

            return ({
                accessToken: cachedToken,
                tokenExpiresAt,
                fromCache: false,
                isError: true,
                error: `GigaChat auth error ${resp.status}: ${text}`,
            });
        }

        const data = await response.json();
        cachedToken = data.access_token;
        tokenExpiresAt = data.expires_at;
        console.log(`getGigachatAccessToken  >>>>>>>>>>`,  data  );

        return ({
            accessToken: data.access_token,
            tokenExpiresAt,
            fromCache: false,
            isError: false,
            error: ``,
        });
    } catch (catchedError) {
        return ({
            accessToken: cachedToken,
            tokenExpiresAt,
            fromCache: false,
            isError: true,
            error: catchedError,
        });
    }
};


export default getGigachatAccessToken;
