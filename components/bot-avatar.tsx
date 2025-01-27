import { Avatar, AvatarImage } from "./ui/avatar"

export const BotAvatar = () => {
    return(
        <Avatar className="h-8 w-8">
            <AvatarImage src="/bot.svg" />
        </Avatar>
    )

}