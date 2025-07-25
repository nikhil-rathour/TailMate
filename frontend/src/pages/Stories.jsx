import React, { useState, useEffect, useRef } from 'react';
import { CreateStory, GetAllStories } from '../utils/story.utils';
import toast from 'react-hot-toast';
import { Heart, Upload, Tag, Calendar, Eye, Share2, BookOpen, Sparkles, Image, Video, X, Bold, Italic, Underline, List, Link2 } from 'lucide-react';
import CreateStoryForm from '../components/stories/createStoryForm';
import { useAuth } from '../context/AuthContext';

const Stories = () => {
  const [header, setHeader] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState('IMAGE');
  const [category, setCategory] = useState('JOURNEY');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [mediaPreview, setMediaPreview] = useState('');
  const [showForm, setShowForm] = useState(false);
  const contentRef = useRef(null);
  const { userInfo } = useAuth();

  console.log("userinfo", userInfo)

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await GetAllStories();
      setStories(res?.stories || []);
    } catch (err) {
      console.error("Error loading stories:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleFormatting = (command, value = null) => {
    document.execCommand(command, false, value);
    if (contentRef.current) {
      contentRef.current.focus();
      setContent(contentRef.current.innerHTML);
    }
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      setMediaPreview(URL.createObjectURL(file));
    } else {
      setMedia(null);
      setMediaPreview('');
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview('');
    // Reset file input
    const fileInput = document.getElementById('media-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!title || !header || !content || !media) {
      toast.error("Please fill in all required fields and add media.");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('header', header);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('mediaType', mediaType);
    formData.append('tags', JSON.stringify(tags.split(',').map(tag => tag.trim())));
    formData.append('media', media);

    try {
      setLoading(true);
      await CreateStory(formData);
      toast.success("Story shared successfully! 🎉");
      resetForm();
      fetchStories();
      setShowForm(false);
    } catch (err) {
      console.error("Error posting story:", err);
      toast.error("Failed to share story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setHeader('');
    setTitle('');
    setContent('');
    setCategory('JOURNEY');
    setTags('');
    setMedia(null);
    setMediaPreview('');
    setMediaType('IMAGE');
    if (contentRef.current) {
      contentRef.current.innerHTML = '';
    }
    // Reset file input
    const fileInput = document.getElementById('media-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const categoryColors = {
    FUNNY: 'bg-gradient-to-r from-yellow-400 to-orange-400',
    SAD: 'bg-gradient-to-r from-blue-400 to-purple-400',
    EMOTIONAL: 'bg-gradient-to-r from-pink-400 to-red-400',
    JOURNEY: 'bg-gradient-to-r from-green-400 to-teal-400'
  };

  const categoryEmojis = {
    FUNNY: '😄',
    SAD: '😢',
    EMOTIONAL: '💝',
    JOURNEY: '🌟'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <style dangerouslySetInnerHTML={{
        __html: `
          .content-editor:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            font-style: italic;
            pointer-events: none;
          }
          .content-editor {
            outline: none;
            line-height: 1.6;
            font-size: 14px;
          }
          .content-editor p {
            margin: 0.5em 0;
          }
          .content-editor ul {
            margin: 0.5em 0;
            padding-left: 1.5em;
          }
          .content-editor li {
            list-style-type: disc;
            margin: 0.25em 0;
          }
          .content-editor a {
            color: #3b82f6;
            text-decoration: underline;
          }
          .content-editor strong {
            font-weight: bold;
          }
          .content-editor em {
            font-style: italic;
          }
          .content-editor u {
            text-decoration: underline;
          }
        `
      }} />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Pet Stories
                </h1>
                <p className="text-sm text-slate-500">Share your heartwarming pet moments</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              <span>{showForm ? 'Cancel' : 'Share Story'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Story Creation Form */}
        {showForm && (
       <CreateStoryForm
        userId={userInfo._id}/>
        )}

        {/* Stories Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Community Stories
              </h3>
              <p className="text-slate-500 mt-1">Heartwarming tales from pet lovers around the world</p>
            </div>
            {stories.length > 0 && (
              <div className="text-sm text-slate-500 bg-white/50 px-4 py-2 rounded-full">
                {stories.length} {stories.length === 1 ? 'story' : 'stories'}
              </div>
            )}
          </div>

          {fetching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/50 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded" />
                      <div className="h-3 bg-slate-200 rounded w-5/6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-16 h-16 text-slate-400" />
              </div>
              <h4 className="text-2xl font-bold text-slate-600 mb-2">No stories yet</h4>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Be the first to share a heartwarming story about your beloved pet. Your story could inspire others!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Share Your Story
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => (
                <article key={story._id} className="group bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20">
                  {/* Category Badge */}
                  <div className="relative">
                    {story.mediaType === 'IMAGE' ? (
                      <img
                        src={story.mediaUrl}
                        alt={story.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <video className="w-full h-48 object-cover">
                        <source src={story.mediaUrl} type="video/mp4" />
                      </video>
                    )}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-semibold ${categoryColors[story.category]}`}>
                      {categoryEmojis[story.category]} {story.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      {story.header}
                    </p>
                    <h4 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {story.title}
                    </h4>
                    
                    <div
                      className="prose prose-sm max-w-none text-slate-600 mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: story.content }}
                    />

                    {story.tags && story.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {story.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                        {story.tags.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-full font-medium">
                            +{story.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(story.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                          <Share2 className="w-3 h-3" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stories;