import React from 'react';
import './SubmissionPopup.css'

import { FaCheckCircle } from 'react-icons/fa';
import { MdError } from 'react-icons/md';

function SubmissionPopup({ type, message, onClose }) {


    return (
        <div>
            {type && (
                <div className="submission-modal-content">
                    <FaCheckCircle color="green" size={90} />
                    Success
                    <div>{message}</div>
                    <button
                        className='submission-modal-button'
                        onClick={() => {
                            onClose(false);   // close popup
                            window.location.reload(); // reload page
                        }}
                    >
                        Continue
                    </button>
                </div>
            )}
            {/* {type && (
                <div className="submission-modal-content">
                    <MdError color="red" size={90} />
                    Error
                    <div>{message}</div>
                    <button onClick={()=> onClose(false)}>Try Again</button>
                </div>
            )} */}


        </div>
    );
}

export default SubmissionPopup;