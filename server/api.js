import express, { json } from 'express';
import { promises as fs } from 'fs';
import cors from 'cors';

const config = JSON.parse(await fs.readFile('server/config.json'));

const app = express();
app.use(cors());
app.use(json());

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const token = authHeader.split(' ')[1];

  if (token !== config.authKey) {
    return res.status(403).json({
      success: false,
      message: 'Invalid authentication key'
    });
  }

  next();
};

app.post('/api/auth/login', (req, res) => {
  const { key } = req.body;

  if (!key || key !== config.authKey) {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication key'
    });
  }

  res.json({
    success: true,
    message: 'Authentication successful',
    token: config.authKey
  });
});

app.get('/api/auth/verify', requireAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid'
  });
});

app.get('/api/laws', async (req, res) => {
  try {
    const data = await fs.readFile(config.lawsFilePath);
    const laws = JSON.parse(data);
    res.json(laws);
  } catch (error) {
    console.error('Error reading laws file:', error);
    res.status(500).send('Error fetching laws');
  }
});

app.post('/api/laws', requireAuth, async (req, res) => {
  try {
    const newLaw = req.body;

    if (!newLaw.name || !newLaw.description || !newLaw.category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, and category are required'
      });
    }

    const data = await fs.readFile(config.lawsFilePath);
    const laws = JSON.parse(data);

    const maxId = laws.reduce((max, law) => {
      const lawId = parseInt(law.id, 10);
      return lawId > max ? lawId : max;
    }, 0);

    newLaw.id = (maxId + 1).toString();

    laws.push(newLaw);

    await fs.writeFile(config.lawsFilePath, JSON.stringify(laws, null, 2));

    res.status(201).json({ success: true, law: newLaw });
  } catch (error) {
    console.error('Error creating law:', error);
    res.status(500).json({ success: false, message: 'Error creating law' });
  }
});

app.delete('/api/laws/:id', requireAuth, async (req, res) => {
  try {
    const lawId = req.params.id;

    const data = await fs.readFile(config.lawsFilePath);
    const laws = JSON.parse(data);

    const updatedLaws = laws.filter(law => law.id !== lawId);

    if (laws.length === updatedLaws.length) {
      return res.status(404).send('Law not found');
    }

    await fs.writeFile(config.lawsFilePath, JSON.stringify(updatedLaws, null, 2));

    res.json({ success: true, message: 'Law deleted successfully' });
  } catch (error) {
    console.error('Error deleting law:', error);
    res.status(500).send('Error deleting law');
  }
});

app.put('/api/laws/:id', requireAuth, async (req, res) => {
  try {
    const lawId = req.params.id;
    const updatedLaw = req.body;

    console.log(`Updating law ${lawId} with data:`, updatedLaw);

    if (!updatedLaw.name || !updatedLaw.description || !updatedLaw.category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, and category are required'
      });
    }

    const data = await fs.readFile(config.lawsFilePath);
    const laws = JSON.parse(data);

    const lawIndex = laws.findIndex(law => law.id === lawId);

    if (lawIndex === -1) {
      return res.status(404).json({ success: false, message: 'Law not found' });
    }

    updatedLaw.id = lawId;
    laws[lawIndex] = updatedLaw;

    console.log("Laws after update:", laws);

    await fs.writeFile(config.lawsFilePath, JSON.stringify(laws, null, 2));

    res.json({ success: true, law: updatedLaw });
  } catch (error) {
    console.error('Error updating law:', error);
    res.status(500).json({ success: false, message: 'Error updating law' });
  }
});

app.listen(config.port, () => {
  console.log(`Сервер физических законов запущен на порту ${config.port}`);
});
