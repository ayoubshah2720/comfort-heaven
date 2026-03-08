const response = require('../utils/response');
const prisma = require('../db/prisma');
const slugify = require('../utils/slugify');

function buildPostRelations() {
  return {
    category: {
      select: {
        id: true,
        name: true,
        slug: true
      }
    },
    tags: {
      include: {
        tag: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    }
  };
}

function normalizeTagIds(tagIds) {
  if (!Array.isArray(tagIds)) {
    return [];
  }

  const normalized = tagIds
    .map((id) => (typeof id === 'string' ? id.trim() : ''))
    .filter(Boolean);

  return [...new Set(normalized)];
}

async function validateTagIds(tagIds) {
  if (tagIds.length === 0) {
    return null;
  }

  const tags = await prisma.blogTag.findMany({
    where: {
      id: { in: tagIds },
      isActive: true
    },
    select: { id: true }
  });

  if (tags.length !== tagIds.length) {
    return 'One or more tags are invalid';
  }

  return null;
}

function buildPostWhereFromQuery(query = {}) {
  const { status, q, category, tag } = query;

  return {
    ...(status === 'published' ? { isPublished: true } : {}),
    ...(status === 'draft' ? { isPublished: false } : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(tag ? { tags: { some: { tag: { slug: tag } } } } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { summary: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } }
          ]
        }
      : {})
  };
}

async function listPosts(req, res, next) {
  try {
    const { q, category, tag } = req.query;

    const posts = await prisma.post.findMany({
      where: {
        isPublished: true,
        ...buildPostWhereFromQuery({ q, category, tag })
      },
      include: buildPostRelations(),
      orderBy: { createdAt: 'desc' }
    });

    return response(res, {
      status: 'success',
      message: 'Posts',
      data: posts,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function getPostBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const post = await prisma.post.findFirst({
      where: {
        slug,
        isPublished: true
      },
      include: buildPostRelations()
    });

    if (!post) {
      return response(res, {
        status: 'error',
        message: 'Post not found',
        data: null,
        status_code: 404
      });
    }

    return response(res, {
      status: 'success',
      message: 'Post',
      data: post,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function listPostsByStatus(req, res, next) {
  try {
    const { status, category, tag, q } = req.query;

    const posts = await prisma.post.findMany({
      where: buildPostWhereFromQuery({ status, category, tag, q }),
      include: buildPostRelations(),
      orderBy: { createdAt: 'desc' }
    });

    return response(res, {
      status: 'success',
      message: 'Posts',
      data: posts,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function listTags(req, res, next) {
  try {
    const tags = await prisma.blogTag.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return response(res, {
      status: 'success',
      message: 'Tags',
      data: tags,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function createPost(req, res, next) {
  try {
    const {
      title,
      summary,
      content,
      categoryId,
      tagIds,
      isPublished = false
    } = req.body;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true }
    });

    if (!category) {
      return response(res, {
        status: 'error',
        message: 'Category not found',
        data: null,
        status_code: 404
      });
    }

    const normalizedTagIds = normalizeTagIds(tagIds);
    const tagValidationError = await validateTagIds(normalizedTagIds);
    if (tagValidationError) {
      return response(res, {
        status: 'error',
        message: tagValidationError,
        data: null,
        status_code: 400
      });
    }

    const slug = slugify(title);
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      return response(res, {
        status: 'error',
        message: 'Post slug already exists',
        data: null,
        status_code: 409
      });
    }

    const createdPost = await prisma.post.create({
      data: {
        title,
        slug,
        summary: summary || null,
        content,
        categoryId,
        isPublished: Boolean(isPublished),
        publishedAt: isPublished ? new Date() : null,
        createdBy: req.user && req.user.id ? req.user.id : null,
        tags: {
          create: normalizedTagIds.map((tagId) => ({
            tag: { connect: { id: tagId } }
          }))
        }
      },
      include: buildPostRelations()
    });

    return response(res, {
      status: 'success',
      message: 'Post created',
      data: createdPost,
      status_code: 201
    });
  } catch (err) {
    return next(err);
  }
}

async function updatePost(req, res, next) {
  try {
    const { postId } = req.params;
    const {
      title,
      summary,
      content,
      categoryId,
      tagIds
    } = req.body;

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, categoryId: true }
    });

    if (!existingPost) {
      return response(res, {
        status: 'error',
        message: 'Post not found',
        data: null,
        status_code: 404
      });
    }

    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { id: true }
      });
      if (!category) {
        return response(res, {
          status: 'error',
          message: 'Category not found',
          data: null,
          status_code: 404
        });
      }
    }

    const data = {};
    if (title) {
      data.title = title;
      data.slug = slugify(title);
    }
    if (summary !== undefined) {
      data.summary = summary;
    }
    if (content !== undefined) {
      data.content = content;
    }
    if (categoryId) {
      data.category = { connect: { id: categoryId } };
    }

    if (tagIds !== undefined) {
      const normalizedTagIds = normalizeTagIds(tagIds);
      const tagValidationError = await validateTagIds(normalizedTagIds);
      if (tagValidationError) {
        return response(res, {
          status: 'error',
          message: tagValidationError,
          data: null,
          status_code: 400
        });
      }

      data.tags = {
        deleteMany: {},
        ...(normalizedTagIds.length > 0
          ? {
              create: normalizedTagIds.map((tagId) => ({
                tag: { connect: { id: tagId } }
              }))
            }
          : {})
      };
    }

    if (Object.keys(data).length === 0) {
      return response(res, {
        status: 'error',
        message: 'Nothing to update',
        data: null,
        status_code: 400
      });
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data,
      include: buildPostRelations()
    });

    return response(res, {
      status: 'success',
      message: 'Post updated',
      data: post,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function deletePost(req, res, next) {
  try {
    const { postId } = req.params;

    const existing = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
    if (!existing) {
      return response(res, {
        status: 'error',
        message: 'Post not found',
        data: null,
        status_code: 404
      });
    }

    await prisma.post.delete({ where: { id: postId } });

    return response(res, {
      status: 'success',
      message: 'Post deleted',
      data: null,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function publishPost(req, res, next) {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true, isPublished: true } });
    if (!post) {
      return response(res, {
        status: 'error',
        message: 'Post not found',
        data: null,
        status_code: 404
      });
    }

    if (post.isPublished) {
      return response(res, {
        status: 'error',
        message: 'Post is already published',
        data: null,
        status_code: 400
      });
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        isPublished: true,
        publishedAt: new Date()
      },
      include: buildPostRelations()
    });

    return response(res, {
      status: 'success',
      message: 'Post published',
      data: updated,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function unpublishPost(req, res, next) {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true, isPublished: true } });
    if (!post) {
      return response(res, {
        status: 'error',
        message: 'Post not found',
        data: null,
        status_code: 404
      });
    }

    if (!post.isPublished) {
      return response(res, {
        status: 'error',
        message: 'Post is already unpublished',
        data: null,
        status_code: 400
      });
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        isPublished: false
      },
      include: buildPostRelations()
    });

    return response(res, {
      status: 'success',
      message: 'Post unpublished',
      data: updated,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listPosts,
  getPostBySlug,
  listPostsByStatus,
  listTags,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost
};
