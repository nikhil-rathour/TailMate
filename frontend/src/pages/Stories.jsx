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
import CreateStoryForm from "../components/stories/CreatStoryForm";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showMyStories, setShowMyStories] = useState(false);
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
    const matchesOwnership = !showMyStories || story.userId?._id === userInfo?._id;
    return matchesSearch && matchesCategory && matchesOwnership;
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
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-yellow-400/30 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent" />
          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl shadow-lg">
                  <Sparkles className="w-10 h-10 text-black" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                    Pet Stories
                  </h1>
                  <p className="text-gray-300 mt-2 text-lg">
                    Share your pet's amazing journey with the world
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-8 py-4 rounded-2xl flex items-center gap-3 font-bold transition-all duration-300 shadow-xl hover:shadow-yellow-400/30 hover:scale-105"
              >
                <Plus className="w-6 h-6" /> Create New Story
              </button>
            </div>

            {/* Enhanced Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search stories, headers, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/60 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all duration-300 shadow-inner"
                />
              </div>

              <div className="flex gap-3">
                <div className="relative min-w-60">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full pl-12 pr-8 py-4 bg-gray-800/60 border border-gray-600 rounded-2xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all duration-300 appearance-none shadow-inner"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {getCategoryIcon(category)} {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={() => setShowMyStories(!showMyStories)}
                  className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                    showMyStories
                      ? 'bg-yellow-400 text-black shadow-lg'
                      : 'bg-gray-800/60 text-white border border-gray-600 hover:border-yellow-400/50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  My Stories
                </button>
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
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl overflow-hidden hover:border-yellow-400/40 hover:shadow-2xl hover:shadow-yellow-400/20 transition-all duration-500 group"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Media Section */}
                  {story.mediaUrl && (
                    <div className="lg:w-80 h-64 lg:h-auto relative overflow-hidden">
                      {story.mediaType === "VIDEO" ? (
                        <video
                          src={story.mediaUrl}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          controls
                          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23374151' viewBox='0 0 24 24'%3E%3Cpath d='M8 5v14l11-7z'/%3E%3C/svg%3E"
                        />
                      ) : (
                        <img
                          src={story.mediaUrl}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gray-700 flex items-center justify-center"><span class="text-gray-400 text-4xl">🖼️</span></div>';
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      {/* Story Header */}
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-3 bg-gradient-to-r ${getCategoryColor(story.category)} rounded-xl shadow-lg`}>
                          <span className="text-xl">{getCategoryIcon(story.category)}</span>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors mb-1">
                            {story.header}
                          </h2>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(story.category)} text-white`}>
                              {story.category}
                            </span>
                            {story.userId?.name && (
                              <span className={`text-sm flex items-center gap-1 ${
                                story.userId._id === userInfo?._id 
                                  ? 'text-yellow-400 font-semibold' 
                                  : 'text-gray-400'
                              }`}>
                                <User className="w-3 h-3" />
                                {story.userId._id === userInfo?._id ? 'You' : story.userId.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - Only for story owner */}
                      {story.userId?._id === userInfo?._id && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => handleEditStory(story)}
                            className="p-3 text-yellow-400 hover:bg-yellow-400/10 rounded-xl transition-all duration-300 border border-transparent hover:border-yellow-400/30"
                            title="Edit story"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStory(story._id)}
                            className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 border border-transparent hover:border-red-400/30"
                            title="Delete story"
                            disabled={loading}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Story Title */}
                    <h3 className="text-xl font-bold text-gray-200 mb-3 line-clamp-1">
                      {story.title}
                    </h3>

                    {/* Story Content */}
                    <div className="bg-gray-800/30 rounded-xl p-4 mb-4">
                      <p className="text-gray-300 leading-relaxed line-clamp-3">
                        {stripHtml(story.content)}
                      </p>
                      {stripHtml(story.content).length > 200 && (
                        <button className="text-yellow-400 text-sm mt-2 hover:text-yellow-300 transition-colors">
                          Read more...
                        </button>
                      )}
                    </div>

                    {/* Tags */}
                    {story.tags && story.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {story.tags.slice(0, 4).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-full text-xs border border-yellow-400/20 hover:bg-yellow-400/20 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                        {story.tags.length > 4 && (
                          <span className="px-3 py-1 bg-gray-700/50 text-gray-400 rounded-full text-xs border border-gray-600">
                            +{story.tags.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Meta Information */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(story.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
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
                      {story.updatedAt && story.updatedAt !== story.createdAt && (
                        <div className="flex items-center gap-1 text-blue-400">
                          <Edit className="w-4 h-4" />
                          Updated
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Enhanced Stats Footer */}
        {stories.length > 0 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/40 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-white font-semibold">
                  Showing {filteredStories.length} of {stories.length} stories
                </span>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>{stories.filter(s => s.mediaUrl).length} with media</span>
                  <span>{stories.filter(s => s.tags?.length > 0).length} tagged</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => {
                  const count = stories.filter(s => s.category === category).length;
                  return count > 0 ? (
                    <div key={category} className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r ${getCategoryColor(category)} bg-opacity-20 border border-current border-opacity-30`}>
                      <span className="text-lg">{getCategoryIcon(category)}</span>
                      <span className="font-semibold">{count}</span>
                      <span className="text-xs opacity-80">{category}</span>
                    </div>
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