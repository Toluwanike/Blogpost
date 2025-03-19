"use client";

import { useState, useCallback, useEffect } from "react";
import { AlertCircle } from "lucide-react";

import { Post } from "@/lib/types";
import { SearchBar } from "@/components/SearchBar";
import { PostCard } from "@/components/PostCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchPosts } from "@/lib/api";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 6; // Number of posts to load per page

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
        setFilteredPosts(data.slice(0, ITEMS_PER_PAGE));
        setHasMore(data.length > ITEMS_PER_PAGE);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      const filtered = posts.filter((post) =>
        post.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPosts(filtered.slice(0, ITEMS_PER_PAGE));
      setCurrentPage(1);
      setHasMore(filtered.length > ITEMS_PER_PAGE);
    },
    [posts]
  );

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = nextPage * ITEMS_PER_PAGE;
    const newPosts = posts.slice(0, startIndex);

    setFilteredPosts(newPosts);
    setCurrentPage(nextPage);
    setHasMore(newPosts.length < posts.length);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Blog Posts</h1>

        <SearchBar onSearch={handleSearch} />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
              <div
                key={index}
                className="h-48 bg-muted animate-pulse rounded-lg"
                data-testid="loading-skeleton"
              />
            ))}
          </div>
        ) : (
          <>
            {/* No Results Found */}
            {filteredPosts.length === 0 && searchQuery !== "" ? (
              <p className="text-center text-gray-500 text-lg mt-4">
                No posts found for "{searchQuery}"
              </p>
            ) : (
              <>
                {/* Display Posts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleLoadMore}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
