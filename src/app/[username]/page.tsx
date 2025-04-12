"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewCardContent } from "@/components/ui/review-card-content";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for the profile
const mockUserData = {
  username: "johndoe",
  name: "John Doe",
  profilePic: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ2Y2N3aW5NMWlFNGZhYURjMlFyTlREMjVvbyJ9",
  joinedDate: "2023-01-15",
  stats: {
    reviewCount: 42,
    averageRating: 4.2,
    totalLikes: 156,
    favoriteGenres: ["Electronic", "Rock", "Hip-Hop"]
  },
  reviews: [
    {
      id: "1",
      username: "johndoe",
      userImageUrl: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ2Y2N3aW5NMWlFNGZhYURjMlFyTlREMjVvbyJ9",
      albumName: "Random Access Memories",
      artist: "Daft Punk",
      rating: 4.5,
      lastUpdatedTime: "2024-04-12",
      review: "A masterpiece that revolutionized electronic music. The production quality is unmatched.",
      likes: 45
    },
    {
      id: "2",
      username: "johndoe",
      userImageUrl: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ2Y2N3aW5NMWlFNGZhYURjMlFyTlREMjVvbyJ9",
      albumName: "In Rainbows",
      artist: "Radiohead",
      rating: 5,
      lastUpdatedTime: "2024-04-10",
      review: "One of the best albums ever made. Every track is perfect.",
      likes: 32
    },
    {
      id: "3",
      username: "johndoe",
      userImageUrl: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ2Y2N3aW5NMWlFNGZhYURjMlFyTlREMjVvbyJ9",
      albumName: "To Pimp a Butterfly",
      artist: "Kendrick Lamar",
      rating: 5,
      lastUpdatedTime: "2024-04-08",
      review: "A cultural landmark that pushes the boundaries of hip-hop.",
      likes: 67
    },
  ],
};

export default function UserProfilePage({ params }: { params: { username: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="w-32 h-32 shrink-0">
            <AvatarImage src={mockUserData.profilePic} alt={mockUserData.username} />
            <AvatarFallback>{mockUserData.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{mockUserData.name}</h1>
            <p className="text-muted-foreground">@{params.username}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Joined {new Date(mockUserData.joinedDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-2xl font-bold">{mockUserData.stats.reviewCount}</p>
                <p className="text-sm text-muted-foreground">Reviews</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-2xl font-bold">{mockUserData.stats.averageRating}★</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-2xl font-bold">{mockUserData.stats.totalLikes}</p>
                <p className="text-sm text-muted-foreground">Total Likes</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Tabs defaultValue="reviews" className="w-full">
        <TabsList>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="liked">Liked Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-1">
                  {mockUserData.reviews.map((review, index) => (
                    <ReviewCardContent
                      key={review.id}
                      review={review}
                      index={index}
                      showDivider={index !== mockUserData.reviews.length - 1}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="liked">
          <Card>
            <CardHeader>
              <CardTitle>Liked Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 