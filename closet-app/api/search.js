// ════════════════════════════════════════════════════════════
//  BACKEND — Busca real de produtos via SearchAPI.io
//  A chave fica guardada em segredo na Vercel.
// ════════════════════════════════════════════════════════════

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  const API_KEY = process.env.SEARCHAPI_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'SEARCHAPI_KEY não configurada na Vercel' });
  }

  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Faltou a busca (query)' });

    // Busca no Google Shopping via SearchAPI.io, focada no Brasil
    const url = new URL('https://www.searchapi.io/api/v1/search');
    url.searchParams.set('engine', 'google_shopping');
    url.searchParams.set('q', query);
    url.searchParams.set('gl', 'br');      // país: Brasil
    url.searchParams.set('hl', 'pt-br');   // idioma: português
    url.searchParams.set('api_key', API_KEY);

    const resp = await fetch(url.toString());
    const data = await resp.json();

    // Normaliza os resultados (campo shopping_results)
    const list = data.shopping_results || data.shopping || [];
    const products = list.map(p => ({
      name: p.title || 'Produto',
      store: p.seller || p.source || '',
      price: p.price || (p.extracted_price ? `R$ ${p.extracted_price}` : ''),
      priceValue: p.extracted_price || parsePrice(p.price),
      img: p.thumbnail || p.image || '',
      link: p.product_link || p.link || '',
      rating: p.rating || null,
      delivery: p.delivery || '',
    }));

    return res.status(200).json({ products });

  } catch (err) {
    return res.status(500).json({ error: 'Erro no servidor', detail: String(err) });
  }
}

function parsePrice(priceStr) {
  if (!priceStr) return null;
  const cleaned = String(priceStr).replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3})/g, '').replace(',', '.');
  const val = parseFloat(cleaned);
  return isNaN(val) ? null : val;
}
