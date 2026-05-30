export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 从 Vercel 环境变量中读取你的密钥
  const API_KEY = process.env.BAIDU_API_KEY; 
  if (!API_KEY) {
    return res.status(500).json({ error: 'API Key not configured on server' });
  }

  const API_URL = "https://qianfan.baidubce.com/v2/chat/completions";
  const chatContext = req.body.context;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "ernie-speed-128k",
        messages: chatContext
      })
    });

    const data = await response.json();
    
    // 处理百度返回的错误
    if (data.error_code) {
      return res.status(400).json({ error: data.error_msg });
    }

    // 成功获取回复
    const aiResponse = data.choices?.[0]?.message?.content || "No response generated.";
    res.status(200).json({ result: aiResponse });

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
}
