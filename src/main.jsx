import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css'
import App from './App.jsx'

import gsap from 'gsap';

// Import all your plugins
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';
import  { Draggable, Flip } from 'gsap/all';
import MorphSVGPlugin from 'gsap/MorphSVGPlugin';
import CustomEase from 'gsap/CustomEase';

// Register ALL plugins once
gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  Draggable,
  DrawSVGPlugin,
  Flip,
  MorphSVGPlugin,
  CustomEase
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
