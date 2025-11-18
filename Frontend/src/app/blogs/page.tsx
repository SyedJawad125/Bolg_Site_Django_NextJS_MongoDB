import React from 'react'
import NavbarCom from "@/components/NavbarCom";
import PublicBlogsCom from "@/components/PublicBlogsCom";
import TopNavbarCom from "@/components/TopNavbarCom";
import FooterCom from "@/components/FooterCom";






const about = () => {
  return (
    <div>
      <TopNavbarCom/>
      <NavbarCom/>
      <PublicBlogsCom/>
      <div className="mt-20">
        <FooterCom />
      </div>
    </div>
  )
}

export default about