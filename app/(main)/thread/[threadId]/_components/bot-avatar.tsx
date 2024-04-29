import { Bot } from "lucide-react";

interface BotAvatarProps {
  // src: string;
}

export const BotAvatar = ({  }: BotAvatarProps) => {
  return (
    // <Avatar className="h-12 w-12">
    //   <AvatarImage src={src} />
    <Bot className="h-12 w-12" />
    // </Avatar>
  );
};
