import React, { useState } from 'react';

interface Photo {
  id: string;
  url: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const [isGridView, setIsGridView] = useState<boolean>(true);

  const setListView = () => {
    setIsGridView(false);
  };

  const setGridView = () => {
    setIsGridView(true);
  };

  return (
    <div>
      <button onClick={setListView}>List View</button>
      <button onClick={setGridView}>Grid View</button>
      <div className={isGridView ? 'grid-container' : 'list-container'}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            className={isGridView ? 'grid-item' : 'list-item'}
          >
            <img src={photo.url} alt="Photo" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;