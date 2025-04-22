
// Import React and the useState hook from the React library
// useState allows components to have state variables, though it's not used in this component
import React, { useState } from "react";

// Import the Link component from react-router-dom
// Link is used for navigation between pages without full page reloads
import { Link } from "react-router-dom";

// Import a custom context hook that likely provides game state and functions
// This import isn't actually used in the component
import { useFreeplayContext } from "../context/FreeplayContext";

// Define the Modal component that accepts four props:
// - showModal: boolean that controls visibility of the modal
// - closeModal: function to close the modal (not currently used)
// - title: string to display in the modal header
// - message: content to display in the modal body
const Modal = ({ showModal, closeModal, title, message }) => {
  return (
    // Main modal container div with conditional classes
    <div
      // Apply Bootstrap modal classes and conditionally add "show" class when showModal is true
      className={`modal fade ${showModal ? "show" : ""}`}
      // Set the modal ID for potential Bootstrap JavaScript interactions
      id="staticBackdrop"
      // Configure modal to not close when clicking outside (static backdrop)
      data-bs-backdrop="static"
      // Disable closing modal with keyboard
      data-bs-keyboard="false"
      // Set tabIndex for keyboard navigation
      tabIndex="-1"
      // Set aria-labelledby for accessibility, pointing to the title element
      aria-labelledby="staticBackdropLabel"
      // Set aria-hidden attribute based on showModal for accessibility
      aria-hidden={!showModal}
      // Inline style to control display property based on showModal
      style={{ display: showModal ? "block" : "none" }}
    >
      {/* Modal dialog container that centers the modal vertically */}
      <div className="modal-dialog modal-dialog-centered">
        {/* Modal content container */}
        <div className="modal-content">
          {/* Modal header section */}
          <div className="modal-header">
            {/* Modal title that displays the title prop */}
            <h5 className="modal-title" id="staticBackdropLabel">
              {title}
            </h5>
          </div>
          {/* Modal body section that displays the message prop */}
          <div className="modal-body">{message}</div>
          {/* Modal footer section containing action buttons */}
          <div className="modal-footer">
            {/* Link to navigate to the home page */}
            <Link to="/">
              {/* Home button */}
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                // onClick handler is commented out, not currently used
                // onClick={closeModal}
              >
                Home
              </button>
            </Link>
            {/* Link to navigate to the game page */}
            <Link to="/game">
              {/* Play Again button */}
              <button type="button" className="btn btn-primary">
                Play Again
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the Modal component so it can be imported and used in other files
export default Modal;













// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useFreeplayContext } from "../context/FreeplayContext";

// const Modal = ({ showModal, closeModal, title, message }) => {
//   return (
//     <div
//       className={`modal fade ${showModal ? "show" : ""}`}
//       id="staticBackdrop"
//       data-bs-backdrop="static"
//       data-bs-keyboard="false"
//       tabIndex="-1"
//       aria-labelledby="staticBackdropLabel"
//       aria-hidden={!showModal}
//       style={{ display: showModal ? "block" : "none" }}
//     >
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title" id="staticBackdropLabel">
//               {title}
//             </h5>
//           </div>
//           <div className="modal-body">{message}</div>
//           <div className="modal-footer">
//             <Link to="/">
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 data-bs-dismiss="modal"
//                 // onClick={closeModal}
//               >
//                 Home
//               </button>
//             </Link>
//             <Link to="/game">
//               <button type="button" className="btn btn-primary">
//                 Play Again
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;



