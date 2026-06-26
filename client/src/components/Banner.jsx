
import React, { useState } from 'react'
import { bannerStyles,customStyles } from '../assets/dummyStyles'
import { features, floatingIcons } from '../assets/dummyBanner'
import { CircleCheckBig, Sparkles , X } from 'lucide-react'
import bannerImg from '../assets/Bannerimage.jpg';
import bannerVideo from '../assets/BannerVideo.mp4';


function Banner() {
    const [ShowVideo,setShowVideo] = useState(false) 
  return (
    <div className={bannerStyles.container}>
        
      {/* Floating Icons Wrapper */}
      <div className={bannerStyles.floatingIconsWrapper}>
        {floatingIcons.map((icon, i) => (
          <img
            key={i}
            src={icon.src}
            alt={icon.alt || ""}
            className={`${bannerStyles.floatingIcon} ${icon.pos}`}
            style={{
              animationDelay: `${i * 0.35}s`,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>
      <div className={bannerStyles.mainContent}>
        <div className={bannerStyles.grid}>
            <div className={bannerStyles.leftContent}>
                <span className={bannerStyles.badge}>
                    <Sparkles className={bannerStyles.badgeIcon}/>
                    New Features Available
                </span>
                <h1 className={bannerStyles.heading}>
                    <span className={bannerStyles.headingSpan1}>Build Amazing</span>
                    <span className={bannerStyles.headingSpan2}>Digital Product</span>
                </h1>
                <p className={bannerStyles.description}>
                   Learning Management System: A responsive web platform for managing online courses, user authentication, student enrollment, and progress tracking with role-based access for learners and instructors.
                </p>
                <div className={bannerStyles.featuresGrid}>
  {features.map((feature, i) => (
    <div key={i} className={bannerStyles.featureItem}>
      <div className={bannerStyles.featureIconContainer}>
        <span className={`${bannerStyles.featureIcon} ${feature.color}`}>
          <CircleCheckBig size={16} />
        </span>
      </div>
      <span className={bannerStyles.featureText}>
        {feature.text}
      </span>
    </div>
  ))}
</div>
                <div className={bannerStyles.buttonsContainer}>
                    <a href="/Courses" className={bannerStyles.buttonGetStarted}>
                    Get Started</a>
                    <button onClick={()=>setShowVideo(true)} className={bannerStyles.buttonViewDemo}>View Demo</button>
                </div>
            </div>
            <div className={bannerStyles.imageContainer}>
                <img src={bannerImg} alt="Banner Image" className={bannerStyles.image} />
            </div>
        </div>
      </div>
      {/* video modal */}
{ShowVideo && (
  <div className={bannerStyles.videoModal.overlay}>
    <div className={bannerStyles.videoModal.container}>
      <iframe
        src={bannerVideo}
        className={bannerStyles.videoModal.iframe}
        title="Demo Video"
        allow="autoplay; encrypted-media"
      ></iframe>
      <button onClick={()=>{setShowVideo(false)}} className={bannerStyles.videoModal.closeButton}>
        <span> <X className={bannerStyles.videoModal.closeIcon} /></span>
      </button>
    </div>
  </div>
)}
<style jsx>{customStyles}</style>
{/* Inline Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
export default Banner

// import React, { useState } from 'react'
// import { features, floatingIcons } from '../assets/dummyBanner'
// import { CircleCheckBig, Sparkles , X } from 'lucide-react'
// import bannerImg from '../assets/Bannerimage.jpg';
// import bannerVideo from '../assets/BannerVideo.mp4';

// function Banner() {
//   const [showVideo,setShowVideo] = useState(false)

//   return (
//     <div style={{position:"relative",overflow:"hidden"}}>

//       {/* Floating Icons */}
//       <div>
//         {floatingIcons.map((icon, i) => (
//           <img
//             key={i}
//             src={icon.src}
//             alt=""
//             style={{
//               position:"absolute",
//               width:"40px",
//               animation:`float 6s ease-in-out infinite`,
//               animationDelay:`${i*0.3}s`
//             }}
//           />
//         ))}
//       </div>

//       <div style={{padding:"60px 8%", position:"relative", zIndex:2}}>
//         <div style={{
//           display:"grid",
//           gridTemplateColumns:"1fr 1fr",
//           gap:"40px",
//           alignItems:"center"
//         }}>

//           {/* Left Content */}
//           <div>
//             <span style={{
//               display:"inline-flex",
//               alignItems:"center",
//               gap:"6px",
//               background:"#e0e7ff",
//               color:"#3730a3",
//               padding:"6px 12px",
//               borderRadius:"20px",
//               fontSize:"14px",
//               fontWeight:"600"
//             }}>
//               <Sparkles size={16}/> New Features Available
//             </span>

//             <h1 style={{
//               fontSize:"44px",
//               fontWeight:"800",
//               margin:"20px 0",
//               color:"#111827",
//               lineHeight:"1.2"
//             }}>
//               <span style={{display:"block"}}>Build Amazing</span>
//               <span style={{display:"block", color:"#2563eb"}}>Digital Product</span>
//             </h1>

//             <p style={{
//               fontSize:"16px",
//               color:"#4b5563",
//               marginBottom:"24px"
//             }}>
//               Learning Management System: A responsive web platform for managing online courses, user authentication, student enrollment, and progress tracking.
//             </p>

//             {/* Features */}
//             <div style={{
//               display:"grid",
//               gridTemplateColumns:"1fr 1fr",
//               gap:"12px",
//               marginBottom:"28px"
//             }}>
//               {features.map((feature, i) => (
//                 <div key={i} style={{
//                   display:"flex",
//                   alignItems:"center",
//                   gap:"10px",
//                   background:"#ffffff",
//                   padding:"10px 14px",
//                   borderRadius:"10px",
//                   boxShadow:"0 2px 8px rgba(0,0,0,0.08)"
//                 }}>
//                   <span style={{
//                     background:"#22c55e",
//                     color:"#fff",
//                     padding:"6px",
//                     borderRadius:"50%",
//                     display:"flex",
//                     alignItems:"center",
//                     justifyContent:"center"
//                   }}>
//                     <CircleCheckBig size={14}/>
//                   </span>
//                   <span style={{
//                     fontSize:"14px",
//                     fontWeight:"600",
//                     color:"#1f2937"
//                   }}>
//                     {feature.text}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* Buttons */}
//             <div style={{display:"flex", gap:"16px"}}>
//               <a href="/Courses" style={{
//                 background:"#2563eb",
//                 color:"#fff",
//                 padding:"12px 22px",
//                 borderRadius:"8px",
//                 textDecoration:"none",
//                 fontWeight:"600",
//                 boxShadow:"0 4px 14px rgba(37,99,235,0.35)"
//               }}>
//                 Get Started
//               </a>

//               <button
//                 onClick={()=>setShowVideo(true)}
//                 style={{
//                   background:"#f97316",
//                   color:"#fff",
//                   padding:"12px 22px",
//                   borderRadius:"8px",
//                   border:"none",
//                   fontWeight:"600",
//                   cursor:"pointer",
//                   boxShadow:"0 4px 14px rgba(249,115,22,0.35)"
//                 }}>
//                 View Demo
//               </button>
//             </div>
//           </div>

//           {/* Right Image */}
//           <div>
//             <img src={bannerImg} alt="Banner" style={{
//               width:"100%",
//               borderRadius:"20px",
//               boxShadow:"0 10px 30px rgba(0,0,0,0.15)"
//             }}/>
//           </div>
//         </div>
//       </div>

//       {/* Video Modal */}
//       {showVideo && (
//         <div style={{
//           position:"fixed",
//           inset:0,
//           background:"rgba(0,0,0,0.6)",
//           display:"flex",
//           justifyContent:"center",
//           alignItems:"center",
//           zIndex:999
//         }}>
//           <div style={{
//             position:"relative",
//             width:"70%",
//             background:"#000",
//             borderRadius:"12px",
//             overflow:"hidden"
//           }}>
//             <video src={bannerVideo} controls autoPlay style={{width:"100%"}}/>
//             <button
//               onClick={()=>setShowVideo(false)}
//               style={{
//                 position:"absolute",
//                 top:"10px",
//                 right:"10px",
//                 background:"#fff",
//                 border:"none",
//                 borderRadius:"50%",
//                 padding:"6px",
//                 cursor:"pointer"
//               }}>
//               <X size={22}/>
//             </button>
//           </div>
//         </div>
//       )}

//     </div>
//   )
// }

// export default Banner