import { CommentOnBlogBody, CreateBlogInput, UpdateBlogInput, commentOnBlogBody, createBlogInput, updateBlogInput } from "@jayantguru/blog-common";
import { Prisma, PrismaClient } from "@prisma/client/edge";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userId: string,
        prisma: PrismaClient
    }
}>();

blogRouter.use('/auth/*', async (c, next) => {
    const authHeader = c.req.header('Authorization');

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        c.status(401);
        return c.json({
            error: "Incorrect header format"
        });
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = await verify(token, c.env.JWT_SECRET);

        c.set('userId', decoded.id as string);

        await next();
    } catch(e) {
        c.status(403);
        return c.json({
            error: "You are not authorized"
        });
    }
});

// 1) Create a new blog post
blogRouter.post('/auth', async (c) => {
    const body: CreateBlogInput = await c.req.json();

    const {success} = createBlogInput.safeParse(body);

    if(!success){
        c.status(411);
        return c.json({
            message: "Incorrect input format"
        });
    }

    const userId = c.get('userId');
    const prisma = c.get('prisma');
    

    const blog = await prisma.blog.create({
        data: {
            userId: userId,
            title: body.title,
            content: body.content,
            tags: {
                create: (body.tagName || []).map((tagName: string) => {
                    return {
                        tag: {
                            connectOrCreate: {
                                where: {
                                    name: tagName
                                },
                                create: {
                                    name: tagName
                                }
                            }
                        }
                    }
                })
            },

            categories: {
                create: (body.categoryName || []).map((categoryName: string) => {
                    return {
                        category: {
                            connectOrCreate: {
                                where: {
                                    name: categoryName
                                },
                                create: {
                                    name: categoryName
                                }
                            }
                        }
                    }
                })
            }
        }
    });

    return c.json({
        message: "Blog created successfully",
        id: blog.id
    });
});

// 2) Update a specific blog post
blogRouter.put('/auth/:id', async (c) => {
    const body: UpdateBlogInput = await c.req.json();

    const {success} = updateBlogInput.safeParse(body);

    if(!success){
        c.status(411);
        return c.json({
            message: "Incorrect input format"
        });
    }

    const userId = c.get('userId');
    const blogId = c.req.param('id');

    const prisma = c.get('prisma');

    await prisma.$transaction(async (tx) => {
        await tx.tagsOnBlogs.deleteMany({
            where: {
                blogId: blogId
            }
        });
    
        await tx.categoriesOnBlogs.deleteMany({
            where: {
                blogId: blogId
            }
        });
    
        const blog = await tx.blog.update({
            where: {
                id: blogId
            },
            data: {
                userId: userId,
                title: body.title,
                content: body.content,
                tags: {
                    create: (body.tagName || []).map((tagName: string) => {
                        return {
                            tag: {
                                connectOrCreate: {
                                    where: {
                                        name: tagName
                                    },
                                    create: {
                                        name: tagName
                                    }
                                }
                            }
                        }
                    })
                },
    
                categories: {
                    create: (body.categoryName || []).map((categoryName: string) => {
                        return {
                            category: {
                                connectOrCreate: {
                                    where: {
                                        name: categoryName
                                    },
                                    create: {
                                        name: categoryName
                                    }
                                }
                            }
                        }
                    })
                }
            }
        })
    });

    return c.json({
        message: "Blog updated successfully"
    })
})

