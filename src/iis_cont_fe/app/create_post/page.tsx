'use client';
import React, { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    availability: 'true',
  });
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
  
      if (file) {
        const formDataWithFile = new FormData();
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.name}`;
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
              mediafile: `${timestamp}_${file.name.replaceAll(" ", "_")}`,
            }),
          });
          
          const data = await createPostResponse.json();
          if (data.success) {
            console.log('Post created successfully');
            // Reset form
            setFormData({
              description: '',
              location: '',
              availability: 'true',
            });
            setFile(null);
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
    <form onSubmit={handleSubmit}>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="mediafile">Picture</Label>
        <Input 
          id="mediafile" 
          type="file"
          ref={fileRef}
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Input 
          id="description" 
          type="text" 
          value={formData.description} 
          onChange={handleInputChange} 
          placeholder="Description" 
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="location">Location</Label>
        <Input 
          id="location" 
          type="text" 
          value={formData.location} 
          onChange={handleInputChange} 
          placeholder="Location" 
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="availability">Availability</Label>
        <Input 
          id="availability" 
          type="text" 
          value={formData.availability} 
          onChange={handleInputChange} 
          placeholder="Availability" 
        />
      </div>
      <Button type="submit">Create Post</Button>
    </form>
  );
};

export default CreatePost;