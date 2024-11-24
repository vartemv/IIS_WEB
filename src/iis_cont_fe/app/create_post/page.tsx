'use client';
import React, { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Navbar from "../../components/ui/navbar";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    availability: 'TRUE',
    tags: '',
    allowedUsers: '',
    allowedGroups: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


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
    

    if (!file || file.size > 10 * 1024 * 1024) { // 10MB limit
      console.error("File is required and must be under 10MB");
      return;
    }
  
    if (!formData.description || formData.description.length > 1000) {
      console.error("Description is required and must be under 1000 characters");
      return;
    }
  
    // Validate allowed file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.error("Invalid file type");
      return;
    }
    
    
    try {
      if (file) {
        const formDataWithFile = new FormData();
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.name.replaceAll(" ", "_")}`;
        formDataWithFile.append('file', new File([file], filename, { type: file.type }));
        
        const createPostResponse = await fetch('/api/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({
          ...formData,
          mediafile: `/${filename}`,
          tags: formData.tags.split(',').map(tag => tag.trim()),
          allowedUsers: formData.allowedUsers.split(',').map(user => user.trim()),
          allowedGroups: formData.allowedGroups.split(',').map(group => group.trim()), 
        }),
        });
        
        const data = await createPostResponse.json();
        if (data.success) {
          const uploadResponse = await fetch('/api/savePost', {
            method: 'POST',
            body: formDataWithFile
          });
          if (uploadResponse.ok) {
            console.log('Post created successfully');
            setErrorMessage(null); 
            // Reset form
            setFormData({
              description: '',
              location: '',
              availability: 'TRUE',
              tags: '',
              allowedUsers: '',
              allowedGroups: '', 
              
            });
            setFile(null);
            setImagePreview(null);
            if (fileRef.current) {
              fileRef.current.value = '';
            }
            
          }
        }else {
          // Display error message from server
          setErrorMessage(data.message || 'Failed to create post');
          return; // Don't proceed with file upload if post creation failed
        }
        
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setErrorMessage('An error occurred while creating the post');

    }
  };

  //todo
  const isFormValid = () => {
    const { description, location, availability, allowedUsers, allowedGroups } = formData;
    if (description && location && file) {
      // if (availability === 'FALSE') {
      //   return allowedUsers.trim();
      // }
      return true;
    }
    return false;
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
        
        {/* Left Section*/}
        <div className="flex justify-center items-center w-1/2">
          <div className="w-full max-w-sm border-2 border-dashed border-gray-400 p-5 flex flex-col items-center justify-center">
              {imagePreview && (
                <img src={imagePreview} alt="Selected file" className="mt-4 max-w-full h-auto" />
              )}
            <label className="cursor-pointer">
              <input 
                type="file" 
                className="hidden"
                ref={fileRef}
                onChange={handleFileChange}
                accept="image/*"
              />
              <button 
                type="button" 
                className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
                onClick={() => fileRef.current?.click()}
              >
                Add image
              </button>
            </label>
          </div>
        </div>

        {/* Right Section*/}
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
            <Button type="submit" className="bg-blue-500 w-full" disabled={!isFormValid()}>Post</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;