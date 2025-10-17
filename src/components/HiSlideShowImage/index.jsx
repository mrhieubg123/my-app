import React, { useState, useEffect, useRef } from "react";
import { Box, Button } from "@mui/material";
import { useTheme } from '@mui/material/styles';

import img1 from "./components/image/img1.jpg";
import img2 from "./components/image/img2.jpg";
import img3 from "./components/image/img3.jpg";
import img4 from "./components/image/img4.jpg";
import img5 from "./components/image/img5.jpg";

import img12 from "./components/image2/img1.jpg";
import img22 from "./components/image2/img2.jpg";
import img32 from "./components/image2/img3.jpg";
import img42 from "./components/image2/img4.jpg";
import img52 from "./components/image2/img5.jpg";

import "./components/style.css";



  const HiSlideShow = () => {
    const theme = useTheme();

    const theme2 = localStorage.getItem('theme');
    const [activeSlide, setActiveSlide] = useState(0);
    const carouselRef = useRef(null);
    const timeoutRef = useRef(null);
    const autoNextRef = useRef(null);
  
    // them hang so thowif gian
    const TIME_RUNNING = 2000;
    const TIME_AUTO_NEXT = 10000;


    const slides = [
        { img: theme2 === 'dark' ? img1 : img12, title: "SOLDER PASTE  ", topic: "KITTING", author: "HARMONY", description: "The solder paste inventory monitoring system is designed to continuously track solder paste levels in the production warehouse. It aids in timely error detection, ensures stable supply efficiency ..." },
        { img: theme2 === 'dark' ? img2 : img22, title: "MACHINE STATUS", topic: "SMT", author: "HARMONY", description: "The machine condition monitoring system is designed for continuous oversight, enabling early detection of errors as they arise and ensuring consistent operational efficiency of equipment throughout the production process..." },
        { img: theme2 === 'dark' ? img3 : img32, title: "ESD SYSTEM    ", topic: "MPE", author: "HARMONY", description: "The ESD equipment monitoring system is designed to continuously track the status of electrostatic discharge protection devices during production. It enables early error detection, ensures stable operational efficiency..." },
        { img: theme2 === 'dark' ? img4 : img42, title: "REFLOW MACHINE", topic: "SMT", author: "HARMONY", description: "The solder furnace temperature monitoring system tracks real-time temperature, ensuring weld quality, optimizing processes, and detecting issues early..." },
        { img: theme2 === 'dark' ? img5 : img52, title: "SPI & AOI SYSTEM", topic: "SMT", author: "HARMONY", description: "The AOI (Automated Optical Inspection) and SPI (Solder Paste Inspection) monitoring system is designed to continuously oversee the inspection processes in electronics manufacturing. It enables timely error detection..." },
      ];
  
      const showSlider = (type, targetIndex = null) => {
        const sliderDom = carouselRef.current.querySelector('.carousel .list');
        const thumbnailDom = carouselRef.current.querySelector('.carousel .thumbnail');
        const sliderItems = sliderDom.querySelectorAll('.item');
        const thumbnailItems = thumbnailDom.querySelectorAll('.item');
    
        clearInterval(autoNextRef.current);
    
        if (type === 'next') {
          sliderDom.appendChild(sliderItems[0]);
          thumbnailDom.appendChild(thumbnailItems[0]);
          carouselRef.current.classList.add('next');
          setActiveSlide((prev) => (prev + 1) % slides.length);
        } else if (type === 'prev') {
          sliderDom.prepend(sliderItems[sliderItems.length - 1]);
          thumbnailDom.prepend(thumbnailItems[thumbnailItems.length - 1]);
          carouselRef.current.classList.add('prev');
          setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
        } else if (type === 'thumbnail' && targetIndex !== null) {
          // Thumbnail index 0 là slide tiếp theo, nên cần điều chỉnh
          const nextIndex = (activeSlide + 1) % slides.length;
          if (targetIndex === nextIndex) return;
    
          const steps = targetIndex > activeSlide 
            ? targetIndex - activeSlide 
            : slides.length - activeSlide + targetIndex;
    
          for (let i = 0; i < steps; i++) {
            sliderDom.appendChild(sliderItems[0]);
            thumbnailDom.appendChild(thumbnailItems[0]);
          }
          carouselRef.current.classList.add('next');
          setActiveSlide(targetIndex);
        }
    
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          carouselRef.current.classList.remove('next');
          carouselRef.current.classList.remove('prev');
        }, TIME_RUNNING);
    
        autoNextRef.current = setInterval(() => {
          showSlider('next');
        }, TIME_AUTO_NEXT);
      };
    
      const handleThumbnailClick = (index) => {
        // Vì thumbnail[0] là slide tiếp theo, nên index đã đúng với slide đích
        showSlider('thumbnail', index);
      };
    
      // Hàm để lấy danh sách thumbnail bắt đầu từ slide tiếp theo
      const getThumbnailOrder = () => {
        const nextIndex = (activeSlide + 1) % slides.length;
        const thumbnailOrder = [];
        for (let i = 0; i < slides.length; i++) {
          const index = (nextIndex + i) % slides.length;
          thumbnailOrder.push(slides[index]);
        }
        return thumbnailOrder;
      };
    
      useEffect(() => {
        autoNextRef.current = setInterval(() => {
          showSlider('next');
        }, TIME_AUTO_NEXT);
    
        return () => {
          clearInterval(autoNextRef.current);
          clearTimeout(timeoutRef.current);
        };
      }, []);
    
      const thumbnailSlides = getThumbnailOrder();
    
      return (
        <div className="carousel" ref={carouselRef}>
          <div className="list ">
            {slides.map((slide, index) => (
              <div className="item filter" key={index}>
                <img src={slide.img} alt={slide.title}/>
                <div className="content">
                  <div className="author" style={{color: theme.palette.chart.color}}>{slide.author}</div>
                  <div className="title" style={{color: theme.palette.chart.color}}>{slide.title}</div>
                  <div className="topic">{slide.topic}</div>
                  <div className="des" style={{color: theme.palette.primary.conponent}}>{slide.description}</div>
                  <div className="buttons">
                    <button style={{backgroundColor: '#fff'}}>SEE MORE</button>
                    <button style={{borderColor:theme.palette.primary.conponent,   color: theme.palette.primary.conponent}}>SUBSCRIBE</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
    
          <div className="thumbnail">
            {thumbnailSlides.map((slide, index) => {
              const slideIndex = (activeSlide + 1 + index) % slides.length;
              return (
                <div 
                  className={`item ${slideIndex === activeSlide ? 'active' : ''}`} 
                  key={slideIndex}
                  onClick={() => handleThumbnailClick(slideIndex)}
                >
                  <img src={slide.img} alt={slide.title} />
                  <div className="content">
                    <div className="title" style={{color: "#f1683a" , fontWeight:'bold', textShadow:'3px 3px 6px rgba(0,0,0,0.6)' }}>{slide.title}</div>
                    {/* <div className="description">Description</div> */}
                  </div>
                </div>
              );
            })}
          </div>
    
          <div className="arrows">
            <button onClick={() => showSlider('prev')}>{'<'}</button>
            <button onClick={() => showSlider('next')}>{'>'}</button>
          </div>
    
          <div className="time"></div>
        </div>
      );
    };
  
  export default HiSlideShow;
  