// 3) Fetch all blogs
blogRouter.get('/auth/blogs', async (c) => {
    const prisma = c.get('prisma');
    
    const blogs = await prisma.blog.findMany({
        include: {
            user: true,
            comments: true,
            likes: true,
            categories : {
                select: {
                    category: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            tags: {
                select: {
                    tag: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });

    return c.json(blogs);
});

// 4) Search for blog by keyword
blogRouter.get('/auth/search', async (c) => {
    const prisma = c.get('prisma');

    const searchQuery = c.req.query('q');

    const blogs = await prisma.blog.findMany({
        where: {
            OR: [
                {
                    title: {
                        contains: searchQuery,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: searchQuery,
                        mode: "insensitive"
                    }
                }
            ]
        },
        include: {
            categories: {
                select: {
                    category: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            tags: {
                select: {
                    tag: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            comments: true,
            likes: true,
            user: true
        }
    });

    return c.json(blogs);
});

// 5) Get all blogs of a person by the id of that person
blogRouter.get('/auth/person/:id', async (c) => {
    const prisma = c.get('prisma');
    const userId = c.req.param('id');

    const blogs = await prisma.blog.findMany({
        where: {
            userId: userId
        },
        include: {
            categories: {
                select: {
                    category: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            tags: {
                select: {
                    tag: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            comments: true,
            likes: true,
        }
    });
    return c.json(blogs);
});

// 6) Get a blog by its blogId 
blogRouter.get('/auth/:blogId', async (c) => {
    const prisma = c.get('prisma');
    const blogId = c.req.param('blogId');

    const blog = await prisma.blog.findUnique({
        where: {
            id: blogId
        },
        include: {
            categories: {
                select: {
                    category: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            tags: {
                select: {
                    tag: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            comments: true,
            likes: true,
            user: true
        }
    });

    return c.json(blog);
    
});

// 7) Delete a blog by its blogId
blogRouter.delete('/auth/:blogId', async (c) => {
    const prisma = c.get('prisma');
    const blogId = c.req.param('blogId');

    try{
        await prisma.blog.delete({
            where: {
                id: blogId
            }
        });

        return c.json({
            message: "Blog deleted successfully"
        })
    } catch(error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle known Prisma errors
            if (error.code === 'P2025') {
                c.status(400)
                return c.json({ 
                    error: 'Blog does not exist' 
                });
            }
        }
        // If any other error
        c.status(500);
        return c.json({
            error
        });
    }
    
});

// 8) Get all blogs of a particular category
blogRouter.get('/auth/category/:category', async (c) => {
    const prisma = c.get('prisma');
    const category = c.req.param('category');

    const blogs = await prisma.blog.findMany({
        where: {
            categories: {
                some: {
                    category: {
                        name: {
                            equals: category,
                            mode: "insensitive"
                        }
                    }
                }
            }
        },
        include: {
            categories: {
                select: {
                    category: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            tags: {
                select: {
                    tag: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            comments: true,
            likes: true,
            user: true
        }
    });

    return c.json(blogs);
});

// 9) Get all blogs of a particular tag
blogRouter.get('/auth/tag/:tag', async (c) => {
    const prisma = c.get('prisma');
    const tag = c.req.param('tag');

    const blogs = await prisma.blog.findMany({
        where: {
            tags: {
                some: {
                    tag: {
                        name: {
                            equals: tag,
                            mode: "insensitive"
                        }
                    }
                }
            }
        },
        include: {
            categories: {
                select: {
                    category: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            tags: {
                select: {
                    tag: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            comments: true,
            likes: true,
            user: true
        }
    });

    return c.json(blogs);
});

// 10) Like a specific blog by its blogId
blogRouter.post('/auth/:blogId/like', async (c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');
    const blogId = c.req.param('blogId');

    const like = await prisma.like.create({
        data: {
            userId: userId,
            blogId: blogId
        }
    });

    return c.json({
        message: "Blog liked successfully"
    });
});

// 11) Remove a like from blog by its blogId
blogRouter.delete('/auth/:blogId/removelike', async (c) =>{
    const userId = c.get('userId');
    const blogId = c.req.param('blogId');
    const prisma = c.get('prisma');

    try{
        await prisma.like.delete({
            where: {
                userId_blogId: {
                    userId,
                    blogId
                }
            }
        });

        return c.json({
            message: "Like removed successfully"
        });

    } catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle known Prisma errors
            if (error.code === 'P2025') {
                c.status(400)
                return c.json({ 
                    error: 'Like did not existed' 
                });
            }
        }
        // If any other error
        c.status(500);
        return c.json({
            error: "An internal error occurred"
        });
    }
});

// 12) Comment on a particular blog
blogRouter.post('/auth/:blogId/comment', async (c) => {
    const userId = c.get('userId');
    const blogId = c.req.param('blogId');
    const prisma = c.get('prisma');

    const body: CommentOnBlogBody = await c.req.json();

    const {success} = commentOnBlogBody.safeParse(body);

    if(!success){
        c.status(411);
        return c.json({
            message: "Incorrect input format"
        });
    }

    const comment = await prisma.comment.create({
        data: {
            comment: body.comment,
            userId: userId,
            blogId: blogId
        }
    });

    return c.json({
        message: "Comment added successfully"
    });
});

// ********* Modify this route so that the user can comment multiple times on the same blog post afterwards

// 13) Get comments for a blog post
blogRouter.get('/auth/:blogId/comments', async (c) => {
    const blogId = c.req.param('blogId');
    const prisma = c.get('prisma');

    const comments = await prisma.comment.findMany({
        where: {
            blogId: blogId
        },
        include: {
            user: true
        }
    });

    return c.json(comments);
});

// 14) Delete a comment
blogRouter.delete('/auth/:blogId/deletecomment', async (c) => {
    const blogId = c.req.param('blogId');
    const prisma = c.get('prisma');

    try{
        await prisma.comment.delete({
            where: {
                userId_blogId: {
                    userId: c.get('userId'),
                    blogId
                }
            }
        });

        return c.json({
            message: "Comment deleted successfully"
        });
    } catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle known Prisma errors
            if (error.code === 'P2025') {
                c.status(400)
                return c.json({ 
                    error: 'Comment does not exist' 
                });
            }
        }
        // If any other error
        c.status(500);
        return c.json({
            error: "An internal error occurred"
        });
    }
});

// 15) Count the number of likes on a blog post
blogRouter.get('/auth/:blogId/likes', async (c) => {
    const blogId = c.req.param('blogId');
    const prisma = c.get('prisma');

    const likes = await prisma.like.count({
        where: {
            blogId: blogId
        }
    });

    return c.json({
        likes: likes
    });
});

// 16) Count the number of comments on a blog post

blogRouter.get('/auth/:blogId/commentscount', async (c) => {
    const blogId = c.req.param('blogId');
    const prisma = c.get('prisma');

    const comments = await prisma.comment.count({
        where: {
            blogId: blogId
        }
    });

    return c.json({
        comments: comments
    });
});

// 17) Tell if a user has liked a blog post
blogRouter.get('/auth/:blogId/hasliked' , async (c) => {
    const blogId = c.req.param('blogId');
    const userId = c.get('userId');

    const prisma = c.get('prisma');

    const like = await prisma.like.findFirst({
        where: {
            userId: userId,
            blogId: blogId
        }
    });

    if(like){
        return c.json({
            hasLiked: true
        });
    }

    return c.json({
        hasLiked: false
    });
})