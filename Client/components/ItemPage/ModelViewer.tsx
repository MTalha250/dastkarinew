import React, { useState, Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Stage, ContactShadows, AccumulativeShadows, RandomizedLight, Center } from '@react-three/drei';
import { MdClose } from 'react-icons/md';
import { TbView360, TbAugmentedReality } from 'react-icons/tb';
import Modal from 'react-modal';
import Script from 'next/script';

// Add type declaration for model-viewer element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          ar?: boolean | string;
          'ar-modes'?: string;
          'camera-controls'?: boolean | string;
          'auto-rotate'?: boolean | string;
          'ios-src'?: string;
          exposure?: string;
          'shadow-intensity'?: string;
          'environment-image'?: string;
          poster?: string;
          alt?: string;
        },
        HTMLElement
      >;
    }
  }
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    height: '90vh',
    padding: 0,
    border: 'none',
    background: 'transparent',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
  },
};

const colors = {
  primary: "#016994",
  secondary: "#8C0003",
  yellow: "#FFD504",
  offwhite: "#FFFFF1",
  green: "#2C4B52",
};

const Model = ({ url, selectedColor }: { url: string; selectedColor: string }) => {
  const { scene } = useGLTF(url);
  
  // Apply the selected color to all meshes in the scene
  scene.traverse((child: any) => {
    if (child.isMesh) {
      child.material.color.set(selectedColor);
    }
  });
  
  return <primitive object={scene} />;
};

interface ModelViewerProps {
  modelUrl: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors.primary);
  const [isRotating, setIsRotating] = useState(true);
  const modelRef = useRef<any>(null);

  if (!modelUrl) return null;

  return (
    <>
      <Script 
        type="module" 
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
      />
      
      <div className="flex gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="flex bg-[#2C1810] items-center gap-3 text-[#E8DED1] px-8 py-3 hover:bg-[#3C2815] transition-all duration-300 font-playfair relative group overflow-hidden"
        >
          <div className="absolute inset-0 border border-[#DEB887] opacity-30"></div>
          <div className="absolute inset-[1px] border border-[#DEB887] opacity-20"></div>
          <TbView360 size={20} className="text-[#DEB887]" />
          <span className="tracking-wider">Behold Craftsmanship</span>
        </button>

        <model-viewer
          ref={(ref) => {
            modelRef.current = ref;
          }}
          src={modelUrl}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          exposure="0.8"
          shadow-intensity="1"
          environment-image="neutral"
          style={{ width: '0', height: '0', position: 'absolute' }}
          alt="3D model"
        />

        <button
          onClick={() => {
            if (modelRef.current) {
              modelRef.current.activateAR();
            }
          }}
          className="flex bg-[#2C1810] items-center gap-3 text-[#E8DED1] px-8 py-3 hover:bg-[#3C2815] transition-all duration-300 font-playfair relative group overflow-hidden"
        >
          <div className="absolute inset-0 border border-[#DEB887] opacity-30"></div>
          <div className="absolute inset-[1px] border border-[#DEB887] opacity-20"></div>
          <TbAugmentedReality size={20} className="text-[#DEB887]" />
          <span className="tracking-wider">View in AR</span>
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        style={{
          content: {
            ...customStyles.content,
            background: 'transparent',
          },
          overlay: {
            backgroundColor: 'rgba(44, 24, 16, 0.95)',
            zIndex: 1000,
          },
        }}
        contentLabel="3D Model Viewer"
      >
        <div className="relative h-full w-full bg-gradient-to-b from-[#2C1810] to-[#3C2815] rounded-none overflow-hidden shadow-2xl border border-[#DEB887]">
          <div className="absolute inset-0 truck-art-pattern opacity-5"></div>
          
          <div className="absolute top-6 right-6 z-10 flex items-center gap-4">
            <button
              onClick={() => setIsOpen(false)}
              className="p-3 bg-[#DEB887]/10 backdrop-blur-sm rounded-none hover:bg-[#DEB887]/20 transition-all duration-300 group border border-[#DEB887]/30"
            >
              <MdClose size={24} className="text-[#DEB887]" />
            </button>
          </div>
          
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ preserveDrawingBuffer: true }}
          >
            <color attach="background" args={['#2C1810']} />
            <ambientLight intensity={0.6} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} />
            <Suspense fallback={null}>
              <Stage
                environment="sunset"
                intensity={0.5}
                adjustCamera={false}
              >
                <Center>
                  <Model url={modelUrl} selectedColor={selectedColor} />
                </Center>
              </Stage>
              <ContactShadows
                position={[0, -1.4, 0]}
                opacity={0.8}
                scale={10}
                blur={2}
                far={4}
              />
            </Suspense>
            <OrbitControls
              autoRotate={isRotating}
              autoRotateSpeed={1.5}
              enableZoom={true}
              enablePan={true}
              minPolarAngle={0}
              maxPolarAngle={Math.PI}
            />
            <Environment preset="sunset" />
          </Canvas>

          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
            <div className="flex gap-3 bg-[#DEB887]/5 backdrop-blur-sm p-4 border border-[#DEB887]/20">
              {Object.entries(colors).map(([name, color]) => (
                <button
                  key={name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 transition-all duration-300 relative group ${
                    selectedColor === color ? 'scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  title={name}
                >
                  <div className="absolute inset-0 border border-[#DEB887] opacity-30 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {selectedColor === color && (
                    <div className="absolute -inset-1 border-2 border-[#DEB887]"></div>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="bg-[#DEB887]/5 backdrop-blur-sm px-6 py-3 text-[#DEB887] font-playfair tracking-wider hover:bg-[#DEB887]/10 transition-all duration-300 border border-[#DEB887]/20"
            >
              {isRotating ? 'Pause Display' : 'Rotate Display'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModelViewer; 