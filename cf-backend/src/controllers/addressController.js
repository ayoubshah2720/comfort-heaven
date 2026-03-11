const response = require('../utils/response');
const prisma = require('../db/prisma');

async function listAddresses(req, res, next) {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    return response(res, {
      status: 'success',
      message: 'Addresses',
      data: addresses,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function createAddress(req, res, next) {
  try {
    const { label, company, address1, address2, city, state, zipCode, country, phone, isDefault } = req.body;
    const userId = req.user.id;

    const address = await prisma.$transaction(async (tx) => {
      if (isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false }
        });
      }

      return tx.address.create({
        data: {
          userId,
          label,
          company: company || null,
          address1,
          address2: address2 || null,
          city,
          state,
          zipCode,
          country: country || 'Pakistan',
          phone,
          isDefault: isDefault || false
        }
      });
    });

    return response(res, {
      status: 'success',
      message: 'Address created',
      data: address,
      status_code: 201
    });
  } catch (err) {
    return next(err);
  }
}

async function updateAddress(req, res, next) {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId }
    });

    if (!existing) {
      return response(res, {
        status: 'error',
        message: 'Address not found',
        data: null,
        status_code: 404
      });
    }

    const { label, company, address1, address2, city, state, zipCode, country, phone, isDefault } = req.body;

    const address = await prisma.$transaction(async (tx) => {
      if (isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false }
        });
      }

      const data = {};
      if (label !== undefined) data.label = label;
      if (company !== undefined) data.company = company || null;
      if (address1 !== undefined) data.address1 = address1;
      if (address2 !== undefined) data.address2 = address2 || null;
      if (city !== undefined) data.city = city;
      if (state !== undefined) data.state = state;
      if (zipCode !== undefined) data.zipCode = zipCode;
      if (country !== undefined) data.country = country;
      if (phone !== undefined) data.phone = phone;
      if (isDefault !== undefined) data.isDefault = isDefault;

      return tx.address.update({
        where: { id: addressId },
        data
      });
    });

    return response(res, {
      status: 'success',
      message: 'Address updated',
      data: address,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteAddress(req, res, next) {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId }
    });

    if (!existing) {
      return response(res, {
        status: 'error',
        message: 'Address not found',
        data: null,
        status_code: 404
      });
    }

    await prisma.address.delete({ where: { id: addressId } });

    return response(res, {
      status: 'success',
      message: 'Address deleted',
      data: null,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function setDefaultAddress(req, res, next) {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId }
    });

    if (!existing) {
      return response(res, {
        status: 'error',
        message: 'Address not found',
        data: null,
        status_code: 404
      });
    }

    const address = await prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      });

      return tx.address.update({
        where: { id: addressId },
        data: { isDefault: true }
      });
    });

    return response(res, {
      status: 'success',
      message: 'Default address updated',
      data: address,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};
