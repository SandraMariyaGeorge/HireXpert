import React from 'react';
import Lottie from 'lottie-react';

interface AlertCompProps {
  svg: any; // Updated to accept Lottie animation data
  message: string; // Message to display
  buttonText: string; // Text for the button
  onButtonClick: () => void; // Callback for button click
}

const AlertComp: React.FC<AlertCompProps> = ({ svg, message, buttonText, onButtonClick }) => {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      };
  return (
    <div className="alert-container">
      <div className="alert-content">
        <div className="w-96 h-96">
          <Lottie 
            animationData={svg} // Pass animation data directly
            {...defaultOptions}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="alert-message">{message}</div>
        <button className="alert-button" onClick={onButtonClick}>
          {buttonText}
        </button>
      </div>
      <style jsx>{`
        .alert-container {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.7);
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1000;
          animation: fadeIn 0.3s ease-in-out;
        }
        .alert-content {
          background: linear-gradient(135deg, #ffffff, #f8f9fa);
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          max-width: 450px;
          width: 90%;
          animation: slideUp 0.4s ease-in-out;
        }
        .alert-message {
          font-size: 18px;
          color: #444;
          margin-bottom: 25px;
          font-weight: 500;
        }
        .alert-button {
          background: linear-gradient(90deg,rgb(8, 11, 15),rgb(0, 2, 5));
          color: white;
          border: none;
          border-radius: 25px;
          padding: 12px 30px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .alert-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AlertComp;
