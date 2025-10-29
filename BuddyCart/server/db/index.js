const URI = process.env.MONGO_URI || process.env.MONGODB_URI;
console.log('MONGO_URI present?', !!process.env.MONGO_URI, 'MONGODB_URI present?', !!process.env.MONGODB_URI);
if (!URI) {
  console.error('No Mongo URI found. Set MONGO_URI to your Atlas SRV string.');
}

mongoose.set('strictQuery', true);
mongoose.connection.on('connected', () => console.log('Mongo connected'));
mongoose.connection.on('error', (err) => console.error('Mongo error:', err.message));
mongoose.connection.on('disconnected', () => console.warn('Mongo disconnected'));

(async () => {
  try {
    await mongoose.connect(URI, {
      serverSelectionTimeoutMS: 10000,
    });
    const dbName = mongoose.connection.name;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);
  } catch (err) {
    console.error('Mongo connect failed:', err.name, err.message);
  }
})();

module.exports = mongoose;