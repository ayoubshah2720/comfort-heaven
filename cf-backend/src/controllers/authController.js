const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db/prisma');
const env = require('../config/env');
const response = require('../utils/response');
const { signAccessToken, signRefreshToken, getCookieOptions } = require('../utils/tokens');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return response(res, {
        status: 'error',
        message: 'Email already registered',
        data: null,
        status_code: 409
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash }
    });

    const { token, expiresAt } = signRefreshToken(user);
    await prisma.refreshToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    });

    const accessToken = signAccessToken(user);
    res.cookie(env.cookieName, token, getCookieOptions());

    // Optionally also set access token as HttpOnly cookie
    // res.cookie(env.accessCookieName, accessToken, { ...getCookieOptions(), maxAge: 15 * 60 * 1000 });

    return response(res, {
      status: 'success',
      message: 'Registered successfully',
      data: { accessToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      status_code: 201
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return response(res, {
        status: 'error',
        message: 'Invalid credentials',
        data: null,
        status_code: 401
      });
    }

    if (!user.isActive) {
      return response(res, {
        status: 'error',
        message: 'Account is deactivated',
        data: null,
        status_code: 403
      });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return response(res, {
        status: 'error',
        message: 'Invalid credentials',
        data: null,
        status_code: 401
      });
    }

    const { token, expiresAt } = signRefreshToken(user);
    await prisma.refreshToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    });

    const accessToken = signAccessToken(user);
    res.cookie(env.cookieName, token, getCookieOptions());

    // Optionally also set access token as HttpOnly cookie
    // res.cookie(env.accessCookieName, accessToken, { ...getCookieOptions(), maxAge: 15 * 60 * 1000 });

    return response(res, {
      status: 'success',
      message: 'Logged in successfully',
      data: { accessToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, username: true, phone: true, gender: true, isActive: true, createdAt: true }
    });

    if (!user) {
      return response(res, {
        status: 'error',
        message: 'User not found',
        data: null,
        status_code: 404
      });
    }

    return response(res, {
      status: 'success',
      message: 'Profile',
      data: user,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const { name, username, phone, gender } = req.body;

    if (username) {
      const existing = await prisma.user.findFirst({
        where: { username, NOT: { id: req.user.id } },
      });
      if (existing) {
        return response(res, {
          status: 'error',
          message: 'Username is already taken',
          data: null,
          status_code: 409,
        });
      }
    }

    const data = {};
    if (name !== undefined) data.name = name;
    if (username !== undefined) data.username = username;
    if (phone !== undefined) data.phone = phone;
    if (gender !== undefined) data.gender = gender;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: {
        id: true, name: true, email: true, role: true,
        username: true, phone: true, gender: true,
        isActive: true, createdAt: true,
      },
    });

    return response(res, {
      status: 'success',
      message: 'Profile updated',
      data: user,
      status_code: 200,
    });
  } catch (err) {
    return next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const token = req.cookies ? req.cookies[env.cookieName] : null;
    if (!token) {
      return response(res, {
        status: 'error',
        message: 'Refresh token missing',
        data: null,
        status_code: 401
      });
    }

    let payload;
    try {
      payload = jwt.verify(token, env.jwtRefreshSecret);
    } catch (e) {
      return response(res, {
        status: 'error',
        message: 'Invalid refresh token',
        data: null,
        status_code: 401
      });
    }

    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      return response(res, {
        status: 'error',
        message: 'Refresh token expired or revoked',
        data: null,
        status_code: 401
      });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) {
      return response(res, {
        status: 'error',
        message: 'User not found or inactive',
        data: null,
        status_code: 401
      });
    }

    const accessToken = signAccessToken(user);

    // Optionally also set access token as HttpOnly cookie
    // res.cookie(env.accessCookieName, accessToken, { ...getCookieOptions(), maxAge: 15 * 60 * 1000 });

    return response(res, {
      status: 'success',
      message: 'Access token refreshed',
      data: { accessToken },
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies ? req.cookies[env.cookieName] : null;
    if (token) {
      await prisma.refreshToken.updateMany({
        where: { token },
        data: { revoked: true }
      });
    }

    res.clearCookie(env.cookieName, { path: '/' });
    res.clearCookie(env.accessCookieName, { path: '/' });

    return response(res, {
      status: 'success',
      message: 'Logged out',
      data: null,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, me, updateMe, refresh, logout };
