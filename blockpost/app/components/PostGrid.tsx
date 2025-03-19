import { Post } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PostGridProps {
  posts: Post[];
}

export function PostGrid({ posts }: PostGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card key={post.id} className="h-full">
          <CardHeader>
            <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground line-clamp-4">{post.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}