const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ success: false, error: 'Database not configured' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    const countResult = await sql`
      SELECT COUNT(*) FROM visitors;
    `;

    const uniqueVisitors = parseInt(countResult[0].count, 10);

    return res.status(200).json({
      success: true,
      uniqueVisitors,
    });
  } catch (error) {
    console.error('Database error in GET /api/visitor/count:', error.message);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
