import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'SplitCompare', version: '1.3.0' });
  });

  // API endpoint for version and updates
  app.get('/api/version', (req, res) => {
    res.json({
      currentVersion: '1.3.0',
      latestVersion: '1.3.0',
      hasUpdate: false,
      releaseNotes: [
        'Улучшено сенсорное панорамирование (touch pan)',
        'Добавлен мультитач зум (pinch-to-zoom)',
        'Плавный кроссфейд для A/B переключения',
      ],
      downloadUrl: 'https://github.com/splitcompare/releases/latest',
    });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: 3000 },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SplitCompare server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start SplitCompare server:', err);
});
