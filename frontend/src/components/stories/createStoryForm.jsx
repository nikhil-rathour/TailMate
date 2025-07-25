import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CreateStory } from "../../utils/story.utils";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const categories = ["FUNNY", "SAD", "EMOTIONAL", "JOURNEY"];

const CreateStoryForm = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState("IMAGE");

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  const formik = useFormik({
    initialValues: {
      header: "",
      title: "",
      content: "",
      category: "JOURNEY",
      tags: "",
      mediaUrl: "",
    },
    validationSchema: Yup.object({
      header: Yup.string().required("Header is required"),
      title: Yup.string().required("Title is required"),
      category: Yup.string().required("Category is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const content = editor?.getHTML();
      if (!content || content === "<p></p>") {
        alert("Content cannot be empty");
        return;
      }

    try {
  setLoading(true);
  const payload = {
    ...values,
    content,
    userId,
    mediaType,
    tags: values.tags.split(",").map((t) => t.trim()).filter(Boolean),
  };
  await CreateStory(payload);
  alert("Story created!");
  resetForm();
  editor.commands.setContent("");
} catch (err) {
  console.error("Error creating story:", err.message);
  alert(err.message || "Something went wrong");
} finally {
  setLoading(false);
}
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow space-y-5"
    >
      <h2 className="text-2xl font-bold text-center mb-4">Create a Story</h2>

      {/* Header */}
      <div>
        <label className="block font-medium">Header *</label>
        <input
          name="header"
          value={formik.values.header}
          onChange={formik.handleChange}
          className="w-full p-2 border rounded"
        />
        {formik.touched.header && formik.errors.header && (
          <p className="text-red-500 text-sm">{formik.errors.header}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block font-medium">Title *</label>
        <input
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          className="w-full p-2 border rounded"
        />
        {formik.touched.title && formik.errors.title && (
          <p className="text-red-500 text-sm">{formik.errors.title}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Story Content *</label>
        <div className="border rounded p-2 min-h-[150px]">
          {editor ? (
            <EditorContent editor={editor} />
          ) : (
            <p className="text-gray-500 text-sm">Editor loading...</p>
          )}
        </div>
      </div>

      {/* Media URL */}
      <div>
        <label className="block font-medium">Media URL</label>
        <input
          name="mediaUrl"
          value={formik.values.mediaUrl}
          onChange={formik.handleChange}
          placeholder="https://..."
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Media Type */}
      <div>
        <label className="block font-medium">Media Type</label>
        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="IMAGE">Image</option>
          <option value="VIDEO">Video</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block font-medium">Category</label>
        <select
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
          className="w-full p-2 border rounded"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block font-medium">Tags (comma separated)</label>
        <input
          name="tags"
          value={formik.values.tags}
          onChange={formik.handleChange}
          placeholder="dog, cute, rescue"
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Submit */}
      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Story"}
        </button>
      </div>
    </form>
  );
};

export default CreateStoryForm;
