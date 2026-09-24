const { neon } = require('@neondatabase/serverless');

const readJsonBody = (req) => {
  if (typeof req.body === 'object' && req.body !== null) {
    return req.body;
  }
  if (typeof req.body === 'string' && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  return null;
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = readJsonBody(req);
  if (!body || !body.visitorId || typeof body.visitorId !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid visitorId' });
  }

  const visitorId = body.visitorId.trim();
  if (visitorId.length === 0 || visitorId.length > 255) {
    return res.status(400).json({ success: false, error: 'Invalid visitorId length' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ success: false, error: 'Database not configured' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    const result = await sql`
      WITH inserted AS (
        INSERT INTO visitors (visitor_id)
        VALUES (${visitorId})
        ON CONFLICT (visitor_id) DO NOTHING
        RETURNING visitor_id
      )
      SELECT 
        (SELECT COUNT(*) FROM inserted) as inserted_count,
        (SELECT COUNT(*) FROM visitors) as total_count;
    `;

    const isNewVisitor = parseInt(result[0].inserted_count, 10) > 0;
    const uniqueVisitors = parseInt(result[0].total_count, 10);

    return res.status(200).json({
      success: true,
      isNewVisitor,
      uniqueVisitors,
    });
  } catch (error) {
    console.error('Database error in POST /api/visitor:', error.message);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
