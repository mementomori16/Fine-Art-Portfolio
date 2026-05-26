'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import './welcomeHero2.scss';

const DESKTOP_SLIDES = [
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613747/1ph2026-16-9500kb_gkepnb.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613728/IMG_7653ph26-500kb_dn9hk7.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779620844/ph2026kineret-2-500kb_qzscpo.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779697676/DSC_0973ph2026-4-500kb_b42u5g.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613732/IMG_8469ph2026-500kb_fipv2h.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613764/IMG_4691-ph2026-500kb_ep3ujr.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779703943/IMGP0914ph2026-500kb_eaxsbn.jpg',
];

const MOBILE_SLIDES = [
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779702849/ph2026edgein-500kb_cdva8b.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779702842/IMG_4906_photoshoped_2026-2_-500kb_dgqsps.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613701/IMG_4550ph26-500kb_lqn3zn.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613730/photoshoped-more_bright-500kb_pcyurk.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613743/Detail1-photoshoped_2026500b_yjbmfc.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613731/varnished-and-photoshoped-small-2-500kb_jgndqr.jpg',
];

const DISPLACEMENT_MAP_URL = 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop';
const AUDIO_SRC = 'https://res.cloudinary.com/dpayqcrg5/video/upload/v1779620423/Music_Eduard_Sasolov_sun5js.mp4';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D texture1;
  uniform sampler2D texture2;
  uniform sampler2D displacementMap;
  uniform float progress;
  uniform vec2 intensity;

  void main() {
    vec2 uv = vUv;
    vec4 disp = texture2D(displacementMap, uv);
    
    vec2 distortedPosition1 = vec2(uv.x + progress * (disp.r * intensity.x), uv.y + progress * (disp.g * intensity.y));
    vec2 distortedPosition2 = vec2(uv.x - (1.0 - progress) * (disp.r * intensity.x), uv.y - (1.0 - progress) * (disp.g * intensity.y));
    
    vec4 _texture1 = texture2D(texture1, distortedPosition1);
    vec4 _texture2 = texture2D(texture2, distortedPosition2);
    
    gl_FragColor = mix(_texture1, _texture2, progress);
  }
`;

interface WelcomeHero2Props {
  onArrowClick?: () => void;
}

export default function WelcomeHero2({ onArrowClick }: WelcomeHero2Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const stateRef = useRef({
    currentIndex: 0,
    textures: [] as THREE.Texture[],
    material: null as THREE.ShaderMaterial | null,
    mesh: null as THREE.Mesh | null,
    isTransitioning: false,
    activeSlidesList: [] as string[],
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const isMobileDevice = window.innerWidth <= 768;
    const selectedSlides = isMobileDevice ? MOBILE_SLIDES : DESKTOP_SLIDES;
    stateRef.current.activeSlidesList = selectedSlides;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const dispTexture = textureLoader.load(DISPLACEMENT_MAP_URL);
    dispTexture.wrapS = dispTexture.wrapT = THREE.RepeatWrapping;

    let loadedCount = 0;
    const loadedTextures = selectedSlides.map((url) => {
      return textureLoader.load(url, () => {
        loadedCount++;
        if (loadedCount === selectedSlides.length) {
          setIsLoading(false);
          handleResize();
        }
      });
    });
    stateRef.current.textures = loadedTextures;

    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        texture1: { value: loadedTextures[0] },
        texture2: { value: loadedTextures[1] || loadedTextures[0] },
        displacementMap: { value: dispTexture },
        progress: { value: 0 },
        intensity: { value: new THREE.Vector2(0.03, 0.03) },
      },
    });
    stateRef.current.material = shaderMaterial;

    const geometry = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geometry, shaderMaterial);
    scene.add(mesh);
    stateRef.current.mesh = mesh;

    let animationId: number;
    const animate = () => {
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const slideDuration = 6000;
    const triggerNextSlide = () => {
      if (stateRef.current.isTransitioning || loadedCount < selectedSlides.length) return;
      stateRef.current.isTransitioning = true;

      const currentIdx = stateRef.current.currentIndex;
      const nextIdx = (currentIdx + 1) % loadedTextures.length;

      shaderMaterial.uniforms.texture1.value = loadedTextures[currentIdx];
      shaderMaterial.uniforms.texture2.value = loadedTextures[nextIdx];
      shaderMaterial.uniforms.progress.value = 0;

      handleResizeForIndex(nextIdx);

      gsap.to(shaderMaterial.uniforms.progress, {
        value: 1,
        duration: 1.8,
        ease: 'power2.inOut',
        onComplete: () => {
          stateRef.current.currentIndex = nextIdx;
          stateRef.current.isTransitioning = false;
        },
      });
    };

    const intervalId = setInterval(triggerNextSlide, slideDuration);

    const handleResizeForIndex = (index: number) => {
      const currentTex = loadedTextures[index];
      if (!currentTex || !currentTex.image || !mesh) return;

      const w = container.clientWidth;
      const h = container.clientHeight;

      renderer.setSize(w, h);
      camera.left = w / -2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = h / -2;
      camera.updateProjectionMatrix();

      const imageRatio = currentTex.image.width / currentTex.image.height;
      const containerRatio = w / h;

      let renderW = w;
      let renderH = h;

      if (containerRatio > imageRatio) {
        renderW = w;
        renderH = w / imageRatio;
      } else {
        renderW = h * imageRatio;
        renderH = h;
      }

      mesh.scale.set(renderW, renderH, 1);
    };

    const handleResize = () => {
      handleResizeForIndex(stateRef.current.currentIndex);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      shaderMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.play().then(() => {
        audioRef.current!.muted = false;
        setIsMuted(false);
      });
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <section className="heroSectionWebGL" ref={containerRef}>
      <audio ref={audioRef} src={AUDIO_SRC} loop muted />
      
      {isLoading && (
        <div className="webglPreloader">
          <div className="spinner" />
        </div>
      )}

      {/* RESTORED: Original Moving Light System and Dark Fog Layers */}
      <div className="lightOverlay" />

      {/* RESTORED: Original Emoji Music Toggle Button Interface */}
      <button onClick={toggleSound} className="audioButton">
        {isMuted ? '🔇' : '🔊'}
      </button>

      {onArrowClick && (
        <button onClick={onArrowClick} className="scrollArrow" aria-label="Scroll Down">
          ↓
        </button>
      )}
    </section>
  );
}