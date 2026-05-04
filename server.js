import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.method === 'POST') console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});


const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://your-db.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

// Initialize database
async function initDb() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        company TEXT,
        title TEXT,
        stage TEXT DEFAULT 'new',
        source TEXT,
        priority TEXT DEFAULT 'medium',
        score INTEGER DEFAULT 0,
        assigned_to TEXT,
        organization_id TEXT,
        tags TEXT,
        custom_fields TEXT,
        value REAL DEFAULT 0,
        activity_count INTEGER DEFAULT 0,
        last_activity DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        status TEXT,
        call_duration TEXT,
        transcript TEXT,
        call_summary TEXT,
        call_status TEXT,
        called_at DATETIME
      )
    `);
    
    // Add columns if they don't exist (for existing databases)
    const columns = [
      ['call_summary', 'TEXT'],
      ['call_status', 'TEXT'],
      ['called_at', 'DATETIME']
    ];
    
    for (const [name, type] of columns) {
      try {
        await client.execute(`ALTER TABLE leads ADD COLUMN ${name} ${type}`);
      } catch (e) {
        // Column probably already exists
      }
    }

    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
}

initDb();


// GET /api/leads
app.get('/api/leads', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM leads ORDER BY created_at DESC');
    // Parse JSON strings back to objects and map to camelCase
    const leads = result.rows.map(row => ({
      ...row,
      assignedTo: row.assigned_to,
      organizationId: row.organization_id,
      activityCount: row.activity_count || 0,
      lastActivity: row.last_activity || row.updated_at || row.created_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      tags: (() => {
        try {
          return row.tags ? JSON.parse(row.tags) : [];
        } catch (e) {
          return [];
        }
      })(),
      customFields: (() => {
        try {
          return row.custom_fields ? JSON.parse(row.custom_fields) : {};
        } catch (e) {
          return {};
        }
      })(),
      call_transcript: (() => {
        try {
          return row.call_transcript ? JSON.parse(row.call_transcript) : row.call_transcript;
        } catch (e) {
          return row.call_transcript;
        }
      })(),
    }));

    console.log(`Fetched ${leads.length} leads`);
    res.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// POST /api/leads
app.post('/api/leads', async (req, res) => {
  const lead = req.body;
  try {
    await client.execute({
      sql: `INSERT INTO leads (
        id, name, email, phone, company, title, stage, source, priority, 
        score, assigned_to, organization_id, tags, custom_fields, value, 
        notes, status, call_duration, transcript
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        lead.id || `lead-${Date.now()}`,
        lead.name,
        lead.email || '',
        lead.phone || '',
        lead.company || '',
        lead.title || '',
        lead.stage || 'new',
        lead.source || 'website',
        lead.priority || 'medium',
        lead.score || 0,
        lead.assignedTo || '',
        lead.organizationId || 'org-1',
        JSON.stringify(lead.tags || []),
        JSON.stringify(lead.customFields || {}),
        lead.value || 0,
        lead.notes || '',
        lead.status || 'Pending',
        lead.call_duration || '',
        lead.transcript || ''
      ]
    });
    res.status(201).json({ success: true, lead });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// Initiate Call (Ringg AI Outbound)
