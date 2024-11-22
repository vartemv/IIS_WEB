
// docker exec -it iis_cont_be bash
// psql -U postgres -d iis

'use client';
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    mediafile: '',
    description: '',
    location: '',
    availability: 'true',
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        console.log('data succes')
      } else {
        console.error("Failed to create post:", data.message);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="mediafile">Picture</Label>
        <Input id="mediafile" type="file" value={formData.mediafile} onChange={handleInputChange} placeholder="Picture URL" />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Input id="description" type="text" value={formData.description} onChange={handleInputChange} placeholder="Description" />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="location">Location</Label>
        <Input id="location" type="text" value={formData.location} onChange={handleInputChange} placeholder="Location" />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="availability">Availability</Label>
        <Input id="availability" type="text" value={formData.availability} onChange={handleInputChange} placeholder="Availability" />
      </div>
      <Button type="submit">Create Post</Button>
    </form>
  );
};

export default CreatePost;
