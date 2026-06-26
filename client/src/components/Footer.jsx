/* eslint-disable no-unused-vars */
import React from "react";
import { footerStyles, footerBackgroundStyles, contactIconGradients, iconColors, footerCustomStyles } from "../assets/dummyStyles";
import {socialIcons} from '../assets/dummyFooter'

const Footer = () => {
  return (
    <footer className="mt-20 bg-gray-900 text-white py-8">

      <div className="text-center">
        <h2 className="text-xl font-bold">SkillForge</h2>

        <p className="mt-2 text-gray-400">
          Build your skills with modern courses.
        </p>

        <p className="mt-4 text-gray-500 text-sm">
          © 2026 SkillForge. All rights reserved.
        </p>
      </div>

    </footer>
  );
};

export default Footer;