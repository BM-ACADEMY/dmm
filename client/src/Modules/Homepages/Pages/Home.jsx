import React from 'react';
import GalleryHighlights from '../Pages/Gallery';

// ✅ Import the new button
import GrievanceButton from '../Pages/GrievanceButton';

const Home = () => {
  return (
    <div className="w-full font-sans relative">

      {/* 2. Gallery Highlights Section */}
      <GalleryHighlights />

      {/* 3. Sticky Grievances Button */}
      {/* This sits on top of everything because of z-index in the component */}
      <GrievanceButton />

    </div>
  );
};

export default Home;
