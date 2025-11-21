import React, { useEffect, useState } from "react";
import {
  getAllTags,
  insertTag,
  updateTag,
  deleteTag,
} from "../../api/tagApi";

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
        border: '2px solid #FFC107'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #333'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#FFC107',
            margin: '0 0 8px 0'
          }}>
            {editingTag ? "Edit Tag" : "Create Tag"}
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#999',
            margin: 0
          }}>
            Add tags to help organize and discover content!
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
              Tag Name*
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter tag name"
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

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#000',
              marginBottom: '8px'
            }}>
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what this tag represents..."
              rows="4"
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 24px',
                backgroundColor: 'white',
                color: '#000',
                border: '1px solid #ddd',
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
                backgroundColor: '#FFC107',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
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
    <div>
      <h2>Tag CRUD</h2>

      <button onClick={() => {
        setEditingTag(null);
        setIsModalOpen(true);
      }}>
        Create
      </button>

      <h3>Tags:</h3>
      {tags.map((tag) => (
        <div key={tag.tagId}>
          <strong>{tag.name}</strong> — {tag.description}
          <button onClick={() => handleEdit(tag)}>Edit</button>
          <button onClick={() => deleteTag(tag.tagId).then(loadTags)}>
            Delete
          </button>
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