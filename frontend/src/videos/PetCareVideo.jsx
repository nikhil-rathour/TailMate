
const PetCareVideo = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden  bg-cover bg-center opacity-50 z-0">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source
          src="https://storage.googleapis.com/tailmate_cloud/petcarevideofps.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Content Overlay */}
    
    </div>
  );

};

export default PetCareVideo
