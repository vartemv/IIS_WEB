'use client';
import React, { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    availability: 'TRUE',
    tags: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (file) {
        const formDataWithFile = new FormData();
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.name.replaceAll(" ", "_")}`;
        formDataWithFile.append('file', new File([file], filename, { type: file.type }));
        
        const uploadResponse = await fetch('/api/savePost', {
          method: 'POST',
          body: formDataWithFile
        });
        
        if (uploadResponse.ok) {
          const createPostResponse = await fetch('/api/createPost', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              mediafile: filename,
              tags: formData.tags.split(',').map(tag => tag.trim()), // Split and trim tags
            }),
          });
          
          const data = await createPostResponse.json();
          if (data.success) {
            console.log('Post created successfully');
            // Reset form
            setFormData({
              description: '',
              location: '',
              availability: 'TRUE',
              tags: '',
            });
            setFile(null);
            setImagePreview(null);
            if (fileRef.current) {
              fileRef.current.value = '';
            }
          }
        }
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-10">
      {/* Left Section - Image Preview */}
      <div className="flex justify-center items-center w-1/2">
        <div className="w-full max-w-sm border-2 border-dashed border-gray-400 p-5 flex flex-col items-center justify-center">
          <label className="cursor-pointer">
            <input 
              type="file" 
              className="hidden"
              ref={fileRef}
              onChange={handleFileChange}
              accept="image/*"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </label>
          {imagePreview && (
            <img src={imagePreview} alt="Selected file" className="mt-4 max-w-full h-auto" />
          )}
        </div>
      </div>

      {/* Right Section - Form */}
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
          <Button type="submit" className="bg-blue-500 w-full">Post</Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;