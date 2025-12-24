import https from 'https';
import dotenv from 'dotenv';


dotenv.config();


export const gigachatApiUrl = 'https://gigachat.devices.sberbank.ru/api/v1'; // process.env.GIGACHAT_API_URL;
export const gigachatOAuthUrl = `${process.env.GIGACHAT_API_V2}/oauth`;
export const gigachatClientId = process.env.GIGACHAT_CLIENT_ID;     // Client ID
export const gigachatClientSecret = process.env.GIGACHAT_CLIENT_SECRET; // Authorization Key

if (!gigachatClientId || !gigachatClientSecret) {
  throw new Error('Set GIGACHAT_CLIENT_ID and GIGACHAT_CLIENT_SECRET in .env');
}

export const scope = 'GIGACHAT_API_PERS';
export const gigachatAuthKey = Buffer.from(`${gigachatClientId}:${gigachatClientSecret}`).toString('base64');

export const disablesSSLVerificationAgentMode__NOT_FOR_PRODUCTION__ = new https.Agent({
    rejectUnauthorized: false  // Отключает проверку SSL  !Не для продакшена
})



export const gigachatAuthHeaders = {
    'Authorization': `Basic ${gigachatAuthKey}`,
    'Content-Type': 'application/x-www-form-urlencoded',
    'RqUID': '550e8400-e29b-41d4-a716-446655440000',
};

export const gigachatAuthParams = new URLSearchParams({
    scope: 'GIGACHAT_API_PERS',        // ❌ Не GIGACHAT_API_PRO
    grant_type: 'client_credentials'   // Обязательно!
});


// module.exports = {
//     gigachatApiUrl,
//     gigachatClientId,
//     gigachatClientSecret,
//     scope,
//     gigachatAuthKey,
//     gigachatAuthHeaders,
//     gigachatAuthParams,
// };
