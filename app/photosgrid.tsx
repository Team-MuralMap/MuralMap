import React, { useState } from "react";

function PhotosView() {
  // Initialize the state to true indicating the default view is grid.
  const [isGridView, setIsGridView] = useState(true);

  // Function to switch to list view
  const setListView = () => {
    setIsGridView(false);
  };

  // Function to switch back to grid view
  const setGridView = () => {
    setIsGridView(true);
  };

  return (
    <div>
      <button onClick={setListView}>List View</button>
      <button onClick={setGridView}>Grid View</button>
      <div className={isGridView ? "grid-container" : "list-container"}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            className={isGridView ? "grid-item" : "list-item"}
          >
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhotosView;