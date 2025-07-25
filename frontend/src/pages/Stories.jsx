import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  Image,
  Video,
  Sparkles,
  BookOpen,
  Filter,
} from "lucide-react";
import { GetAllStories, DeleteStory } from "../utils/story.utils";
import { useAuth } from "../context/AuthContext";
import CreateStoryForm from "../components/stories/createStoryForm";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { userInfo } = useAuth();
  const [editingStory, setEditingStory] = useState(null);

  const categories = ["FUNNY", "SAD", "EMOTIONAL", "JOURNEY"];

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await GetAllStories();
      // Handle different response structures
      if (response.success && response.data) {
        setStories(response.data);
      } else if (Array.isArray(response.data)) {
        setStories(response.data);
      } else if (Array.isArray(response)) {
        setStories(response);
      } else {
        setStories([]);
      }
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch stories";
      setError(errorMsg);
      console.error("Error fetching stories:", err);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this story? This action cannot be undone."
      )
    )
      return;

    setLoading(true);
    setError("");
    try {
      const response = await DeleteStory(storyId);
      if (response.success || response.message) {
        // Show success message
        const successMsg = response.message || "Story deleted successfully!";
        alert(successMsg);
        // Refresh the stories list
        fetchStories();
      }
    } catch (err) {
      const errorMsg = err.message || "Failed to delete story";
      setError(errorMsg);
      console.error("Delete story error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStory = (story) => {
    setEditingStory(story);
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setShowCreateForm(false);
    setEditingStory(null);
    setError("");
    // Refresh stories after form operations
    fetchStories();
  };

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story?.header?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story?.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      !filterCategory || story?.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case "FUNNY":
        return "😂";
      case "SAD":
        return "😢";
      case "EMOTIONAL":
        return "❤️";
      case "JOURNEY":
        return "🚀";
      default:
        return "📖";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "FUNNY":
        return "from-yellow-400 to-orange-400";
      case "SAD":
        return "from-blue-400 to-indigo-400";
      case "EMOTIONAL":
        return "from-pink-400 to-red-400";
      case "JOURNEY":
        return "from-green-400 to-emerald-400";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-yellow-400/20 mb-8">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl">
                  <Sparkles className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    Story Management
                  </h1>
                  <p className="text-gray-400 mt-1">
                    Create, edit, and manage your stories
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all duration-300 shadow-lg hover:shadow-yellow-400/25"
              >
                <Plus className="w-5 h-5" /> Create New Story
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search stories, headers, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 appearance-none min-w-48"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {getCategoryIcon(category)} {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-xl">
            <p className="text-red-300 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              {error}
            </p>
          </div>
        )}

        {/* Create/Edit Form Modal */}
        {showCreateForm && (
          <CreateStoryForm
            userId={userInfo._id}
            story={editingStory}
            onClose={resetForm}
            onUpdated={fetchStories}
          />
        )}

        {/* Stories Grid */}
        <div className="space-y-6">
          {loading && stories.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
              <p className="mt-4 text-gray-400 text-lg">
                Loading your stories...
              </p>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-gray-800/50 rounded-full inline-block mb-4">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                {searchTerm || filterCategory
                  ? "No stories match your filters"
                  : "No stories yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterCategory
                  ? "Try adjusting your search or filters"
                  : "Start creating your first story to see it here"}
              </p>
              {!searchTerm && !filterCategory && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-6 py-3 rounded-xl font-bold transition-all duration-300"
                >
                  Create Your First Story
                </button>
              )}
            </div>
          ) : (
            filteredStories.map((story) => (
              <div
                key={story._id}
                className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-yellow-400/30 hover:shadow-lg hover:shadow-yellow-400/10 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Story Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`p-2 bg-gradient-to-r ${getCategoryColor(
                          story.category
                        )} rounded-lg`}
                      >
                        <span className="text-lg">
                          {getCategoryIcon(story.category)}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                          {story.header}
                        </h2>
                        <p className="text-gray-400 text-sm">
                          {story.category}
                        </p>
                      </div>
                    </div>

                    {/* Story Title */}
                    <h3 className="text-lg font-semibold text-gray-200 mb-3">
                      {story.title}
                    </h3>

                    {/* Story Preview */}
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {stripHtml(story.content).substring(0, 150)}
                      {stripHtml(story.content).length > 150 && "..."}
                    </p>

                    {/* Meta Information */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(story.createdAt).toLocaleDateString()}
                      </div>
                      {story.mediaUrl && (
                        <div className="flex items-center gap-1">
                          {story.mediaType === "VIDEO" ? (
                            <Video className="w-4 h-4" />
                          ) : (
                            <Image className="w-4 h-4" />
                          )}
                          {story.mediaType}
                        </div>
                      )}
                      {story.tags && story.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          {story.tags.length} tags
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {story.tags && story.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {story.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-full text-xs border border-yellow-400/20"
                          >
                            #{tag}
                          </span>
                        ))}
                        {story.tags.length > 3 && (
                          <span className="px-3 py-1 bg-gray-700/50 text-gray-400 rounded-full text-xs border border-gray-600">
                            +{story.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleEditStory(story)}
                      className="p-3 text-yellow-400 hover:bg-yellow-400/10 rounded-xl transition-all duration-300 border border-transparent hover:border-yellow-400/20"
                      title="Edit story"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteStory(story._id)}
                      className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 border border-transparent hover:border-red-400/20"
                      title="Delete story"
                      disabled={loading}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats Footer */}
        {stories.length > 0 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-700/30">
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>
                Showing {filteredStories.length} of {stories.length} stories
              </span>
              <div className="flex gap-6">
                {categories.map((category) => {
                  const count = stories.filter(
                    (s) => s.category === category
                  ).length;
                  return count > 0 ? (
                    <span key={category} className="flex items-center gap-1">
                      <span>{getCategoryIcon(category)}</span>
                      {count}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;
