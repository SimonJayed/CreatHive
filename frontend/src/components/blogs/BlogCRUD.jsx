import React, { useEffect, useState } from "react";
import { usePopup } from "../../context/PopupContext";
import {
  getAllBlogs,
  insertBlog,
  updateBlog,
  deleteBlog,
} from "../../api/blogApi";
import BlogUploadModal from "./BlogUploadModal";
import "../../styles/BlogCRUD.css";

function BlogCRUD() {
  const { showAlert } = usePopup();
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const loadBlogs = async () => {
    const data = await getAllBlogs();
    setBlogs(data);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleSubmit = async (form) => {
    if (editingBlog) {
      await updateBlog(editingBlog.blogId, form);
    } else {
      const user = JSON.parse(localStorage.getItem('currentArtist'));
      if (!user || !user.artistId) {
        showAlert("Login Required", "You must be logged in to create a blog.");
        return;
      }
      const artistId = user.artistId;
      await insertBlog(form, artistId);
    }
    setIsModalOpen(false);
    setEditingBlog(null);
    loadBlogs();
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };

  return (
    <div className="blog-crud-container">
      <h2 className="blog-crud-heading">Blog CRUD</h2>

      <button
        onClick={() => {
          setEditingBlog(null);
          setIsModalOpen(true);
        }}
        className="blog-crud-create-btn"
      >
        Create
      </button>

      <h3 className="blog-crud-heading">Blogs:</h3>
      {blogs.map((blog) => (
        <div key={blog.blogId} className="blog-item">
          <div className="blog-item-content">
            <strong>{blog.title}</strong> — {blog.content}
          </div>
          <div className="blog-item-actions">
            <button onClick={() => handleEdit(blog)} className="blog-item-btn blog-item-btn-edit">Edit</button>
            <button onClick={() => deleteBlog(blog.blogId).then(loadBlogs)} className="blog-item-btn blog-item-btn-delete">
              Delete
            </button>
          </div>
        </div>
      ))}

      <BlogUploadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBlog(null);
        }}
        onSubmit={handleSubmit}
        editingBlog={editingBlog}
      />
    </div>
  );
}

export default BlogCRUD;