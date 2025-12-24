import fetch from 'node-fetch';
import getGigachatAccessToken from './_getGigachatAccessToken.js';
import {
  gigachatApiUrl,
  disablesSSLVerificationAgentMode__NOT_FOR_PRODUCTION__,
} from '../gigachat.config.js'


const postGigachatChatCompletions = async (question, model = 'GigaChat') => {
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

        const response = await fetch(`${gigachatApiUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                model,        // GigaChat или GigaChat-2-Lite/Pro/Max и т.п. [web:50]
                messages: [
                    { role: 'user', content: question }
                ],
                stream: false
            }),
            agent: disablesSSLVerificationAgentMode__NOT_FOR_PRODUCTION__,
        });

        if (!response.ok) {
            const text = await response.text();
            return res.status(502).json({
                error: 'GigaChat API error',
                status: response.status,
                body: text,
            });
        }

        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content ?? null; // формат из доки [web:104][web:105]

        return ({
            isError: false,
            payload: {
                model,
                question,
                answer,
                modelVersion: data.model,
                usage: data.usage,
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


export default postGigachatChatCompletions;
