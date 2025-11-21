import React, { useState } from "react";
import BlogCRUD from "./components/blogs/BlogCRUD";
import TagCRUD from "./components/tags/TagCRUD";

function App() {
  const [activePage, setActivePage] = useState(null);

  const buttonStyle = {
    padding: "10px 24px",
    backgroundColor: "#FFB800",
    color: "#ffffffff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    margin: "10px",
  };

  const backButtonStyle = {
    ...buttonStyle,
    backgroundColor: "transparent",
    border: "2px solid #FFB800",
    color: "#FFB800",
  };

  return (
    <div
      style={{
        backgroundColor: "black",
        minHeight: "100vh",
        color: "#FFB800",
        padding: "20px",
        textAlign: "center",
      }}
    >
      {/* MENU PAGE */}
      {!activePage && (
        <div>
          <h1 style={{ color: "#FFB800" }}>CreatHive</h1>

          <button style={buttonStyle} onClick={() => setActivePage("blogs")}>
            Manage Blogs
          </button>

          <button style={buttonStyle} onClick={() => setActivePage("tags")}>
            Manage Tags
          </button>
        </div>
      )}

      {/* BLOG CRUD */}
      {activePage === "blogs" && (
        <>
          <button style={backButtonStyle} onClick={() => setActivePage(null)}>
            Back
          </button>
          <BlogCRUD />
        </>
      )}

      {/* TAG CRUD */}
      {activePage === "tags" && (
        <>
          <button style={backButtonStyle} onClick={() => setActivePage(null)}>
            Back
          </button>
          <TagCRUD />
        </>
      )}
    </div>
  );
}

export default App;
