const mongoose = require('mongoose');
const User = require('../models/User');

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany();
  });

  it('should save a user with valid data', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
    });

    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe('testuser');
  });

  it('should not save a user without required fields', async () => {
    const user = new User({});

    await expect(user.save()).rejects.toThrow();
  });

  it('should enforce unique email and username', async () => {
    await new User({
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
    }).save();

    const duplicateUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'anotherhash',
    });

    await expect(duplicateUser.save()).rejects.toThrow();
  });
});
