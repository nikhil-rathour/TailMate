import React, { useState } from "react";
import TiptapEditor from "./TipTapEditor";
import { CreateStory } from "../../utils/story.utils";

const CreateStoryForm = ({ userId }) => {
  const [formData, setFormData] = useState({
    title: "",
    header: "",
    type: "emotional",
    content: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.header.trim()) {
      newErrors.header = "Header is required";
    }
    
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Handle media upload with progress
  const handleMediaUpload = async () => {
    if (!mediaFile) return null;
    
    const formDataUpload = new FormData();
    formDataUpload.append("file", mediaFile);

    try {
      const response = await axios.post(`${API_URL}/upload`, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      
      return response.data.url;
    } catch (error) {
      console.error("Media upload failed:", error);
      throw new Error("Failed to upload media file");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Upload media file
      const mediaUrl = await handleMediaUpload();
      
      if (!mediaUrl) {
        throw new Error("Media upload failed");
      }

      // Prepare story data
      const storyData = {
        ...formData,
        mediaUrl,
        userId,
      };

      // Create story using API function
      const response = await CreateStory(storyData);

      if (response.success) {
        // Reset form
        setFormData({
          title: "",
          header: "",
          type: "emotional",
          content: "",
        });
        setMediaFile(null);
        setUploadProgress(0);
        
        // Show success message
        alert("Story created successfully!");
        
        // Call callback if provided
        if (onStoryCreated) {
          onStoryCreated(response.data);
        }
      } else {
        throw new Error(response.message || "Failed to create story");
      }
    } catch (error) {
      console.error("Error creating story:", error);
      alert(error.message || "Something went wrong while creating story");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMediaFile(file);
    
    // Clear media error
    if (errors.media) {
      setErrors(prev => ({
        ...prev,
        media: ""
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Create New Story</h2>
          <p className="text-blue-100 mt-1">Share your story with the world</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Story Title *
            </label>
            <input
              type="text"
              placeholder="Enter your story title..."
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-red-500 text-sm flex items-center">
                <span className="w-4 h-4 mr-1">⚠</span>
                {errors.title}
              </p>
            )}
          </div>

          {/* Header Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Story Header *
            </label>
            <input
              type="text"
              placeholder="Enter a compelling header..."
              value={formData.header}
              onChange={(e) => handleInputChange("header", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.header ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.header && (
              <p className="text-red-500 text-sm flex items-center">
                <span className="w-4 h-4 mr-1">⚠</span>
                {errors.header}
              </p>
            )}
          </div>

          {/* Type Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Story Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isLoading}
            >
              <option value="funny">😄 Funny</option>
              <option value="emotional">❤️ Emotional</option>
              <option value="sad">😢 Sad</option>
              <option value="journey">🚀 Journey</option>
            </select>
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Story Content *
            </label>
            <div className={`border rounded-lg ${errors.content ? "border-red-500" : "border-gray-300"}`}>
              <TiptapEditor 
                content={formData.content} 
                setContent={(content) => handleInputChange("content", content)}
                disabled={isLoading}
              />
            </div>
            {errors.content && (
              <p className="text-red-500 text-sm flex items-center">
                <span className="w-4 h-4 mr-1">⚠</span>
                {errors.content}
              </p>
            )}
          </div>

          {/* Upload Progress */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-center text-sm">
                <span className="text-gray-600">Creating your story...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 animate-pulse"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: "",
                  header: "",
                  type: "emotional",
                  content: "",
                });
                setErrors({});
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Story...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Create Story</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStoryForm;