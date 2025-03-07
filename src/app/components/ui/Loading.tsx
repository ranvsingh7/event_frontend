import React from "react";

interface LoadingProps {
    loading:boolean
}
const Loading : React.FC<LoadingProps> = ({loading})=> {
    if(!loading) return;
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#141313a1] absolute top-0 left-0">
      <div className="flex space-x-6 rounded-xl">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-[#f96982] rounded-full"
            style={{
              animation: `grow-shrink 1.2s ease-in-out ${index * 0.2}s infinite`,
              width: "1.5rem",
              height: "1.5rem",
            }}
          ></div>
        ))}
      </div>

      <style jsx>{`
        @keyframes grow-shrink {
          0%, 100% {
            transform: scale(0.5);
          }
          50% {
            transform: scale(1.5);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;