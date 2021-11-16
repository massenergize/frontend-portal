// import React, {useState, useRef} from 'react';
// import { Link } from 'react-router-dom'
// import { connect } from 'react-redux'
// import Tooltip from './../HomePage/TourTooltip'
// // import TourText from './../HomePage/TourText'
// import TourExit from './../HomePage/TourExit'
// import Joyride from "react-joyride"



// const TourHome = ({name, communityData, community, links}) => {
//   console.log('CommunityName:', name)
//   console.log('CommunityName:', communityData)
//   console.log('community:', community)
//   console.log('linkToAction:', links.actions)



//     const [isTourOpen, setIsTourOpen] = useState(true);
//     const tourSteps = [
//       {
//         target: "#welcome",
//         content: (
//             <>
//               <strong> 
//               Welcome to {name} 
//               </strong>{" "}
//               <br/>
//               We’re very happy you are here <span aria-label="smile" role="img">&#128516;</span>!{" "}
//               This is where neighbors who are motivated to do something about climate change (like you!) meet each other and share their experiences. 
//               <br/>
//               Take this <strong>tour</strong> to learn how this website helps us save our planet{" "}<span aria-label="planet" role="img">&#127758;</span>
//               <button onClick={() => setIsTourOpen()}>
//               <TourExit/>
//               </button>
//               </>
//         ),
//         disableBeacon: true,
//       },
//       {
//         target: '.panel', 
//         content: (
//           <>
//               <strong> 
//               Take action 
//               </strong>{" "}
//               <br/>
//               No action is too small to start fighting climate change, and many of them can save you money too. Set a goal, find help, and track your progress.
//               <button onClick={() => setIsTourOpen()}>
//               <TourExit/>
//               </button>
//               </>
//         ),
//       }, 
//       {
//         target: '#nav-bar', 
//         content: (
//           <> 
//               <strong> 
//               Fulfill your curiosity
//               </strong>{" "}
//               <br/>
//               Are you interested in energy efficiency, emergency weather preparation, or something else? Join a webinar or watch past recordings. 
//               {/* <button onClick={() => setIsTourOpen()}>
//               <TourExit/>
//               </button> */}
//           </>
//         ),
//       }, 
//       {
//         target: '#nav-bar', 
//         content: (
//           <>
//           <> 
//               <strong> 
//               Get inspired 
//               </strong>{" "}
//               <br/>
//               Read stories from your neighbors. See what they've done to protect the planet, who helped them, and how they are feeling about it. You can share your own testimonies too!
//               <Link style={{
//                 color: "white", 
//                 border: "1px solid #f7f7f7",
//                 background: "#F47B35",
//                 padding: ".3em .7em",
//                 fontSize: "inherit",
//                 display: "block",
//                 textAlign: "center",
//                 cursor: "pointer",
//                 margin: "1em auto", 
//                 borderRadius: "20px"
//               }} to={links.testimonials}>Take me there</Link>
//           </>
//           <button onClick={() => setIsTourOpen()}>
//               <TourExit/>
//               </button>
//           </>
//         ),
//       },
//       {
//         target: '#nav-bar', 
//         content: (
//           <> 
//               <strong> 
//               Sign up 
//               </strong>{" "}
//               <br/>
//               Unlock more features and customize your experience by signing up. This also makes your local community stronger and help us reach more people.
//               <button onClick={() => setIsTourOpen()}>
//               <TourExit/>
//               </button>
//           </>
//         ),
//       },
//       {
//         target: '#nav-bar', 
//         content: (
//           <> 
//             <strong> 
//             Know your impact
//             </strong>{" "}
//             <br/>
//             Discover how much CO2 you've helped reduce so far. 
//             <br/>
//             Mark the actions you've <span style={{color: 'white', fontSize: "0.8rem", backgroundColor: "gray", borderRadius: "20px", padding: "5px"}}>Done</span>{" "} and select the actions you'd like to set as your <span style={{color: 'white', fontSize: "0.8rem", backgroundColor: "gray", borderRadius: "20px", padding: "5px"}}>To Do</span>
//             <Link style={{
//                 color: "white", 
//                 border: "1px solid #f7f7f7",
//                 background: "#F47B35",
//                 padding: ".3em",
//                 fontSize: "inherit",
//                 display: "block",
//                 textAlign: "center",
//                 cursor: "pointer",
//                 margin: "1em auto", 
//                 borderRadius: "20px"
//               }} to={links.actions}>Take me there</Link>
              
//           </>
//         ),
//       },
//         // ...
//     ];
//     return (
//         <Joyride 
//         run={true}
//       callback={() => null}
//         steps={[
//           {
//             content:
//               "Double click or press enter on this cell to open the DropDownEditor",
//             target: ".react-grid-Cell:last-child"
//           }
//         ]}
//         />
//     )
// }

// export default TourHome;






