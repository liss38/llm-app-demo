import express from 'express';
import dotenv from 'dotenv';

import {
  getGigachatAccessToken,
  getGigachatAvailableModels,
  postGigachatChatCompletions,
  getGigachatBalance,
} from './services/ai/gigachat/index.js'

import {
  cloudruBaseRequest,
  postCloudruChatCompletions,
} from './services/ai/cloudru/index.js';


dotenv.config();


const app = express();
app.use(express.json());


const runtimeState = {
  user: {
    userId: ``,
    selectedModel: ``,
    settingsAndMeta: {},
  },
  llm: {},
};

const updateRuntimeState = () => {};



app.post(`/test-post`, async (req, res) => {
  console.log(`>>>>>>  /tets-post: `)

  try {
    const reqBody = req.body;
    console.log(req, res, reqBody)
    res.json({
      testResult: `OK`,
    });
  } catch (catchedError) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }

  console.log(`====================`)
});


// 
// 
// @NOTE:  Получить токен доступа  /gigachat/auth
app.post(`/gigachat/auth`, async (req, res) => {
  const {
    accessToken,
    tokenExpiresAt,
    fromCache,
    isError,
    error,
  } = await getGigachatAccessToken();

  if (isError) {
    return res.status(502).json({   // @TODO/FIX
      error,
      // status: response.status,
      accessToken,
      tokenExpiresAt,
      fromCache,
      body: `getGigachatAccessToken`
    });
  }

  res.json({
    gigachatAccessToken: accessToken,
    tokenExpiresAt,
    fromCache,
  });
});
// 
// 
// 
// 
// 
// @NOTE:  Показать доступные модели  /gigachat/models
app.get(`/gigachat/models`, async (req, res) => {
  const response = await getGigachatAvailableModels();
  console.log(` getGigachatAvailableModels >>>>>>  `,  response  );

  if (response.isError) {
    return res.status(502).json({
      ...response,
    });
  }

  runtimeState.llm.gigachat = response.payload.models;

  res.json({
    ...response,
    payload: {
      ...response.payload,
      runtimeState,
    },
  });
});
// 
// 
// 
// 
// @NOTE:  Узнать информацию о балансе  /gigachat/balance
app.get(`/gigachat/balance`, async (req, res) => {
  const response = await getGigachatBalance();
  console.log(` getGigachatBalance >>>>>>  `,  response  );

  if (response.isError) {
    return res.status(502).json({
      ...response,
    });
  }

  runtimeState.user.settingsAndMeta.gigachatBalance = response.payload.gigachatBalance;

  res.json({
    ...response,
    payload: {
      ...response.payload,
      runtimeState,
    },
  });
});
// 
// 
// 
// 
// @NOTE:  Пользовательский выбор основной LLM
app.post(`/selectModel`, (req, res) => {
  const selectedModel = req.body.selectedModel || ``;

  runtimeState.user.selectedModel = selectedModel;
  
  res.json({
    payload: {
      selectedModel,
      runtimeState,
    },
  });
})
// 
// 
// 
// 
// 
// 
// @NOTE:  POST /ask — пересылает вопрос в GigaChat
app.post('/ask', async (req, res) => {
  try {
    const { question, sourceFrom = `GigaChat` } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Field \"question\" is required' });
    }


    // 
    // @TODO/REFACT:
    console.log(`>>>>>>>> sourceFrom: `, sourceFrom);
    const response = await (
      sourceFrom === `CloudRu` 
        ? postCloudruChatCompletions(question)
        : postGigachatChatCompletions(question)
    );
    // ----
    // 

    
    
    
    if (response.isError) {
      return res.status(502).json({
        ...response,
      });
    }

    res.json({ ...response });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// 
// 
// 


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});