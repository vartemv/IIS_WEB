'use client';

import { useUser } from "@/hooks/useUser"
import PostGrid from "../../components/ui/postgrid";
import Navbar from "../../components/ui/navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import { Post, Reaction } from "@/utils/types/fe_types";

export default function TextareaDemo() {
    const { get_all_posts } = usePosts();
    const [post_data, setPosts] = useState([]);
    const [sortedPosts, setSortedPosts] = useState<Post[]>([]);

    const defaultSortOrder: "none" | "most_popular" | "least_popular" = "none";
    const defaultDateOrder: "none" | "newest" | "oldest" = "none";
    const [sortOrder, setSortOrder] = useState<"none" | "most_popular" | "least_popular">(defaultSortOrder);
    const [dateOrder, setDateOrder] = useState<"none" | "newest" | "oldest">(defaultDateOrder);
    // const [descriptionFilter, setDescriptionFilter] = useState<string>("");

  useEffect(() => {
    get_all_posts().then((data) => {
        console.log(data.data)
        const posts = data.data ? data.data : [];
        setPosts(posts);
        sortPosts(posts);
    });
}, []);

  useEffect(() => {
    sortPosts(post_data);
  }, [sortOrder, post_data, dateOrder]);

  const sortPosts = ( posts: Post[] ) => {
    let sortedPosts = [...posts];

        if (sortOrder !== "none") {
            sortedPosts = sortedPosts.sort((a, b) => {
                const reactionCountA = a.reactions[0]?.amount || 0;
                const reactionCountB = b.reactions[0]?.amount || 0;

                return sortOrder === "most_popular" ? reactionCountB - reactionCountA : reactionCountA - reactionCountB;
            });
        }

        if (dateOrder !== "none") {
            sortedPosts = sortedPosts.sort((a, b) => {
                const dateA = new Date(a.datetime);
                const dateB = new Date(b.datetime);
                return dateOrder === "newest" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
            });
        }

        setSortedPosts(sortedPosts);
};

  const resetFilters = () => {
    setSortOrder(defaultSortOrder);
    setDateOrder(defaultDateOrder);
  };

    // return <ResizablePanelGroup direction="horizontal">
    //             <ResizablePanel> Cookie-user: <pre>{JSON.stringify(user, undefined, 4)}</pre> </ResizablePanel>
    //         </ResizablePanelGroup>
    return (<>
    <div>
      <Navbar />
    </div>
    <div className="p-4 flex gap-4">
    {/* TODO maybe add input search */}
    {/* <input
    type="text"
    placeholder="Filter by description"
    value={descriptionFilter}
    onChange={(e) => setDescriptionFilter(e.target.value)}
    className="w-[180px] p-2 border border-gray-300 rounded"
/> */}
      {/* Popularity Filter */}
      <Select value={sortOrder} onValueChange={(value: string) => setSortOrder(value as "none" | "most_popular" | "least_popular")}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select popularity" />
                    </SelectTrigger>
                    <SelectContent className="bg-white shadow-lg">
                        <SelectItem value="none">Select popularity</SelectItem>
                        <SelectItem value="most_popular">Most popular</SelectItem>
                        <SelectItem value="least_popular">Least popular</SelectItem>
                    </SelectContent>
                </Select>
      
       {/* Date Filter */}
       <Select value={dateOrder} onValueChange={(value: string) => setDateOrder(value as "none" | "newest" | "oldest")}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent className="bg-white shadow-lg">
                        <SelectItem value="none">Select date</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                    </SelectContent>
                </Select>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
          Reset Filters
      </button>
    </div>
    <main className="p-1">
      {/* Pass the posts to PostGrid */}
      <PostGrid posts={sortedPosts} />
      </main>
    </>)
  
}
