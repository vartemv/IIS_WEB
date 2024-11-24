'use client';
import React, { useState, useRef, useEffect, use } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Navbar from "../../../components/ui/navbar";
import { usePosts } from '@/hooks/usePosts';
import { useRouter } from 'next/navigation';

interface EditPostProps {
  params: Promise<{
    id: string
  }>
}

const EditPost = ({ params }: EditPostProps) => {
  const router = useRouter();
  const { get_post_by_id } = usePosts();
  const unwrappedParams = use(params); 
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    availability: 'TRUE',
    tags: '',
    allowedUsers: '',
    allowedGroups: '',
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await get_post_by_id(unwrappedParams.id);
        if (response.success) {
          const post = response.data;

          setFormData({
            description: post.description || '',
            location: post.location || '',
            availability: post.availability ? 'TRUE' : 'FALSE',
            tags: post.post_tags?.map((pt: any) => pt.tags.name).join(',') || '',
            allowedUsers: '',
            allowedGroups: post.group_posts?.map((gp: any) => gp.group_name).join(',') || '',
          });
          setImagePreview(post.mediafile);
        } else {
          setErrorMessage('Failed to load post data');
          router.push('/info');
        }
      } catch (error) {
        setErrorMessage('Failed to load post data');
        router.push('/info');
      }
    };
    fetchPost();
  }, [unwrappedParams.id]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };


  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    

    try {
      const formDataWithFile = new FormData();
      let filename = imagePreview;


      const updateResponse = await fetch('/api/editPost', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: unwrappedParams.id,
          ...formData,
          mediafile: filename,
          tags: formData.tags.split(',').map(tag => tag.trim()),
          allowedUsers: formData.allowedUsers.split(',').map(user => user.trim()),
          allowedGroups: formData.allowedGroups.split(',').map(group => group.trim()),
        }),
      });


      const data = await updateResponse.json();
      
      if (data.success) {
        
        router.push('/info');

      } else {
        setErrorMessage(data.message || 'Failed to update post');
      }
    
    } catch (error) {
      console.error("Error updating post:", error);
      setErrorMessage('An error occurred while updating the post');
    }
  };

  const isFormValid = () => {
    const { description, location } = formData;
    return description && location; 
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>
      {errorMessage && (
        <div className="text-red-500 text-sm mb-4 text-center w-full">
          {errorMessage}
        </div>
      )}
      <div className="flex justify-center items-center min-h-screen p-10">
        <div className="flex justify-center items-center w-1/2">
          <div className="w-full max-w-sm border-2 border-dashed border-gray-400 p-5 flex flex-col items-center justify-center">
            {imagePreview && (
              <img src={imagePreview} alt="Selected file" className="mt-4 max-w-full h-auto" />
            )}
          </div>
        </div>

        <div className="flex justify-center items-center w-1/2">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="mb-4">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                type="text" 
                value={formData.description} 
                onChange={handleInputChange} 
                placeholder="Add description" 
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                type="text" 
                value={formData.location} 
                onChange={handleInputChange} 
                placeholder="Add location" 
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="availability">Availability</Label>
              <select 
                id="availability" 
                value={formData.availability} 
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="TRUE">Public</option>
                <option value="FALSE">Private</option>
              </select>
            </div>
            {formData.availability === 'FALSE' && (
              <div>
                <div className="mb-4">
                  <Label htmlFor="allowedUsers">Select user(s)</Label>
                  <Input 
                    id="allowedUsers" 
                    type="text" 
                    value={formData.allowedUsers}
                    onChange={handleInputChange}
                    placeholder="Enter usernames separated by commas" 
                  />
                </div>
              </div>
            )}
            <div className="mb-4">
              <Label htmlFor="allowedGroups">Select Group(s)</Label>
              <Input 
                id="allowedGroups" 
                type="text" 
                value={formData.allowedGroups}
                onChange={handleInputChange}
                placeholder="Enter groups separated by commas" 
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="tags">Tags</Label>
              <Input 
                id="tags" 
                type="text" 
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Add tags (comma separated)" 
              />
            </div>
            <Button type="submit" className="bg-blue-500 w-full" disabled={!isFormValid()}>
              Update Post
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;

