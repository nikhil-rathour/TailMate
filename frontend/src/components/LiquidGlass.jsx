import { useEffect, useRef } from 'react';

const LiquidGlass = ({ width = 300, height = 200 }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    const canvas = canvasRef.current;
    
    if (!container || !svg || !canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    const id = 'liquid-glass-' + Math.random().toString(36).substr(2, 9);
    
    // Setup SVG filter
    const filter = svg.querySelector('filter');
    const feImage = svg.querySelector('feImage');
    const feDisplacementMap = svg.querySelector('feDisplacementMap');
    
    filter.setAttribute('id', `${id}_filter`);
    feImage.setAttribute('id', `${id}_map`);
    feDisplacementMap.setAttribute('in2', `${id}_map`);
    
    container.style.backdropFilter = `url(#${id}_filter) blur(0.25px) contrast(1.2) brightness(1.05) saturate(1.1)`;

    // Utility functions
    const smoothStep = (a, b, t) => {
      t = Math.max(0, Math.min(1, (t - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };

    const length = (x, y) => Math.sqrt(x * x + y * y);

    const roundedRectSDF = (x, y, w, h, radius) => {
      const qx = Math.abs(x) - w + radius;
      const qy = Math.abs(y) - h + radius;
      return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius;
    };

    const updateShader = () => {
      const w = width;
      const h = height;
      const data = new Uint8ClampedArray(w * h * 4);
      let maxScale = 0;
      const rawValues = [];

      for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % w;
        const y = Math.floor(i / 4 / w);
        const uv = { x: x / w, y: y / h };
        
        const ix = uv.x - 0.5;
        const iy = uv.y - 0.5;
        const distanceToEdge = roundedRectSDF(ix, iy, 0.3, 0.2, 0.6);
        const displacement = smoothStep(0.8, 0, distanceToEdge - 0.15);
        const scaled = smoothStep(0, 1, displacement);
        
        const dx = (ix * scaled + 0.5) * w - x;
        const dy = (iy * scaled + 0.5) * h - y;
        
        maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
        rawValues.push(dx, dy);
      }

      maxScale *= 0.5;
      let index = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = rawValues[index++] / maxScale + 0.5;
        const g = rawValues[index++] / maxScale + 0.5;
        data[i] = r * 255;
        data[i + 1] = g * 255;
        data[i + 2] = 0;
        data[i + 3] = 255;
      }

      ctx.putImageData(new ImageData(data, w, h), 0, 0);
      feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', canvas.toDataURL());
      feDisplacementMap.setAttribute('scale', maxScale.toString());
    };

    // Event handlers
    const handleMouseMove = (e) => {
      // Move glass to follow cursor
      const x = e.clientX - width / 2;
      const y = e.clientY - height / 2;
      
      container.style.left = `${x}px`;
      container.style.top = `${y}px`;
      container.style.transform = 'none';
      
      // Update shader
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height;
      updateShader();
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);

    // Initial render
    updateShader();

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [width, height]);

  return (
    <>
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        width="0"
        height="0"
        style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9998 }}
      >
        <defs>
          <filter filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB" x="0" y="0" width={width} height={height}>
            <feImage width={width} height={height} />
            <feDisplacementMap in="SourceGraphic" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${width}px`,
          height: `${height}px`,
          overflow: 'hidden',
          borderRadius: '150px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25), 0 -10px 25px inset rgba(0, 0, 0, 0.15)',
          cursor: 'none',
          zIndex: 9999,
          pointerEvents: 'none'
        }}
      />
      
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </>
  );
};

export default LiquidGlass;