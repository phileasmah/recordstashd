import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ActivityFeed() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={`/avatars/${index}.png`} />
                <AvatarFallback>U{index}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>User {index}</CardTitle>
                <CardDescription>
                  {index === 1 ? "Just reviewed" : "Listened to"} Album Title {index}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{4 + index * 0.5} ★</Badge>
              <p className="text-sm text-muted-foreground">
                {index === 1 ? "Added a new review" : "Added to their collection"}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 