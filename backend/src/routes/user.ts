import { Hono } from "hono";
import { SigninInput, SignupInput, UpdatePasswordInput, UpdateUserInput, signupInput, updatePasswordInput, updateUserInput } from "@jayantguru/blog-common";
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from "hono/jwt";

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        prisma: PrismaClient,
        userId: string
    }
}>();

userRouter.use('/auth/*', async (c, next) => {
    const authHeader = c.req.header('Authorization');

    if(!authHeader?.startsWith("Bearer ") || !authHeader){
        c.status(401);
        return c.json({
            error: "Invalid authorization header"
        });
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = await verify(token, c.env.JWT_SECRET);

        c.set('userId', decoded.id as string);

        await next();
    } catch (e) {
        c.status(403);
        return c.json({
            error: "Incorrect Credentials"
        })
    }
});

// 1) User Registration

// Route for signing up

userRouter.post('/signup', async (c) => {
    const body: SignupInput = await c.req.json();

    const {success} = signupInput.safeParse(body);

    if(!success){
        c.status(411);
        return c.json({
            error: "Inputs not correct"
        });
    }

    const prisma = c.get('prisma'); 

    const encoder = new TextEncoder();
    const data = encoder.encode(body.password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Converting the hash into hash string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedHexPassword = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    try{
        const user = await prisma.user.create({
            data: {
                username: body.username,
                password: hashedHexPassword,
                full_name: body.full_name,
                bio: body.bio,
                avatar_url: body.avatar_url
            }
        });
    
        const token = await sign({id: user.id}, c.env.JWT_SECRET);
    
        return c.json({
            message: "Signup Successfull!!!",
            token: token
        });
    } catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle known Prisma errors
            if (error.code === 'P2002') {
                c.status(400);
                return c.json({ 
                    error: 'The user already exists' 
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


// 2) User Authentication

// Route for logging in

userRouter.post('/signin', async (c) => {
    const body: SigninInput = await c.req.json();

    const {success} = signupInput.safeParse(body);

    if(!success){
        c.status(411);
        return c.json({
            error: "Inputs not correct"
        });
    }

    const prisma = c.get('prisma');

    const encoder = new TextEncoder();
    const data = encoder.encode(body.password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Converting the hash into hash string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedHexPassword = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    const user = await prisma.user.findUnique({
        where: {
            username: body.username,
            password: hashedHexPassword
        }
    });

    if(!user){
        c.status(403);
        return c.json({
            error: "Incorrect credentials"
        })
    }

    const token = await sign({id: user.id}, c.env.JWT_SECRET);

    return c.json({
        message: "Signin Successfull!!!",
        token: token
    });
});

// 3) Route for fetching user profile information
userRouter.get('/auth/me', async (c) => {
    const userId = c.get('userId');

    const prisma = c.get('prisma');

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    return c.json(user);
});

// 4) Route for updating user information
userRouter.put('/auth/me', async (c) => {
    const body: UpdateUserInput = await c.req.json();

    const {success} = updateUserInput.safeParse(body);

    if(!success){
        c.status(411);
        return c.json({
            error: "Invalid inputs"
        })
    }

    const prisma = c.get('prisma');
    const userId = c.get('userId');

    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            username: body.username,
            full_name: body.full_name,
            bio: body.bio,
            avatar_url: body.avatar_url
        }
    });

    return c.json({
        message: "User updated successfully"
    });
});

// 5) Route for updating the password
userRouter.put('/auth/change-password', async (c) => {
    const body: UpdatePasswordInput = await c.req.json();

    const {success} = updatePasswordInput.safeParse(body);

    if(!success){
        c.status(411);
        return c.json({
            error: "Invalid inputs"
        })
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(body.password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Converting the hash into hash string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedHexPassword = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    const userId = c.get('userId');
    const prisma = c.get('prisma');

    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            password: hashedHexPassword
        }
    });

    return c.json({
        message: "Password changed"
    });
});

// 6) Route for fetching a user's blogs --> Done in blog.ts file
// userRouter.get('/auth/:userId/blogs', async (c) => {
//     const userId = c.req.param('userId');
//     const prisma = c.get('prisma');

//     const blogs = await prisma.blog.findMany({
//         where: {
//             userId: userId
//         }
//     });
// });

// 7) Route for following a user
userRouter.post('/auth/:userId/follow', async (c) => {
    const followedById = c.get('userId');
    const followingId = c.req.param('userId');

    const prisma = c.get('prisma');

    // One way --> By only using one query

    // const follow = await prisma.follows.createMany({
    //     data: {
    //         followedById: followedById,
    //         followingId: followingId
    //     },
    //     skipDuplicates: true
    // });

    // Another way

    // Check if the follow relationship already exists
    const existing_follow = await prisma.follows.findUnique({
        where: {
            followedById_followingId: {
                followedById: followedById,
                followingId: followingId
            }
        }
    });

    if(existing_follow){
        c.status(400);
        return c.json({
            error: "You are already following this user"
        })
    }

    const follow = await prisma.follows.create({
        data: {
            followedById,
            followingId,
        },
    });

    return c.json({
        message: "Followed Successfully",
        follow
    });
});

// 8) Route for unfollowing a user
userRouter.delete('/auth/:userId/unfollow', async (c) => {
    const followedById = c.get('userId');
    const followingId = c.req.param('userId');

    const prisma = c.get('prisma');

    try{
        const deleteFollow = await prisma.follows.delete({
            where: {
                followedById_followingId: {
                    followedById: followedById,
                    followingId: followingId
                }
            }
        });
    } catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle known Prisma errors
            if (error.code === 'P2025') {
                c.status(400)
                return c.json({ 
                    error: 'You are not following this user' 
                });
            }
        }
        // If any other error
        c.status(500);
        return c.json({
            error: "An internal error occurred"
        });
    }

    return c.json({
        message: "Unfollowed Successfully"
    });
});

// 9) Route for retrieving a user's followers list
userRouter.get('/auth/:userId/followers', async (c) => {
    const userId = c.req.param('userId');
    const prisma = c.get('prisma');

    const followersList = await prisma.follows.findMany({
        where: {
            followingId: userId
        },
        select: {
            followedBy: true
        }
    });

    return c.json(followersList);
});

// 10) Route for retrieving a user's following list
userRouter.get('/auth/:userId/following', async (c) => {
    const userId = c.req.param('userId');
    const prisma = c.get('prisma');

    const followingList = await prisma.follows.findMany({
        where: {
            followedById: userId
        },
        select: {
            following: true
        }
    });

    return c.json(followingList);
});

// 11) Route for deleting a user's account
userRouter.delete('/auth/deactivate', async (c) => {
    const userId = c.get('userId');
    const prisma = c.get('prisma');

    await prisma.user.delete({
        where: {
            id: userId
        }
    });

    return c.json({
        message: "User deleted successfully"
    })
});

// 12) Searching for all users with a keyword
userRouter.get('/auth/search', async (c) => {
    const prisma = c.get('prisma');
    const searchQuery = c.req.query('q');

    const users = await prisma.user.findMany({
        where: {
            OR: [
                {
                    username: {
                        contains: searchQuery,
                        mode: "insensitive"
                    }
                },
                {
                    full_name: {
                        contains: searchQuery,
                        mode: "insensitive"
                    }
                }
            ]
        }
    });

    return c.json(users);
});