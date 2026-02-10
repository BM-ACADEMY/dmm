import React from 'react';
import GalleryHighlights from '../Pages/Gallery';
import BlogHome from '../Pages/Blog'; // ✅ Import Blog

// ✅ Import the new button
import GrievanceButton from '../Pages/GrievanceButton';

const Home = () => {
  return (
    <div className="w-full font-sans relative">

      {/* 2. Gallery Highlights Section (Limit 4) */}
      <GalleryHighlights limit={4} />

      {/* 3. Blog Section (Limit 4) */}

      {/* 4. Sticky Grievances Button */}
      {/* This sits on top of everything because of z-index in the component */}
      <GrievanceButton />

    </div>
  );
};

export default Home;
