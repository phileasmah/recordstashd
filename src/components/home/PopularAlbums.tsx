import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PopularAlbums() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Popular Album {index}</CardTitle>
            <CardDescription>Artist Name</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">4.8 ★</Badge>
              <Badge variant="outline">{index * 1000} reviews</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 