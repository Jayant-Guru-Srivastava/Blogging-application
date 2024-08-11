import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const SmallBlogCard = () => {
  return (
    <div>
        <div className="flex items-center mb-2">
          <Avatar className="size-6 mr-2">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="text-sm font-semibold">John Gorman</div>
        </div>
        <div className="text-base font-bold mb-6">
            Stop wasting your time
        </div>
    </div>
  );
};
