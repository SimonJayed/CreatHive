import React, { useEffect, useState } from "react";
import {
  getAllBlogs,
  insertBlog,
  updateBlog,
  deleteBlog,
} from "../../api/blogApi";

function BlogUploadModal({ isOpen, onClose, onSubmit, editingBlog }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    visibility: "public",
  });

  useEffect(() => {
    if (editingBlog) {
      setForm({
        title: editingBlog.title,
        content: editingBlog.content,
        visibility: editingBlog.visibility || "public",
      });
    } else {
      setForm({ title: "", content: "", visibility: "public" });
    }
  }, [editingBlog, isOpen]);

  const handleSubmit = () => {
    if (form.title && form.content) {
      onSubmit(form);
      setForm({ title: "", content: "", visibility: "public" });
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#000',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '600px',
        boxShadow: '0 4px 20px rgba(255, 193, 7, 0.3)',
        border: '2px solid #FFB800'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #333'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#FFB800',
            margin: '0 0 8px 0'
          }}>
            Upload Blog
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#FFB800',
            margin: 0
          }}>
            Share your creative work with the Hivenminds community!
          </p>
        </div>

        <div style={{ padding: '24px', backgroundColor: '#fff' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#000',
              marginBottom: '8px'
            }}>
              Title*
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Give your blog a title"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#000',
              marginBottom: '8px'
            }}>
              Content*
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Tell us about your thoughts..."
              rows="6"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#000',
              marginBottom: '12px'
            }}>
              Visibility
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={form.visibility === "public"}
                  onChange={(e) => setForm({ ...form, visibility: e.target.value })}
                  style={{ marginTop: '2px', marginRight: '8px' }}
                />
                <div>
                  <span style={{ fontWeight: '600', color: '#000' }}>Public</span>
                  <span style={{ fontSize: '13px', color: '#666' }}> - Anyone can see this artwork</span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="visibility"
                  value="unlisted"
                  checked={form.visibility === "unlisted"}
                  onChange={(e) => setForm({ ...form, visibility: e.target.value })}
                  style={{ marginTop: '2px', marginRight: '8px' }}
                />
                <div>
                  <span style={{ fontWeight: '600', color: '#000' }}>Unlisted</span>
                  <span style={{ fontSize: '13px', color: '#666' }}> - Only people with the link can see it</span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={form.visibility === "private"}
                  onChange={(e) => setForm({ ...form, visibility: e.target.value })}
                  style={{ marginTop: '2px', marginRight: '8px' }}
                />
                <div>
                  <span style={{ fontWeight: '600', color: '#000' }}>Private</span>
                  <span style={{ fontSize: '13px', color: '#666' }}> - Only you can see this artwork</span>
                </div>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 24px',
                backgroundColor: 'white',
                color: '#FFB800',
                border: '1px solid #FFB800',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              style={{
                padding: '10px 24px',
                backgroundColor: '#FFB800',
                color: '#ffffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Upload Blog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogCRUD() {
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
      await insertBlog(form);
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
    <div>
      <h2>Blog CRUD</h2>

      <button onClick={() => {
        setEditingBlog(null);
        setIsModalOpen(true);
      }}>
        Create
      </button>

      <h3>Blogs:</h3>
      {blogs.map((blog) => (
        <div key={blog.blogId}>
          <strong>{blog.title}</strong> — {blog.content}
          <button onClick={() => handleEdit(blog)}>Edit</button>
          <button onClick={() => deleteBlog(blog.blogId).then(loadBlogs)}>
            Delete
          </button>
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