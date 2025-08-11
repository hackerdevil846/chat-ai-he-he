const https = require('https');

async function fetchAnimeData() {
  const options = {
    method: 'GET',
    hostname: 'anime-db.p.rapidapi.com',
    port: 443,
    path: '/anime?page=1&size=10&search=Fullmetal&genres=Fantasy%2CDrama&sortBy=ranking&sortOrder=asc',
    headers: {
      'x-rapidapi-key': '78186a3f74msh516a9d9dd0f051cp19fea6jsnac2a9d4351fb',
      'x-rapidapi-host': 'anime-db.p.rapidapi.com'
    },
    timeout: 10000
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`API request failed with status code: ${res.statusCode}`));
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        try {
          const data = JSON.parse(body);
          resolve(data);
        } catch (err) {
          reject(new Error('Failed to parse API response as JSON'));
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out after 10 seconds'));
    });

    req.end();
  });
}

(async () => {
  try {
    const animeData = await fetchAnimeData();

    if (!animeData.data || !Array.isArray(animeData.data) || animeData.data.length === 0) {
      console.log('No anime data found.');
      return;
    }

    animeData.data.forEach((anime, index) => {
      console.log(`${index + 1}. ${anime.name || 'Unknown name'}`);
    });
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
})();
