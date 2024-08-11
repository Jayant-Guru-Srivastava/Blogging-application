import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../fontawesome";
import { getIcon } from "../fontawesome";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogCard } from "@/components/BlogCard";
import { LuPenSquare } from "react-icons/lu";
import { GoBell } from "react-icons/go";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { PiPlusThin } from "react-icons/pi";
import { SmallBlogCard } from "@/components/SmallBlogCard";
import { Button } from "@/components/ui/button";
import { FollowCard } from "@/components/FollowCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export interface User {
    id: string;
    username: string;
    password: string;
    full_name?: string | null;
    bio?: string | null;
    avatar_url?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Comment {
    comment: string;
    userId: string;
    blogId: string;
}

export interface Like {
    userId: string;
    blogId: string;
}

export interface Category {
    name: string;
}

export interface Tag {
    name: string;
}

export interface Blog {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    userId: string;
    user: User;
    comments: Comment[];
    likes: Like[];
    categories: { category: Category }[];
    tags: { tag: Tag }[];
}

export const Dashboard = () => {
    const navigate = useNavigate();

    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios
            .get(
                "https://backend.jayantgurushrivastava.workers.dev/api/v1/blog/auth/blogs",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            .then((response) => {
                setBlogs(response.data);
            });
    }, []);

    return (
        <>
            <div className="flex justify-between pt-3 px-6 border-b">
                <div className="flex">
                    <div className="h-full flex flex-col justify-center font-medium font-serif text-3xl mr-4">
                        Medium
                    </div>
                    <div className="h-full flex flex-col justify-center">
                        <div className="relative ml-auto flex-1 md:grow-0">
                            <Search className="absolute left-2.5 top-2.5 size-6 text-muted-foreground text-slate-600" />
                            <Input
                                type="search"
                                placeholder="Search"
                                className="w-full rounded-3xl bg-background pl-10 md:w-[200px] lg:w-[336px]"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <div
                        className="flex"
                        onClick={() => {
                            navigate("/write");
                        }}
                    >
                        <div className="h-full flex flex-col justify-center">
                            {/* 
                    // @ts-ignore */}
                            {/* <FontAwesomeIcon icon={getIcon('fa-regular fa-pen-to-square')} className="size-6 text-slate-600 mr-2"/> */}
                            {/* <LuPenSquare className="size-6 text-slate-600 mr-2"/> */}
                            <HiOutlinePencilSquare className="size-6 text-slate-600 mr-2" />
                        </div>
                        <div className="h-full flex flex-col justify-center text-slate-600 mr-6 font-light">
                            Write
                        </div>
                    </div>

                    <div className="h-full flex flex-col justify-center">
                        {/* 
                // @ts-ignore */}
                        {/* <FontAwesomeIcon icon={getIcon('fa-regular fa-bell')} className="size-6 text-slate-600 mr-6"/> */}
                        <GoBell className="size-6 text-slate-600 mr-6" />
                    </div>
                    <div className="h-full flex flex-col justify-center">
                        <Avatar className="size-8">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 h-screen">
                <div className="col-span-2 border-r py-6 px-12">
                    <div>
                        <Tabs defaultValue="foryou" className="w-full">
                            <TabsList className="flex border-b border-gray-300 bg-white py-0 rounded-none justify-start">
                                {/* 
                            // @ts-ignore */}
                                {/* <FontAwesomeIcon icon={getIcon('fa-solid fa-plus')} className="hover:bg-gray-200 rounded-full p-1.5"/> */}
                                <PiPlusThin className="size-8 hover:bg-gray-200 rounded-full p-1" />
                                <TabsTrigger
                                    value="foryou"
                                    className="font-normal h-full transition-none px-0 py-0 ml-6 mr-4 text-gray-500 hover:text-black focus:text-black focus:outline-none focus:border-b focus:border-black data-[state=active]:shadow-none rounded-none"
                                >
                                    For you
                                </TabsTrigger>
                                <TabsTrigger
                                    value="following"
                                    className="font-normal h-full transition-none px-0 py-0 mx-4 text-gray-500 hover:text-black focus:text-black focus:outline-none focus:border-b focus:border-black data-[state=active]:shadow-none rounded-none"
                                >
                                    Following
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="foryou" className="pt-4">
                                <div>
                                    {blogs.map((blog) => {
                                        return (<BlogCard key={blog.id} blog={blog} />)
                                    })}
                                </div>
                            </TabsContent>
                            <TabsContent value="following" className="pt-4">
                                Here are the blogs from the people you are
                                following
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="col-span-1 p-8">
                    <div className="font-medium mb-4">Staff Picks</div>
                    <SmallBlogCard />
                    <SmallBlogCard />
                    <SmallBlogCard />
                    <div className="text-sm text-lime-700 mb-10">
                        See the full list
                    </div>

                    <div className="font-medium">Recommended topics</div>
                    <div className="flex mt-6">
                        <div className=" h-8 bg-slate-100 rounded-2xl flex flex-col justify-center items-center px-2 mr-4">
                            <div className="text-sm font-light">Coding</div>
                        </div>

                        <div className=" h-8 bg-slate-100 rounded-2xl flex flex-col justify-center items-center px-2 mr-4">
                            <div className="text-sm font-light">UX</div>
                        </div>

                        <div className=" h-8 bg-slate-100 rounded-2xl flex flex-col justify-center items-center px-2">
                            <div className="text-sm font-light">Education</div>
                        </div>
                    </div>

                    <div className="flex mt-4">
                        <div className=" h-8 bg-slate-100 rounded-2xl flex flex-col justify-center items-center px-2 mr-4">
                            <div className="text-sm font-light">History</div>
                        </div>

                        <div className=" h-8 bg-slate-100 rounded-2xl flex flex-col justify-center items-center px-2 mr-4">
                            <div className="text-sm font-light">Humor</div>
                        </div>

                        <div className=" h-8 bg-slate-100 rounded-2xl flex flex-col justify-center items-center px-2">
                            <div className="text-sm font-light">Work</div>
                        </div>
                    </div>

                    <div className="flex mt-4">
                        <div className=" h-8 bg-slate-100 rounded-2xl flex flex-col justify-center items-center px-2 mr-4">
                            <div className="text-sm font-light">
                                Web Development
                            </div>
                        </div>
                    </div>
                    <div className="text-sm text-lime-700 mb-10 mt-8">
                        See more topics
                    </div>
                    <div>
                        <div className="font-medium mb-4">Who to follow</div>
                        <FollowCard />
                        <FollowCard />
                        <FollowCard />
                    </div>
                    <div className="text-sm text-lime-700 mb-10 mt-8">
                        See more suggestions
                    </div>
                </div>
            </div>
        </>
    );
};
