export default async function handler(req, res) {
  // CORS headers для работы из браузера
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-goog-api-key');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Извлекаем путь API из URL
    const apiPath = req.url.replace(/^\//, '');
    
    // Целевой URL Google Gemini API
    const targetUrl = `https://generativelanguage.googleapis.com/${apiPath}`;
    
    console.log('Proxying request to:', targetUrl);
    
    // Пересылаем заголовки
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Передаем API ключ из заголовка
    if (req.headers['x-goog-api-key']) {
      headers['x-goog-api-key'] = req.headers['x-goog-api-key'];
    }
    
    // Выполняем запрос к Google API
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });
    
    const data = await response.json();
    
    // Возвращаем ответ
    res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: {
        message: 'Proxy error: ' + error.message 
      }
    });
  }
}
