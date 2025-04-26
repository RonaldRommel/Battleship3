import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFreeplayContext } from "../context/FreeplayContext";
const Modal = ({ showModal, closeModal, title, message }) => {
  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden={!showModal}
      style={{ display: showModal ? "block" : "none" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <button
            type="button"
            className="btn-close me-auto"
            aria-label="Close"
            onClick={closeModal}
            style={{ marginRight: "auto" }}
          ></button>
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              {title}
            </h5>
          </div>
          <div className="modal-body">{message}</div>
          <div className="modal-footer">
            <Link to="/">
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
            <Link to="/game">
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
