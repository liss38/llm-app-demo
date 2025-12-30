import cloudruBaseRequest from './_cloudruBaseRequest.js';
import {
    cloudruDefaultModel,
    cloudruMaxTokens,
} from '../cloudru.config.js';


const postCloudruChatCompletions = async (question, options) => {
    const requestPayload = {
        model: options?.model || cloudruDefaultModel,
        messages: [
            { role: 'user', content: question }
        ],
        temperature: options?.temperature ?? 0.1,
        max_tokens: options?.max_tokens ?? parseInt(cloudruMaxTokens || '2000'),
        stream: options?.stream ?? false,
    };

    console.log(`!!!!!!!!!!`,  requestPayload);


    try {
        const response = await cloudruBaseRequest(`/chat/completions`, {
            method: 'POST',
            body: JSON.stringify(requestPayload),
        });

        if (!response.ok) {
            const text = await response.text();
            return res.status(502).json({
                error: 'CloudRu API error',
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
        console.log(`ewhferkjgekrjgkjerhgjk`, catchedError)
        return ({
            isError: true,
            error: catchedError,
            payload: {},
        });
    }
};


export default postCloudruChatCompletions;
