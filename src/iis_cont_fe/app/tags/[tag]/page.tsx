'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PostGrid from '@/components/ui/postgrid';
import Navbar from '@/components/ui/navbar';
import { usePosts } from '@/hooks/usePosts';
import { Post } from '@/utils/types/fe_types';

const TagPage = () => {
  const { tag } = useParams();
  const { get_posts_by_tag } = usePosts();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (tag) {
      get_posts_by_tag(tag as string).then((data) => {
        setPosts(data.data);
      });
    }
  }, [tag]);

  if (!tag) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Posts tagged with "{tag}"</h1>
        <PostGrid posts={posts} />
      </div>
    </>
  );
};

export default TagPage;