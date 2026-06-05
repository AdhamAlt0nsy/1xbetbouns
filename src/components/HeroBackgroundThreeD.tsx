import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const heroBackgroundImages = [
  '/gift-box.jpg',
  '/gift-box-2.jpg',
  '/gift-box-3.jpg',
  '/gift-box-4.jpg',
  '/gift-box-5.jpg',
  '/gift-box-6.jpg',
  '/gift-box-7.jpg',
  '/gift-box-8.jpg',
  '/cards-fan.jpg',
  '/poker-chips.jpg',
  '/abstract-bg.jpg',
  '/screenshot-mockup.jpg',
];

export default function HeroBackgroundThreeD() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0B0E1A);
    scene.fog = new THREE.Fog(0x0B0E1A, 10, 25);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const carouselGroup = new THREE.Group();
    scene.add(carouselGroup);

    const imageUrls = heroBackgroundImages;
    const numCards = 12;
    const radius = 7;
    const cardWidth = 2.2;
    const cardHeight = 3;
    const textureLoader = new THREE.TextureLoader();

    for (let i = 0; i < numCards; i++) {
      const angle = (i / numCards) * Math.PI * 2;
      const url = imageUrls[i % imageUrls.length];
      const texture = textureLoader.load(url);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
      });
      const geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
      const card = new THREE.Mesh(geometry, material);
      card.userData = { angle, index: i };
      carouselGroup.add(card);
    }

    const mouse = new THREE.Vector2();
    const targetRotation = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    let time = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      time += clock.getDelta();

      const baseRotY = time * 0.1;
      const baseRotX = Math.sin(time * 0.05) * 0.1;
      const parallaxX = mouse.y * 0.1;
      const parallaxY = -mouse.x * 0.1;

      targetRotation.x = baseRotX + parallaxX;
      targetRotation.y = baseRotY + parallaxY;

      carouselGroup.rotation.x +=
        (targetRotation.x - carouselGroup.rotation.x) * 0.05;
      carouselGroup.rotation.y +=
        (targetRotation.y - carouselGroup.rotation.y) * 0.05;

      for (const card of carouselGroup.children) {
        const data = card.userData;
        card.position.x =
          Math.cos(data.angle + time * 0.15 + carouselGroup.rotation.y) * radius;
        card.position.y =
          Math.sin(data.angle + time * 0.15 + carouselGroup.rotation.y) * radius;
        card.rotation.z =
          data.angle + time * 0.15 + carouselGroup.rotation.y;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        background: '#0B0E1A',
      }}
    />
  );
}
