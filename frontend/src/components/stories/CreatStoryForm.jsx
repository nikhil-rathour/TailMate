import React, { useEffect, useState } from "react";
import { CreateStory, UpdateStory } from "../../utils/story.utils";
import {
  Camera,
  Video,
  Tag,
  BookOpen,
  Sparkles,
  Upload,
  X,
  Loader2,
  Heart,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const categories = ["FUNNY", "SAD", "EMOTIONAL", "JOURNEY"];

const CreateStoryForm = ({ userId, story, onClose, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState("IMAGE");
  const [formData, setFormData] = useState({
    header: "",
    title: "",
    content: "",
    category: "JOURNEY",
    tags: "",
    mediaUrl: "",
  });
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (story) {
      setFormData({
        header: story.header || "",
        title: story.title || "",
        content: story.content || "",
        category: story.category || "JOURNEY",
        tags: story.tags?.join(", ") || "",
        mediaUrl: story.mediaUrl || "",
      });
      setMediaType(story.mediaType || "IMAGE");
      if (story.mediaUrl) {
        setImagePreview(story.mediaUrl);
      }
    }
  }, [story]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast.error("Please select a valid image or video file");
        e.target.value = ''; // Clear the input
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        e.target.value = ''; // Clear the input
        return;
      }

      console.log('File selected:', { name: file.name, size: file.size, type: file.type });
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      // Clear mediaUrl when file is selected
      setFormData((prev) => ({ ...prev, mediaUrl: "" }));
      
      // Update media type based on file
      if (file.type.startsWith('video/')) {
        setMediaType('VIDEO');
      } else {
        setMediaType('IMAGE');
      }
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, mediaUrl: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.header.trim()) newErrors.header = "Header is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.content.trim()) newErrors.content = "Content cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate userId
    if (!userId) {
      toast.error("User ID is required. Please log in again.");
      return;
    }

    const loadingToast = toast.loading(
      story ? "Updating story..." : "Creating story..."
    );

    try {
      setLoading(true);
      setErrors({});

      // Prepare payload based on whether we have a file upload or not
      let payload;

      if (imageFile) {
        // Create FormData for file upload
        const data = new FormData();

        // Add form fields
        Object.entries(formData).forEach(([key, value]) => {
          if (key === "tags") {
            // Handle tags as array
            const tagsArray = value
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
            data.append(key, JSON.stringify(tagsArray));
          } else {
            data.append(key, value);
          }
        });

        // Add additional fields
        data.append("userId", userId);
        data.append("mediaType", mediaType);
        data.append("mediaFile", imageFile);

        payload = data;
      } else {
        // Regular JSON payload
        payload = {
          ...formData,
          userId,
          mediaType,
          tags: formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        };
      }

      let result;
      if (story?._id) {
        // Update existing story
        result = await UpdateStory(story._id, payload);
        toast.success("Story updated successfully! 🎉", { id: loadingToast });
      } else {
        // Create new story
        result = await CreateStory(payload);
        toast.success("Story created successfully! 🎉", { id: loadingToast });
      }
      
      console.log('Story operation result:', result);

      // Auto-close after success
      setTimeout(() => {
        if (onUpdated) onUpdated();
        if (onClose) onClose();

        // Reset form only for new stories
        if (!story?._id) {
          setFormData({
            header: "",
            title: "",
            content: "",
            category: "JOURNEY",
            tags: "",
            mediaUrl: "",
          });
          setMediaType("IMAGE");
          setImageFile(null);
          setImagePreview("");
        }
      }, 1000);
    } catch (err) {
      console.error("Error with story:", err.message);
      const errorMessage =
        err.message || "Something went wrong. Please try again.";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-hidden"
      onWheel={(e) => e.stopPropagation()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-gradient-to-br from-navy via-navy/95 to-black rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] border-2 border-gold/30 flex flex-col overflow-hidden"
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold/20 bg-navy/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-gold to-accent-orange rounded-xl shadow-lg">
              <BookOpen className="w-6 h-6 text-navy" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gold">
                {story ? "Edit Pet Story" : "Share Your Pet's Story"}
              </h2>
              <p className="text-white/70 text-sm">
                Tell the world about your amazing companion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6" 
          style={{ scrollBehavior: 'smooth' }}
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Error Message */}
          {errors.submit && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
              {errors.submit}
            </div>
          )}

          {/* Story Header */}
          <div>
            <label className="block text-gold font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Story Header *
            </label>
            <input
              name="header"
              value={formData.header}
              onChange={handleInputChange}
              className="w-full p-4 bg-navy/50 border border-gold/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
              placeholder="Give your story a captivating header..."
              disabled={loading}
            />
            {errors.header && (
              <p className="text-red-400 text-sm mt-1">{errors.header}</p>
            )}
          </div>

          {/* Story Title */}
          <div>
            <label className="block text-gold font-semibold mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Story Title *
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-4 bg-navy/50 border border-gold/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
              placeholder="What's your pet's story called?"
              disabled={loading}
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Story Content */}
          <div>
            <label className="block text-gold font-semibold mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Your Pet's Story *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={6}
              className="w-full p-4 bg-navy/50 border border-gold/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300 resize-none"
              placeholder="Share your pet's amazing journey, funny moments, or heartwarming experiences..."
              disabled={loading}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.content && (
                <p className="text-red-400 text-sm">{errors.content}</p>
              )}
              <span className="text-white/50 text-xs ml-auto">
                {formData.content.length} characters
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Media Upload */}
            <div>
              <label className="block text-gold font-semibold mb-2 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Media
              </label>
              <div className="border-2 border-dashed border-gold/30 rounded-lg p-4 text-center hover:border-gold/50 transition-colors">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="w-full bg-navy/50 border border-gold/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-gold file:to-accent-orange file:text-navy file:font-semibold hover:file:from-accent-orange hover:file:to-gold transition-all duration-300"
                  disabled={loading}
                />
                <p className="text-white/60 text-xs mt-2">
                  Support images and videos up to 10MB
                </p>
              </div>
            </div>

            {/* Media URL */}
            <div>
              <label className="block text-gold font-semibold mb-2 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Or Media URL
              </label>
              <input
                name="mediaUrl"
                value={formData.mediaUrl}
                onChange={handleInputChange}
                placeholder="https://your-media-url.com"
                className="w-full p-4 bg-navy/50 border border-gold/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                disabled={loading || imageFile}
              />
              {imageFile && (
                <p className="text-white/60 text-xs mt-1">
                  File upload takes priority over URL
                </p>
              )}
            </div>
          </div>

          {/* Media Preview */}
          {imagePreview && (
            <div>
              <label className="block text-gold font-semibold mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Media Preview
              </label>
              <div className="relative h-60 w-full rounded-lg overflow-hidden border border-gold/30">
                {mediaType === "VIDEO" && (imageFile?.type?.startsWith('video/') || imagePreview.includes('video')) ? (
                  <video
                    src={imagePreview}
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={imagePreview}
                    alt="Media preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Media+URL';
                    }}
                  />
                )}
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Media Type */}
            <div>
              <label className="block text-gold font-semibold mb-2">Media Type</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="w-full p-4 bg-navy/50 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                disabled={loading}
              >
                <option value="IMAGE">📸 Image</option>
                <option value="VIDEO">🎥 Video</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-gold font-semibold mb-2">Story Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-4 bg-navy/50 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                disabled={loading}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "FUNNY" && "😂 "}
                    {cat === "SAD" && "😢 "}
                    {cat === "EMOTIONAL" && "❤️ "}
                    {cat === "JOURNEY" && "🚀 "}
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-gold font-semibold mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </label>
            <input
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="adventure, funny, heartwarming, rescue"
              className="w-full p-4 bg-navy/50 border border-gold/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
              disabled={loading}
            />
            <p className="text-white/60 text-xs mt-1">
              Separate tags with commas
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 px-6 py-4 border-t border-gold/20 bg-navy/50">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 font-semibold"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-8 py-3 rounded-lg font-bold transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {story ? "Updating..." : "Creating..."}
              </>
            ) : (
              story ? "Update Story" : "Create Story"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateStoryForm;