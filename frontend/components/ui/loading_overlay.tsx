import Lottie from "lottie-react";
import animationData from "../../public/animation.json";


export function LoadingOverlay() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-bold text-black dark:text-white">
      <div className="bg-white dark:bg-gray-800 p-28 rounded-lg shadow-lg flex flex-col items-center gap-4">
        <div className="w-96 h-96">
          <Lottie 
            animationData={animationData}
            {...defaultOptions}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <p className="text-lg text-center font-sans font-bold">Downloading your resume</p>
        <p className="text-sm text-center font-sans">Grasping for great oppurtunities ahead✨</p>
      </div>
    </div>
  )
}