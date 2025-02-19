const authMiddleware = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeAll(() => {
    process.env.JWT_SECRET = 'testsecret';
  });

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should set req.user with valid token', () => {
    const token = jwt.sign({ id: new mongoose.Types.ObjectId() }, process.env.JWT_SECRET);

    req.headers = { authorization: `Bearer ${token}` };

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user).toHaveProperty('id');
  });

  it('should return 401 if no authorization header', () => {
    req.headers = {};

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authorization token required' });
  });

  it('should return 403 if token is invalid', () => {
    req.headers = { authorization: 'Bearer invalidToken' };

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
  });
});
