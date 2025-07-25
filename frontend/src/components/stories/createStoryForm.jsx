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
    setImageFile(file);
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast.error("Please select a valid image or video file");
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setImagePreview(URL.createObjectURL(file));
      // Clear mediaUrl when file is selected
      setFormData((prev) => ({ ...prev, mediaUrl: "" }));
    } else {
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


      if (story?._id) {
        // Update existing story
     await UpdateStory(story._id, payload);
        toast.success("Story updated successfully! 🎉", { id: loadingToast });
      } else {
        // Create new story
      await CreateStory(payload);
        toast.success("Story created successfully! 🎉", { id: loadingToast });
      }

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] border border-yellow-400/20 flex flex-col overflow-hidden"
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-700 flex-shrink-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg">
              <BookOpen className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              {story ? "Edit Story" : "Create New Story"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl p-2 hover:bg-gray-700 rounded-lg"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          className="flex-1 overflow-y-auto px-8 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-yellow-400 hover:scrollbar-thumb-yellow-500"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#FBBF24 #374151",
          }}
        >
          <div className="py-6 space-y-6">
            {/* Error Message */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-900/50 border border-red-500/50 rounded-xl"
              >
                <p className="text-red-300 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  {errors.submit}
                </p>
              </motion.div>
            )}

            {/* Header */}
            <div className="group">
              <label className="block text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Header *
              </label>
              <input
                name="header"
                value={formData.header}
                onChange={handleInputChange}
                className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                placeholder="Enter a captivating header..."
                disabled={loading}
              />
              {errors.header && (
                <p className="text-red-400 text-sm mt-2">{errors.header}</p>
              )}
            </div>

            {/* Title */}
            <div className="group">
              <label className="block text-yellow-400 font-semibold mb-2">
                Title *
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                placeholder="What's your story called?"
                disabled={loading}
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-2">{errors.title}</p>
              )}
            </div>

            {/* Story Content */}
            <div className="group">
              <label className="block text-yellow-400 font-semibold mb-2">
                Story Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={8}
                className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 resize-none"
                placeholder="Tell your story here..."
                disabled={loading}
              />
              {errors.content && (
                <p className="text-red-400 text-sm mt-2">{errors.content}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Media Upload */}
              <div className="group">
                <label className="block text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Media
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-black hover:file:bg-yellow-500 transition-all duration-300"
                    disabled={loading}
                  />
                  <div className="text-xs text-gray-400">
                    Support images and videos up to 10MB
                  </div>
                </div>
              </div>

              {/* Media URL (Alternative) */}
              <div className="group">
                <label className="block text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Or Media URL
                </label>
                <input
                  name="mediaUrl"
                  value={formData.mediaUrl}
                  onChange={handleInputChange}
                  placeholder="https://your-media-url.com"
                  className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                  disabled={loading || imageFile}
                />
                {imageFile && (
                  <p className="text-xs text-gray-400 mt-1">
                    File upload takes priority over URL
                  </p>
                )}
              </div>
            </div>

            {/* Media Preview */}
            {imagePreview && (
              <div className="group">
                <label className="block text-yellow-400 font-semibold mb-2">
                  Media Preview
                </label>
                <div className="relative h-60 w-full rounded-xl overflow-hidden shadow-lg border border-gray-700">
                  {mediaType === "VIDEO" && imagePreview.includes("video") ? (
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
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=Invalid+Media+URL";
                      }}
                    />
                  )}
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Media Type */}
              <div className="group">
                <label className="block text-yellow-400 font-semibold mb-2">
                  Media Type
                </label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value)}
                  className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                  disabled={loading}
                >
                  <option value="IMAGE">📸 Image</option>
                  <option value="VIDEO">🎥 Video</option>
                </select>
              </div>

              {/* Category */}
              <div className="group">
                <label className="block text-yellow-400 font-semibold mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
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
            <div className="group mb-8">
              <label className="block text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <input
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="adventure, inspiring, life-changing"
                className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                disabled={loading}
              />
              <p className="text-gray-400 text-xs mt-1">
                Separate tags with commas
              </p>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex justify-end gap-4 px-8 py-6 border-t border-gray-700 flex-shrink-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 font-semibold"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-yellow-400/25 flex items-center gap-2 min-w-[140px] justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {story ? "Updating..." : "Creating..."}
              </>
            ) : story ? (
              "Update Story"
            ) : (
              "Create Story"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateStoryForm;
