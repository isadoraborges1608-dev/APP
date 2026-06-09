// ════════════════════════════════════════════════════════════
//  BACKEND — Ponte segura para a FASHN API
//  Este arquivo roda na Vercel (serverless function).
//  A chave de API fica guardada em segredo aqui no servidor,
//  NUNCA no navegador.
// ════════════════════════════════════════════════════════════

export default async function handler(req, res) {
  // Permite que o app (front-end) chame esta função
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Navegador faz uma checagem antes do POST — respondemos OK
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

  // A chave fica numa variável de ambiente da Vercel (segura)
  const API_KEY = process.env.FASHN_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'FASHN_API_KEY não configurada na Vercel' });
  }

  const BASE_URL = 'https://api.fashn.ai/v1';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  };

  try {
    // O app envia: model_image (foto da pessoa) e garment_image (foto da roupa)
    // Ambas em base64 (data URL) ou URL pública.
    const { model_image, garment_image, category } = req.body;

    if (!model_image || !garment_image) {
      return res.status(400).json({ error: 'Faltam as imagens (pessoa e roupa)' });
    }

    // 1) Inicia a geração
    const runResp = await fetch(`${BASE_URL}/run`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model_name: 'tryon-v1.6',
        inputs: {
          model_image,
          garment_image,
          category: category || 'auto', // tops, bottoms, one-pieces ou auto
        },
      }),
    });

    const runData = await runResp.json();
    if (!runData.id) {
      return res.status(500).json({ error: 'Falha ao iniciar', detail: runData });
    }

    const predictionId = runData.id;

    // 2) Consulta o status até ficar pronto (máx ~60s)
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 3000)); // espera 3s entre consultas

      const statusResp = await fetch(`${BASE_URL}/status/${predictionId}`, { headers });
      const statusData = await statusResp.json();

      if (statusData.status === 'completed') {
        // Sucesso! Retorna a URL da imagem gerada
        return res.status(200).json({ image: statusData.output[0] });
      }

      if (!['starting', 'in_queue', 'processing'].includes(statusData.status)) {
        return res.status(500).json({ error: 'Geração falhou', detail: statusData.error });
      }
    }

    return res.status(504).json({ error: 'Tempo esgotado — tente novamente' });

  } catch (err) {
    return res.status(500).json({ error: 'Erro no servidor', detail: String(err) });
  }
}
