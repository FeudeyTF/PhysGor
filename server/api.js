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
      message: 'Необходима аутентификация!'
    });
  }

  const token = authHeader.split(' ')[1];

  if (token !== config.authKey) {
    return res.status(403).json({
      success: false,
      message: 'Неправильный ключ входа!'
    });
  }

  next();
};

app.post('/api/auth/login', (req, res) => {
  const { key } = req.body;

  if (!key || key !== config.authKey) {
    return res.status(401).json({
      success: false,
      message: 'Неправильный ключ входа!'
    });
  }

  res.json({
    success: true,
    message: 'Успешная аутентификация!',
    token: config.authKey
  });
});

app.get('/api/auth/verify', requireAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Ключ входа правильный'
  });
});

app.get('/api/laws', async (req, res) => {
  try {
    const data = await fs.readFile(config.lawsFilePath);
    const laws = JSON.parse(data);
    res.json(laws);
  } catch (error) {
    console.error('Произошла ошибка при сборе законов из файла:', error);
    res.status(500).send('Произошла ошибка при сборе законов из файла!');
  }
});

app.post('/api/laws', requireAuth, async (req, res) => {
  try {
    const newLaw = req.body;

    if (!newLaw.name || !newLaw.description || !newLaw.category) {
      return res.status(400).json({
        success: false,
        message: 'Имя, описание и категория обязательны!'
      });
    }

    if (newLaw.notes && newLaw.notes.length > 0) {
      const hasInvalidNote = newLaw.notes.some(
        note => !note.title || !note.text
      );
      
      if (hasInvalidNote) {
        return res.status(400).json({
          success: false,
          message: 'Все примечания должны иметь название и текст!'
        });
      }
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
    console.error('Произошла ошибка при создании закона:', error);
    res.status(500).json({ success: false, message: 'Произошла ошибка при создании закона!' });
  }
});

app.delete('/api/laws/:id', requireAuth, async (req, res) => {
  try {
    const lawId = req.params.id;

    const data = await fs.readFile(config.lawsFilePath);
    const laws = JSON.parse(data);

    const updatedLaws = laws.filter(law => law.id !== lawId);

    if (laws.length === updatedLaws.length) {
      return res.status(404).send('Закон не найден!');
    }

    await fs.writeFile(config.lawsFilePath, JSON.stringify(updatedLaws, null, 2));

    res.json({ success: true, message: 'Закон успешно удалён' });
  } catch (error) {
    console.error('Произошла ошибка при удалении закона:', error);
    res.status(500).send('Произошла ошибка при удалении закона!');
  }
});

app.put('/api/laws/:id', requireAuth, async (req, res) => {
  try {
    const lawId = req.params.id;
    const updatedLaw = req.body;

    console.log(`Обновляю закон с ID: ${lawId} на:`, updatedLaw);

    if (!updatedLaw.name || !updatedLaw.description || !updatedLaw.category) {
      return res.status(400).json({
        success: false,
        message: 'Имя, описание и категория обязательны!'
      });
    }

    if (updatedLaw.notes && updatedLaw.notes.length > 0) {
      const hasInvalidNote = updatedLaw.notes.some(
        note => !note.title || !note.text
      );
      
      if (hasInvalidNote) {
        return res.status(400).json({
          success: false,
          message: 'Все примечания должны иметь название и текст!'
        });
      }
    }

    const data = await fs.readFile(config.lawsFilePath);
    const laws = JSON.parse(data);

    const lawIndex = laws.findIndex(law => law.id === lawId);

    if (lawIndex === -1) {
      return res.status(404).json({ success: false, message: 'Закон не найден!' });
    }

    updatedLaw.id = lawId;
    laws[lawIndex] = updatedLaw;

    console.log("Закон после обновления:", updatedLaw);

    await fs.writeFile(config.lawsFilePath, JSON.stringify(laws, null, 2));

    res.json({ success: true, law: updatedLaw });
  } catch (error) {
    console.error('Произошла ошибка при обновлении закона:', error);
    res.status(500).json({ success: false, message: 'Произошла ошибка при обновлении закона' });
  }
});

app.listen(config.port, () => {
  console.log(`Сервер физических законов запущен на порту ${config.port}`);
});
