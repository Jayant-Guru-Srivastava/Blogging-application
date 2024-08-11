import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GoBell } from "react-icons/go";
import { SlOptions } from "react-icons/sl";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Write = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "https://backend.jayantgurushrivastava.workers.dev/api/v1/blog/auth",
                {
                    title,
                    content,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            console.log("Blog created successfully");

            navigate("/dashboard");
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div
                    className="flex justify-between px-6 pt-3 mx-auto"
                    style={{
                        maxWidth: "1072px",
                    }}
                >
                    <div className="h-full flex flex-col justify-center font-medium font-serif text-3xl mr-4">
                        Medium
                    </div>
                    <div className="flex items-center">
                        <button type="submit">
                            <Badge className="h-6 font-light bg-green-700 mr-6">
                                Publish
                            </Badge>
                        </button>

                        <SlOptions className="mr-4" />
                        <GoBell className="mr-4 size-5" />
                        <Avatar className="size-8">
                            <AvatarImage
                                src="https://github.com/shadcn.png"
                                alt="@shadcn"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div className="w-full px-6 h-screen pb-3">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="flex justify-start w-full mx-auto mt-16 focus:outline-none"
                        style={{
                            fontFamily:
                                "medium-content-title-font, Georgia, Cambria, 'Times New Roman', Times, serif",
                            fontWeight: "400",
                            fontStyle: "normal",
                            lineHeight: "20px",
                            fontSize: "40px",
                            maxWidth: "700px",
                            letterSpacing: 0,
                            color: title ? "black" : "#b3b3b1",
                            // borderLeft: "1px solid #b3b3b1",
                        }}
                    />

                    <textarea
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                        }}
                        placeholder="Tell your story..."
                        className="flex justify-start w-full mx-auto h-dvh focus:outline-none"
                        style={{
                            fontFamily:
                                "medium-content-serif-font, Georgia, Cambria, 'Times New Roman', Times, serif",
                            letterSpacing: ".01rem",
                            fontWeight: "400",
                            fontStyle: "normal",
                            fontSize: "21px",
                            lineHeight: "1.58",
                            color: content ? "black" : "#b3b3b1",
                            maxWidth: "700px",
                        }}
                    />
                </div>
            </form>
        </div>
    );
};