app.post('/api/call/initiate', async (req, res) => {
  const { leadId, phoneNumber, leadName } = req.body;
  console.log(`Initiating call for ${leadName} (${phoneNumber})...`);

  try {
    // 1. Fetch full lead data for webhook
    const leadResult = await client.execute({
      sql: 'SELECT * FROM leads WHERE id = ?',
      args: [leadId]
    });
    
    const lead = leadResult.rows[0];
    if (!lead) throw new Error('Lead not found');

    const customFields = lead.custom_fields ? JSON.parse(lead.custom_fields) : {};

    // 2. Trigger Activepieces Webhook
    try {
      const apPayload = {
        lead_id: lead.id,
        lead_name: lead.name,
        first_name: lead.name.split(' ')[0],
        mobile_number: lead.phone,
        course_name: customFields.course || lead.title || 'N/A',
        source: customFields.college || lead.company || 'N/A'
      };

      await fetch('https://cloud.activepieces.com/api/v1/webhooks/CIUDqV1POa2k2rcEG38M5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apPayload)
      });
      console.log('✅ Activepieces webhook triggered');
    } catch (apError) {
      console.error('❌ Activepieces webhook failed:', apError);
      // Don't fail the whole request if webhook fails
    }

    // 3. Initiate Call (Ringg AI)
    const response = await fetch('https://prod-api.ringg.ai/ca/api/v0/calling/outbound/individual', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.RINGG_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: lead.name,
        mobile_number: lead.phone,
        agent_id: process.env.RINGG_AGENT_ID,
        from_number_id: process.env.RINGG_FROM_NUMBER,
        metadata: {
          lead_id: lead.id
        },
        custom_args_values: {
          lead_id: lead.id
        }
      }),

    });


    const text = await response.text();
    console.log(`Ringg AI Response Status: ${response.status}`);
    console.log(`Ringg AI Response Body: ${text}`);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(`Ringg AI returned non-JSON response: ${text.slice(0, 100)}...`);
    }
    
    if (!response.ok) {
      throw new Error(data.message || data.error || data.detail || `Ringg AI error: ${response.status}`);
    }

    
    // Update lead status to "Calling"
    await client.execute({
      sql: 'UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: ['Calling', leadId]
    });


    res.json({ success: true, call_id: data.call_id });
  } catch (error) {
    console.error('Ringg AI Call Error:', error);
    res.status(500).json({ error: 'Failed to initiate call' });
  }
});

// Webhook Receiver (from Ringg AI)
app.post('/webhook/ringg-postcall', async (req, res) => {
  const {
    lead_id,
    callee_name,
    course_interested,
    call_status,
    summary,
    transcript,
    duration,
  } = req.body;

  console.log('Received Ringg Post-Call Webhook:', JSON.stringify(req.body, null, 2));

  try {
    await client.execute({
      sql: `UPDATE leads SET
              status        = 'called_by_ai',
              call_summary  = ?,
              call_transcript = ?,
              call_status   = ?,
              called_at     = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [
        summary || '', 
        typeof transcript === 'object' ? JSON.stringify(transcript) : (transcript || ''), 
        call_status || '', 
        lead_id
      ],
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating lead via webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





// Chat with Agentic AI (Anthropic + KB)
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  
  try {
    // 1. Load Knowledge Base
    let kbContent = '';
    try {
      kbContent = await fs.readFile('./knowledge_base.md', 'utf-8');
    } catch (e) {
      console.warn('Knowledge base file not found');
    }

    // 2. Call Anthropic API
    let apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is missing in .env');
    }
    
    apiKey = apiKey.trim().replace(/^["']|["']$/g, '');
    console.log(`Debug: API Key length: ${apiKey.length}, starts with: ${apiKey.substring(0, 7)}`);

    // Anthropic requires the first message to be from the user
    // And alternating roles: user, assistant, user, assistant...
    let formattedMessages = messages
      .filter((m) => m.content && m.content.trim().length > 0)
      .map((m) => ({
        role: m.role,
        content: m.content
      }));

    // Remove any assistant messages at the start
    while (formattedMessages.length > 0 && formattedMessages[0].role === 'assistant') {
      formattedMessages.shift();
    }

    console.log('Debug: Formatted Messages:', JSON.stringify(formattedMessages, null, 2));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,




        system: `You are an Agentic AI Assistant for I.T.S Engineering College Ghaziabad.
        
        KNOWLEDGE BASE:
        ${kbContent}
        
        STRICT RULES:
        - Use the knowledge base to answer student queries.
        - If the info is not in the KB, be helpful but mention you are checking with the admissions team.
        - Maintain a professional yet friendly tone (mix of English and Hindi/Hinglish where appropriate).
        - You can suggest calling the admissions team using our Ringg AI integration.`,
        messages: formattedMessages
      })
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API Error:', errorText);
      throw new Error(`Anthropic error: ${response.status}`);
    }

    const data = await response.json();
    res.json({ 
      content: data.content[0].text,
      role: 'assistant'
    });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'Failed to process chat' });
  }
});

// Serve static files from the Vite build directory
app.use(express.static(join(__dirname, 'dist')));

// Handle SPA routing - return index.html for any unknown routes
app.get('(.*)', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`\n🚀 Backend running on http://localhost:${port}`);
  console.log(`🎯 Turso DB: ${process.env.TURSO_DATABASE_URL}`);
});

