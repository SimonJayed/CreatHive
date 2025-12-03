import React, { useEffect, useState } from "react";
import {
  getAllTags,
  insertTag,
  updateTag,
  deleteTag,
} from "../../api/tagApi";
import "../../styles/TagCRUD.css";

function TagModal({ isOpen, onClose, onSubmit, editingTag }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (editingTag) {
      setForm({
        name: editingTag.name,
        description: editingTag.description,
      });
    } else {
      setForm({ name: "", description: "" });
    }
  }, [editingTag, isOpen]);

  const handleSubmit = () => {
    if (form.name) {
      onSubmit(form);
      setForm({ name: "", description: "" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="tag-crud-overlay">
      <div className="tag-crud-modal">
        <div className="tag-crud-header">
          <h2 className="tag-crud-title">
            {editingTag ? "Edit Tag" : "Create Tag"}
          </h2>
          <p className="tag-crud-subtitle">
            Add tags to help organize and discover content!
          </p>
        </div>

        <div className="tag-crud-body">
          <div className="tag-crud-form-group">
            <label className="tag-crud-label">
              Tag Name*
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter tag name"
              className="tag-crud-input"
            />
          </div>

          <div className="tag-crud-form-group">
            <label className="tag-crud-label">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what this tag represents..."
              rows="4"
              className="tag-crud-textarea"
            />
          </div>

          <div className="tag-crud-actions">
            <button
              onClick={onClose}
              className="tag-crud-btn-cancel"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="tag-crud-btn-submit"
            >
              {editingTag ? "Update Tag" : "Create Tag"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TagCRUD() {
  const [tags, setTags] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  const loadTags = async () => {
    const data = await getAllTags();
    setTags(data);
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleSubmit = async (form) => {
    if (editingTag) {
      await updateTag(editingTag.tagId, form);
    } else {
      await insertTag(form);
    }
    setIsModalOpen(false);
    setEditingTag(null);
    loadTags();
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setIsModalOpen(true);
  };

  return (
    <div className="tag-crud-container">
      <h2 className="tag-crud-heading">Tag CRUD</h2>

      <button onClick={() => {
        setEditingTag(null);
        setIsModalOpen(true);
      }}
        className="tag-crud-create-btn"
      >
        Create
      </button>

      <h3 className="tag-crud-heading">Tags:</h3>
      {tags.map((tag) => (
        <div key={tag.tagId} className="tag-item">
          <div className="tag-item-content">
            <strong>{tag.name}</strong> — {tag.description}
          </div>
          <div className="tag-item-actions">
            <button onClick={() => handleEdit(tag)} className="tag-item-btn tag-item-btn-edit">Edit</button>
            <button onClick={() => deleteTag(tag.tagId).then(loadTags)} className="tag-item-btn tag-item-btn-delete">
              Delete
            </button>
          </div>
        </div>
      ))}

      <TagModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTag(null);
        }}
        onSubmit={handleSubmit}
        editingTag={editingTag}
      />
    </div>
  );
}

export default TagCRUD;