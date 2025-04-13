import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentReviews() { 
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={``} />
                <AvatarFallback>U{index}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Album Title {index}</CardTitle>
                <CardDescription>Reviewed by User {index}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">4.5 ★</Badge>
              <p className="text-sm text-muted-foreground">
                &ldquo;Great album with amazing production...&rdquo;
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 