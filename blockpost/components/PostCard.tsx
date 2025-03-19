import { Post } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-4">{post.body}</p>
      </CardContent>
    </Card>
  );
}