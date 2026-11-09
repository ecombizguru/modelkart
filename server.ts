import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Server-side Supabase Configuration (Strictly Server-Side Secrets)
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const isServerSupabaseReady = Boolean(
  SUPABASE_URL && 
  (SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY) && 
  SUPABASE_URL.startsWith('http') &&
  !SUPABASE_URL.includes('your-project-id')
);

// Server-side admin client with service role key if available, else anon key
const supabaseAdmin = isServerSupabaseReady
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

// Ensure public/uploads directory exists
const uploadsDir = path.resolve(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Global Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static serving for uploaded files
app.use('/uploads', express.static(uploadsDir));

// Healthcheck endpoint for Google Cloud Run container liveness/readiness
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    environment: IS_PROD ? 'production' : 'development',
    service: 'ModelKart Talent & Location Marketplace API',
    supabaseConnected: isServerSupabaseReady,
    hasServiceRoleKey: Boolean(SUPABASE_SERVICE_ROLE_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Supabase Status & Setup Check Endpoint
app.get('/api/supabase/status', (_req: Request, res: Response) => {
  res.status(200).json({
    configured: isServerSupabaseReady,
    url: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 18)}...` : null,
    hasServiceRoleKey: Boolean(SUPABASE_SERVICE_ROLE_KEY),
    hasAnonKey: Boolean(SUPABASE_ANON_KEY),
    instructions: isServerSupabaseReady 
      ? 'Supabase backend connection verified.' 
      : 'To connect your production Supabase project, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment, and run the SQL migration in /supabase/migrations/20261109000000_modelkart_initial_schema.sql.',
  });
});

// Admin Migration SQL Review Endpoint
app.get('/api/admin/migration-sql', (_req: Request, res: Response) => {
  try {
    const migrationPath = path.resolve(__dirname, 'supabase', 'migrations', '20261109000000_modelkart_initial_schema.sql');
    if (fs.existsSync(migrationPath)) {
      const sql = fs.readFileSync(migrationPath, 'utf8');
      return res.status(200).json({ success: true, sql });
    }
    return res.status(404).json({ error: 'Migration file not found.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Admin Operations (Verification of Agencies, Talents, Properties, or Escrow Releases)
app.post('/api/admin/verify', async (req: Request, res: Response) => {
  const { entityType, entityId, verified, escrowRelease } = req.body;

  if (!entityType || !entityId) {
    return res.status(400).json({ error: 'entityType and entityId are required.' });
  }

  // If Supabase Admin is connected, perform server-side update with service role privileges
  if (supabaseAdmin) {
    try {
      const tableMap: Record<string, string> = {
        agency: 'agencies',
        talent: 'talents',
        property: 'properties',
        booking: 'bookings',
      };

      const table = tableMap[entityType];
      if (!table) {
        return res.status(400).json({ error: `Unsupported entityType: ${entityType}` });
      }

      let updatePayload: Record<string, any> = {};
      if (verified !== undefined) {
        updatePayload.verified = Boolean(verified);
      }
      if (escrowRelease && entityType === 'booking') {
        updatePayload.status = 'Completed & Released';
      }

      const { data, error } = await supabaseAdmin
        .from(table)
        .update(updatePayload)
        .eq('id', entityId)
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true, data, message: 'Database record updated successfully.' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Fallback response when Supabase is in local/hybrid mode
  return res.status(200).json({
    success: true,
    message: `Entity ${entityId} (${entityType}) verification updated in local state.`,
  });
});

// Authentication & Session Routes
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, persona } = req.body;

  if (!email && !persona) {
    return res.status(400).json({ error: 'Email or role persona is required.' });
  }

  // Predefined demo accounts or custom user login
  const role = persona || 'brand';
  const roleNameMap: Record<string, string> = {
    talent: 'Aarohi Sen (Top Runway Talent)',
    agency: 'Anima Creative Management (Head Booker)',
    property: 'Casa Beleza Host (Goa Luxury Villa)',
    brand: 'Sabyasachi Creative Atelier (Client Director)',
    admin: 'ModelKart Compliance & Platform Admin',
  };

  const user = {
    id: `user-${Date.now().toString().slice(-6)}`,
    email: email || `${role}@modelkart.in`,
    name: roleNameMap[role] || 'ModelKart User',
    role,
    avatar: role === 'talent' 
      ? '/src/assets/images/model_indian_high_fashion_female_1794221427331.jpg'
      : undefined,
    token: `mk-sec-token-${Buffer.from(`${role}-${Date.now()}`).toString('base64')}`,
    createdAt: new Date().toISOString(),
  };

  return res.status(200).json({ success: true, user });
});

app.get('/api/auth/session', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(200).json({ authenticated: false, user: null });
  }

  return res.status(200).json({
    authenticated: true,
    user: {
      id: 'user-active-session',
      email: 'director@modelkart.in',
      name: 'Active ModelKart Booker',
      role: 'brand',
    },
  });
});

// Image Upload Endpoint with Strict Validation
app.post('/api/upload', (req: Request, res: Response) => {
  try {
    const { dataUrl, filename } = req.body;

    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ error: 'Image data URL is required' });
    }

    // Validate MIME type
    const matches = dataUrl.match(/^data:(image\/(jpeg|jpg|png|webp));base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Invalid image format. Allowed: JPEG, PNG, WEBP.' });
    }

    const ext = matches[2] === 'jpeg' ? 'jpg' : matches[2];
    const base64Data = matches[3];
    const buffer = Buffer.from(base64Data, 'base64');

    // Max 5MB limit
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 5MB limit.' });
    }

    const safeName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(uploadsDir, safeName);
    fs.writeFileSync(filePath, buffer);

    return res.status(201).json({
      success: true,
      url: `/uploads/${safeName}`,
      sizeBytes: buffer.length,
      mimeType: matches[1],
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to process image upload.' });
  }
});

// Server-side Validation API Routes
app.post('/api/validation/talent', (req: Request, res: Response) => {
  const { name, dayRateInr, category, city } = req.body;
  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long.');
  }
  if (!dayRateInr || isNaN(Number(dayRateInr)) || Number(dayRateInr) < 1000) {
    errors.push('Day rate must be at least ₹1,000.');
  }
  if (!category) {
    errors.push('Discipline category is required.');
  }
  if (!city) {
    errors.push('Metro city is required.');
  }

  if (errors.length > 0) {
    return res.status(422).json({ valid: false, errors });
  }

  return res.status(200).json({ valid: true });
});

app.post('/api/validation/booking', (req: Request, res: Response) => {
  const { totalAmountInr, dates, clientName, projectTitle } = req.body;
  const errors: string[] = [];

  if (!projectTitle || projectTitle.trim().length < 3) {
    errors.push('Project title must be at least 3 characters.');
  }
  if (!clientName || clientName.trim().length < 2) {
    errors.push('Client/Brand name is required.');
  }
  if (!dates) {
    errors.push('Shoot date or call sheet timeline is required.');
  }
  if (!totalAmountInr || Number(totalAmountInr) <= 0) {
    errors.push('Total escrow deposit must be greater than zero.');
  }

  if (errors.length > 0) {
    return res.status(422).json({ valid: false, errors });
  }

  return res.status(200).json({ valid: true, escrowFee: 0, securedAmount: Number(totalAmountInr) });
});

// Start Full-Stack Server
async function startServer() {
  if (!IS_PROD) {
    // Development Mode: Mount Vite in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode: Serve compiled Vite static files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ModelKart] Server listening at http://0.0.0.0:${PORT} in ${IS_PROD ? 'production' : 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('[ModelKart] Failed to start server:', err);
  process.exit(1);
});
