const response = require('../utils/response');
const prisma = require('../db/prisma');

async function listTestimonials(req, res, next) {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    return response(res, {
      status: 'success',
      message: 'Testimonials',
      data: testimonials,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function createTestimonial(req, res, next) {
  try {
    const { name, role, content, avatarUrl, isActive } = req.body;

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        content,
        avatarUrl,
        isActive
      }
    });

    return response(res, {
      status: 'success',
      message: 'Testimonial created',
      data: testimonial,
      status_code: 201
    });
  } catch (err) {
    return next(err);
  }
}

async function updateTestimonial(req, res, next) {
  try {
    const { id } = req.params;
    const { name, role, content, avatarUrl, isActive } = req.body;

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return response(res, {
        status: 'error',
        message: 'Testimonial not found',
        data: null,
        status_code: 404
      });
    }

    const data = {};
    if (name !== undefined) {
      data.name = name;
    }
    if (role !== undefined) {
      data.role = role;
    }
    if (content !== undefined) {
      data.content = content;
    }
    if (avatarUrl !== undefined) {
      data.avatarUrl = avatarUrl;
    }
    if (isActive !== undefined) {
      data.isActive = isActive;
    }

    if (Object.keys(data).length === 0) {
      return response(res, {
        status: 'error',
        message: 'Nothing to update',
        data: null,
        status_code: 400
      });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data
    });

    return response(res, {
      status: 'success',
      message: 'Testimonial updated',
      data: testimonial,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteTestimonial(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return response(res, {
        status: 'error',
        message: 'Testimonial not found',
        data: null,
        status_code: 404
      });
    }

    await prisma.testimonial.delete({ where: { id } });

    return response(res, {
      status: 'success',
      message: 'Testimonial deleted',
      data: null,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};
