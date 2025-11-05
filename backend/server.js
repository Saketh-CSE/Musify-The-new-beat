const a = require('express');
const b = require('mongoose');
const c = require('dotenv');
const g = require('cors'); // This is the 'cors' package

c.config();
const d = a();
d.use(a.json());

// --- NEW CORS FIX ---
// This is a more robust way to handle requests from your live site
const j = {
  origin: "https://saketh-cse.github.io",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};
d.use(g(j));
// Explicitly handle the "preflight" OPTIONS request
d.options('*', g(j)); 
// --- END NEW CORS FIX ---

const e = process.env.PORT || 5001;

const f = async () => {
  try {
    await b.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
  } catch (h) {
    console.error(h.message);
    process.exit(1);
  }
};
f();

const h = new b.Schema({
  title: String,
  artist: String,
  album: String,
  duration: Number,
  image: String,
  url: String,
  isLiked: {
    type: Boolean,
    default: false,
  },
});

const i = b.model('Song', h);

d.get('/api/songs', async (req, res) => {
  try {
    const k = await i.find();
    res.json(k);
  } catch (h) {
    res.status(500).send('Server Error');
  }
});

// --- NEW API ENDPOINT FOR LIKING SONGS ---
d.post('/api/songs/like/:id', async (req, res) => {
  try {
    const k = await i.findById(req.params.id);
    if (!k) {
      return res.status(404).json({ msg: 'Song not found' });
    }
    // Toggle the like status and save
    k.isLiked = !k.isLiked;
    await k.save();
    res.json(k);
  } catch (h) {
    console.error(h.message);
    res.status(500).send('Server Error');
  }
});
// --- END NEW API ENDPOINT ---

d.post('/api/seed', async (req, res) => {
  const l = [
    { title: 'Lost in the City', artist: 'Cosmo Sheldrake', album: 'The Much Much How How and I', duration: 212, image: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', isLiked: true },
    { title: 'Forest Temple', artist: 'Koji Kondo', album: 'The Legend of Zelda', duration: 172, image: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=300', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { title: 'Aqua Vitae', artist: 'Future World Music', album: 'Behold', duration: 259, image: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=300', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { title: 'Chasing the Wind', artist: 'Twelve Titans Music', album: 'Evermore', duration: 184, image: 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=300', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', isLiked: true },
    { title: 'The Last Butterfly', artist: 'Clem Leek', album: 'Rest', duration: 162, image: 'https://images.pexels.com/photos/672101/pexels-photo-672101.jpeg?auto=compress&cs=tinysrgb&w=300', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
    { title: 'A New Day', artist: 'Altan', album: 'The Widening Gyre', duration: 234, image: 'https://images.pexels.com/photos/1757363/pexels-photo-1757363.jpeg?auto=compress&cs=tinysrgb&w=300', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
    { title: 'The Shire', artist: 'Howard Shore', album: 'The Lord of the Rings', duration: 135, image: 'https://images.pexels.com/photos/2361/nature-farm-agriculture-green.jpg?auto=compress&cs=tinysrgb&w=300', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
    { title: 'Victory', artist: 'Two Steps From Hell', album: 'Battlecry', duration: 320, image: 'https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?auto=compress&cs=tinysrgb&w=300', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  ];
  try {
    await i.deleteMany();
    const m = await i.insertMany(l);
    res.json(m);
  } catch (h) {
    res.status(500).send('Server Error');
  }
});

d.get('/', (req, res) => {
  res.send('API is running...');
});

d.listen(e, () => console.log(`Server running on port ${e}`));