import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";

export const FollowCard = () => {
  return (
    <div className="flex justify-between mb-4">
      <div className="flex justify-center">
        <Avatar className="size-8 mr-4">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div>
          <div className="font-bold mb-1">Brooke Hammerling</div>
          <div className="text-xs text-slate-500 font-light">
            Talk to me about tech, pop...
          </div>
        </div>
      </div>

      <div>
        <Button
          className="text-sm font-light border-black rounded-3xl h-8 px-3"
          variant={"outline"}
        >
          Follow
        </Button>
      </div>
    </div>
  );
};
