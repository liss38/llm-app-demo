import express from 'express';
import dotenv from 'dotenv';
import {
  getGigachatAccessToken,
  getGigachatAvailableModels,
} from './services/ai/gigachat/index.js'


dotenv.config();


const app = express();
app.use(express.json());


const runtimeState = {
  user: {
    selectedModel: ``,
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











// app.post('/ask', async (req, res) => {
//   try {
//     const { question } = req.body;
//     if (!question) {
//       return res.status(400).json({ error: 'Field "question" is required' });
//     }

//     const response = await fetch(GIGACHAT_API_URL, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${process.env.GIGACHAT_TOKEN}`,
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//       body: JSON.stringify({
//         model: 'GigaChat',          // или нужная модель из доки
//         messages: [
//           { role: 'user', content: question }
//         ],
//         stream: false
//       })
//     });

//     if (!response.ok) {
//       const text = await response.text();
//       return res.status(502).json({
//         error: 'GigaChat API error',
//         status: response.status,
//         body: text
//       });
//     }

//     const data = await response.json();

//     // Ожидаемый формат похож на OpenAI: choices[0].message.content
//     const answer = data.choices?.[0]?.message?.content ?? null;

//     res.json({
//       question,
//       raw: data,
//       answer
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});