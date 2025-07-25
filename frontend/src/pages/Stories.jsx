import { useEffect, useState } from "react";
import { CreateStory, DeleteStory, GetAllStories, UpdateStory } from "../utils/story.utils";
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import CreateStoryForm from "../components/stories/createStoryForm";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { userInfo } = useAuth();
  const [editingStory, setEditingStory] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await GetAllStories();
      setStories(response?.data || []);
    } catch (err) {
      setError('Failed to fetch stories');
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;

    setLoading(true);
    setError('');
    try {
      const response = await DeleteStory(storyId);
      if (response.success) {
        fetchStories();
      }
    } catch (err) {
      setError('Failed to delete story');
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
    setError('');
  };

  const filteredStories = stories.filter(story => {
    const matchesSearch = story?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          story?.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !filterGenre || story?.genre === filterGenre;
    const matchesStatus = !filterStatus || story?.status === filterStatus;
    return matchesSearch && matchesGenre && matchesStatus;
  });

  const genres = [...new Set(stories.map(s => s.genre).filter(Boolean))];
  const statuses = [...new Set(stories.map(s => s.status).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Story Management</h1>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create New Story
            </button>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {showCreateForm && (
          <CreateStoryForm
            userId={userInfo._id}
            story={editingStory}
            onClose={resetForm}
            onUpdated={fetchStories}
          />
        )}

        <div className="p-6">
          {loading && stories.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading stories...</p>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {searchTerm || filterGenre || filterStatus ? 'No stories match your filters' : 'No stories found'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredStories.map((story) => (
                <div key={story._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{story.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                        {story.author && <span>By: {story.author}</span>}
                        {story.genre && <span>Genre: {story.genre}</span>}
                        <span>Status: <span className={`px-2 py-1 rounded-full text-xs ${
                          story.status === 'Published' ? 'bg-green-100 text-green-800' :
                          story.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}
                        `}>{story.status}</span></span>
                        {story.createdAt && <span>Created: {new Date(story.createdAt).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditStory(story)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit story"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStory(story._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete story"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stories;
