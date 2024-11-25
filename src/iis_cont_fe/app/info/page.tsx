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

    const posts = [
      { id: 1, image: "https://via.placeholder.com/300", caption: "Post 0", author: "Test" },
      { id: 2, image: "https://via.placeholder.com/600", caption: "Post 1", author: "Test" },
      { id: 3, image: "https://via.placeholder.com/300", caption: "Post 2", author: "Test" },
      { id: 4, image: "https://via.placeholder.com/400", caption: "Post 3", author: "Test" },
      { id: 5, image: "https://via.placeholder.com/400", caption: "Post 4", author: "Test" }
    ];
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
      <PostGrid posts={post_data} />
      </main>
    </>)
  
}