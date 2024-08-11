import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PiStarFourFill } from "react-icons/pi";
import { PiHandsClappingBold } from "react-icons/pi";
import { FaComment } from "react-icons/fa";
import { PiMinusCircleThin } from "react-icons/pi";
import { PiBookmarkSimpleThin } from "react-icons/pi";
import { SlOptions } from "react-icons/sl";
import { FaHandsClapping } from "react-icons/fa6";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Blog } from "@/pages/Dashboard";
import { format, isToday, differenceInHours } from "date-fns";
import { useEffect, useState } from "react";
import axios from "axios";

export const BlogCard = ({ blog }: { blog: Blog }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isToday(date)) {
            const hoursAgo = differenceInHours(new Date(), date);
            return `${hoursAgo} hours ago`;
        }
        return format(date, "MMM dd");
    };

    const [likes, setLikes] = useState(0);
    const [noOfComments, setNumberOfComments] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        axios
            .get(
                `https://backend.jayantgurushrivastava.workers.dev/api/v1/blog/auth/${blog.id}/commentscount`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            .then((response) => {
                setNumberOfComments(response.data.comments);
            });
    }, []);

    useEffect(() => {
        axios
            .get(
                `https://backend.jayantgurushrivastava.workers.dev/api/v1/blog/auth/${blog.id}/likes`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            .then((response) => {
                setLikes(response.data.likes);
            });

        axios
            .get(
                `https://backend.jayantgurushrivastava.workers.dev/api/v1/blog/auth/${blog.id}/hasliked`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            .then((response) => {
                setIsLiked(response.data.hasLiked);
            });
    }, [isLiked]);

    return (
        <div className="grid grid-cols-4 border-b py-10 gap-x-10">
            <div className="col-span-3">
                <div className="flex items-center mb-4">
                    <Avatar className="size-6 mr-2">
                        <AvatarImage src={blog.user.avatar_url || ""} />
                        <AvatarFallback>
                            {blog.user.username[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-normal text-gray-800">
                        {blog.user.username}
                    </div>
                </div>
                <div className="text-2xl font-bold mb-2">{blog.title}</div>
                <div className="text-base text-slate-600 mb-4">
                    {blog.content.length >= 50
                        ? blog.content.slice(0, 50) + "..."
                        : blog.content}
                </div>
                <div className="flex justify-between">
                    <div className="flex">
                        <PiStarFourFill className="text-amber-300 h-full flex flex-col justify-center mr-4" />
                        <div className="h-full flex flex-col justify-center text-sm font-light text-gray-700 mr-3">
                            {formatDate(blog.created_at)}
                        </div>

                        {isLiked ? (
                            <FaHandsClapping
                                onClick={async () => {
                                    try {
                                        await axios.delete(
                                            `https://backend.jayantgurushrivastava.workers.dev/api/v1/blog/auth/${blog.id}/removelike`,
                                            {
                                              headers: {
                                                  Authorization: `Bearer ${localStorage.getItem(
                                                      "token"
                                                  )}`,
                                              },
                                          }
                                        );
                                        setIsLiked(false);
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }}
                                className="text-gray-600 h-full flex flex-col justify-center mr-1 cursor-pointer"
                            />
                        ) : (
                            <PiHandsClappingBold
                                onClick={async () => {
                                    try {
                                        await axios.post(
                                            `https://backend.jayantgurushrivastava.workers.dev/api/v1/blog/auth/${blog.id}/like`,
                                            {},
                                            {
                                                headers: {
                                                    Authorization: `Bearer ${localStorage.getItem(
                                                        "token"
                                                    )}`,
                                                },
                                            }
                                        );
                                        setIsLiked(true);
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }}
                                className="text-gray-600 h-full flex flex-col justify-center mr-1 cursor-pointer "
                            />
                        )}

                        <div className="h-full flex flex-col justify-center text-sm font-light text-gray-700 mr-3">
                            {likes}
                        </div>
                        <FaComment className="text-gray-600 h-full flex flex-col justify-center mr-1" />
                        <div className="h-full flex flex-col justify-center text-sm font-light text-gray-700">
                            {noOfComments}
                        </div>
                    </div>
                    <div className="flex ">
                        <PiMinusCircleThin className="text-gray-700 h-full flex flex-col justify-center size-6 mr-6" />
                        <PiBookmarkSimpleThin className="text-gray-700 h-full flex flex-col justify-center size-6 mr-6" />
                        <Popover>
                            <PopoverTrigger>
                                <SlOptions className="text-gray-700 size-4" />
                            </PopoverTrigger>
                            <PopoverContent>
                                Place content for the popover here.
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
            <div className="col-span-1">
                <div className="w-full h-full flex flex-col justify-center">
                    <AspectRatio ratio={3 / 2}>
                        <img
                            src="https://github.com/shadcn.png"
                            alt="Blog Image"
                            className="object-cover w-full h-full"
                        />
                    </AspectRatio>
                </div>
            </div>
        </div>
    );
};
