// import https from 'https';
import dotenv from 'dotenv';


dotenv.config();


export const cloudruApiUrl = process.env.CLOUD_RU_BASE_URL;
export const cloudruKeyId = process.env.CLOUD_RU_KEY_ID;
export const cloudruKeySecret = process.env.CLOUD_RU_KEY_SECRET;
export const cloudruApiKey = cloudruKeySecret;
export const cloudruDefaultModel = `GigaChat/GigaChat-2-Max`;
export const cloudruMaxTokens = 4096;


if (!cloudruKeyId || !cloudruKeySecret) {
  throw new Error('Set  CLOUD_RU_KEY_ID  and  CLOUD_RU_KEY_SECRET  in  .env');
}
