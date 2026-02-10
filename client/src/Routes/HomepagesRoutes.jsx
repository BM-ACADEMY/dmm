// src/Routes/HomepagesRoutes.jsx
import React from "react";
import Home from "../Modules/Homepages/Pages/Home";
import Banner from "../Modules/Homepages/Layout/Banner";
import BlogHome from "../Modules/Homepages/Pages/Blog";
import Hero from "../Modules/Homepages/Pages/Hero";
import SocialMediaLinks from "../Modules/Homepages/Pages/SocialMediaLinks";
import LicenseDownload from "../Modules/Homepages/Pages/LicenseDownload"; // ✅ Add this import
import Bar from "../Modules/Homepages/Pages/Bar";
import StatsSection from "../Modules/Homepages/Pages/StatsSection";
import PutsfSection from "../Modules/Homepages/Pages/PutsfSection";

const HomepagesRoutes = () => {
  return (
    <>
      <Banner />
      {/* <Bar /> */}
      <Hero />
      <PutsfSection />
      <BlogHome limit={4}/>
      <StatsSection />
      <SocialMediaLinks />
      <Home />
      <LicenseDownload />
    </>
  );
};

export default HomepagesRoutes;
