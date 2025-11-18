import React from 'react'
import NavbarCom from "@/components/NavbarCom";
import PublicBlogDetailsCom from "@/components/PublicBlogDetailsCom";
import TopNavbarCom from "@/components/TopNavbarCom";
import FooterCom from "@/components/FooterCom";






const about = () => {
  return (
    <div>
      <TopNavbarCom/>
      <NavbarCom/>
      <PublicBlogDetailsCom/>
      <div className="mt-20">
        <FooterCom />
      </div>
    </div>
  )
}

export default about