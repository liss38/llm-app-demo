import fetch from 'node-fetch';
import {
  cloudruApiKey,
  cloudruApiUrl,
} from '../cloudru.config.js'


const cloudruBaseRequest = async (endpoint, options) => {
    const url = `${cloudruApiUrl}${endpoint}`;

    console.log(` >>>>>>>>>  cloudruBaseRequest `, url);
    
    const response = await fetch(url, {
      ...(options || {}),
      headers: {
        'Authorization': `Bearer ${cloudruApiKey}`,
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });

    console.log(` >>>>>>>>>  cloudruBaseRequest `, url, response);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloud.ru API error ${response.status}: ${error}`);
    }

    return response;
};


export default cloudruBaseRequest;
