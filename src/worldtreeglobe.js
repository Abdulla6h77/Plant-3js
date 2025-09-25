// WorldTreesGlobe.js
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const WorldTreesGlobe = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const globeRef = useRef(null);
  const frameIdRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState('Pakistan');
  const [treeData, setTreeData] = useState([]);

  // Expanded sample tree data with more countries
  const sampleTreeData = {
    Pakistan: [
      { name: 'Deodar Cedar', lat: 34.0151, lng: 71.5249, count: 1500, type: 'Coniferous' },
      { name: 'Sheesham', lat: 31.5204, lng: 74.3587, count: 2200, type: 'Deciduous' },
      { name: 'Neem', lat: 24.8607, lng: 67.0011, count: 1800, type: 'Evergreen' },
      { name: 'Banyan', lat: 33.6844, lng: 73.0479, count: 800, type: 'Tropical' },
    ],
    Brazil: [
      { name: 'Brazil Nut', lat: -3.4653, lng: -62.2159, count: 3500, type: 'Tropical' },
      { name: 'Mahogany', lat: -10.3333, lng: -53.2, count: 2100, type: 'Hardwood' },
      { name: 'Rubber Tree', lat: -2.5297, lng: -54.6816, count: 4200, type: 'Tropical' },
    ],
    Canada: [
      { name: 'Sugar Maple', lat: 45.4215, lng: -75.6972, count: 5500, type: 'Deciduous' },
      { name: 'White Pine', lat: 46.0, lng: -84.0, count: 8900, type: 'Coniferous' },
      { name: 'Black Spruce', lat: 60.0, lng: -110.0, count: 7200, type: 'Boreal' },
    ],
    'United States': [
      { name: 'Redwood', lat: 41.2132, lng: -124.0046, count: 2100, type: 'Giant' },
      { name: 'Oak', lat: 39.9526, lng: -75.1652, count: 4500, type: 'Deciduous' },
      { name: 'Pine', lat: 35.7796, lng: -78.6382, count: 6200, type: 'Coniferous' },
    ],
    China: [
      { name: 'Ginkgo', lat: 39.9042, lng: 116.4074, count: 3200, type: 'Ancient' },
      { name: 'Bamboo', lat: 30.5728, lng: 104.0668, count: 8900, type: 'Grass' },
      { name: 'Chinese Pine', lat: 35.0, lng: 105.0, count: 4500, type: 'Coniferous' },
    ],
    India: [
      { name: 'Banyan', lat: 19.0760, lng: 72.8777, count: 1800, type: 'Sacred' },
      { name: 'Neem', lat: 28.7041, lng: 77.1025, count: 2500, type: 'Medicinal' },
      { name: 'Teak', lat: 12.9716, lng: 77.5946, count: 3200, type: 'Hardwood' },
    ],
    Russia: [
      { name: 'Siberian Pine', lat: 60.0, lng: 90.0, count: 12000, type: 'Taiga' },
      { name: 'Birch', lat: 55.7558, lng: 37.6176, count: 8500, type: 'Deciduous' },
      { name: 'Larch', lat: 65.0, lng: 120.0, count: 9800, type: 'Coniferous' },
    ],
    Australia: [
      { name: 'Eucalyptus', lat: -33.8688, lng: 151.2093, count: 4200, type: 'Native' },
      { name: 'Acacia', lat: -25.2744, lng: 133.7751, count: 3500, type: 'Wattle' },
      { name: 'Banksia', lat: -31.9505, lng: 115.8605, count: 1800, type: 'Proteaceae' },
    ],
    'South Africa': [
      { name: 'Baobab', lat: -23.0, lng: 29.0, count: 850, type: 'Ancient' },
      { name: 'Yellowwood', lat: -29.8587, lng: 31.0218, count: 1200, type: 'Indigenous' },
      { name: 'Wild Fig', lat: -26.2041, lng: 28.0473, count: 950, type: 'Native' },
    ],
    Japan: [
      { name: 'Cherry Blossom', lat: 35.6762, lng: 139.6503, count: 2800, type: 'Ornamental' },
      { name: 'Japanese Cedar', lat: 36.2048, lng: 138.2529, count: 4200, type: 'Coniferous' },
      { name: 'Japanese Maple', lat: 34.6937, lng: 135.5023, count: 1800, type: 'Deciduous' },
    ]
  };

  const getTreeColor = (type) => {
    const colors = {
      'Coniferous': 0x0d5016,
      'Deciduous': 0x4a7c59,
      'Evergreen': 0x1e4d1e,
      'Tropical': 0x7cb342,
      'Hardwood': 0xa0522d,
      'Boreal': 0x2e5c3e,
      'Giant': 0x8b4513,
      'Ancient': 0x8d6e63,
      'Grass': 0x8bc34a,
      'Sacred': 0x689f38,
      'Medicinal': 0x558b2f,
      'Taiga': 0x1b5e20,
      'Native': 0x66bb6a,
      'Wattle': 0xfbc02d,
      'Proteaceae': 0xff7043,
      'Indigenous': 0x5d4037,
      'Ornamental': 0xe91e63,
    };
    return colors[type] || 0x4caf50;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Basic scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create globe with country outlines
    const globeGeometry = new THREE.SphereGeometry(1, 128, 64);
    
    // Create a canvas texture with country outlines
    const createCountryTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      // Ocean background
      ctx.fillStyle = '#1e40af';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Helper function to draw country shapes
      const drawCountry = (coordinates, name, color = '#22c55e') => {
        if (coordinates.length === 0) return;
        
        ctx.fillStyle = color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        coordinates.forEach((coord, index) => {
          const x = ((coord[0] + 180) / 360) * canvas.width;
          const y = ((90 - coord[1]) / 180) * canvas.height;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      };

      // Define simplified country coordinates (longitude, latitude)
      const countries = {
        // North America
        'United States': [
          [-158, 70], [-141, 70], [-87, 49], [-67, 45], [-67, 25], 
          [-97, 25], [-117, 32], [-125, 42], [-158, 70]
        ],
        'Canada': [
          [-141, 83], [-56, 83], [-56, 60], [-79, 62], [-95, 69], 
          [-110, 60], [-141, 60], [-141, 83]
        ],
        'Mexico': [
          [-117, 32], [-97, 25], [-87, 18], [-92, 14], [-109, 23], 
          [-117, 32]
        ],
        
        // South America
        'Brazil': [
          [-73, 5], [-35, 5], [-35, -20], [-55, -20], [-60, -30], 
          [-73, -18], [-73, 5]
        ],
        'Argentina': [
          [-73, -22], [-53, -22], [-53, -40], [-68, -55], [-73, -50], 
          [-73, -22]
        ],
        'Peru': [
          [-81, 0], [-68, -3], [-69, -18], [-76, -18], [-81, -8], 
          [-81, 0]
        ],
        'Colombia': [
          [-79, 12], [-66, 12], [-66, 1], [-79, -4], [-82, 8], 
          [-79, 12]
        ],
        
        // Europe
        'Russia': [
          [20, 77], [180, 77], [180, 50], [130, 42], [40, 42], 
          [20, 55], [20, 77]
        ],
        'Norway': [
          [4, 71], [31, 71], [31, 58], [4, 58], [4, 71]
        ],
        'Sweden': [
          [10, 69], [24, 69], [24, 55], [10, 55], [10, 69]
        ],
        'Finland': [
          [19, 70], [31, 70], [31, 59], [19, 59], [19, 70]
        ],
        'France': [
          [-5, 51], [8, 51], [8, 42], [-2, 42], [-5, 51]
        ],
        'Germany': [
          [5, 55], [15, 55], [15, 47], [5, 47], [5, 55]
        ],
        'Spain': [
          [-10, 44], [3, 44], [3, 36], [-10, 36], [-10, 44]
        ],
        'Italy': [
          [6, 47], [19, 47], [18, 36], [12, 36], [6, 47]
        ],
        'Poland': [
          [14, 55], [24, 55], [24, 49], [14, 49], [14, 55]
        ],
        'Ukraine': [
          [22, 52], [40, 52], [40, 45], [22, 45], [22, 52]
        ],
        'United Kingdom': [
          [-8, 61], [2, 61], [2, 50], [-8, 50], [-8, 61]
        ],
        
        // Asia
        'China': [
          [73, 53], [135, 53], [135, 18], [97, 18], [73, 35], [73, 53]
        ],
        'India': [
          [68, 37], [97, 37], [97, 6], [68, 6], [68, 37]
        ],
        'Pakistan': [
          [60, 37], [77, 37], [77, 23], [60, 23], [60, 37]
        ],
        'Iran': [
          [44, 40], [63, 40], [63, 25], [44, 25], [44, 40]
        ],
        'Mongolia': [
          [87, 52], [120, 52], [120, 41], [87, 41], [87, 52]
        ],
        'Kazakhstan': [
          [46, 56], [87, 56], [87, 40], [46, 40], [46, 56]
        ],
        'Japan': [
          [129, 46], [146, 46], [146, 30], [129, 30], [129, 46]
        ],
        'Indonesia': [
          [95, 6], [141, 6], [141, -11], [95, -11], [95, 6]
        ],
        'Thailand': [
          [97, 21], [106, 21], [106, 5], [97, 5], [97, 21]
        ],
        
        // Africa
        'Algeria': [
          [-8, 37], [12, 37], [12, 19], [-8, 19], [-8, 37]
        ],
        'Libya': [
          [9, 33], [25, 33], [25, 19], [9, 19], [9, 33]
        ],
        'Egypt': [
          [25, 32], [35, 32], [35, 22], [25, 22], [25, 32]
        ],
        'Sudan': [
          [21, 22], [39, 22], [39, 8], [21, 8], [21, 22]
        ],
        'Nigeria': [
          [2, 14], [15, 14], [15, 4], [2, 4], [2, 14]
        ],
        'Kenya': [
          [33, 5], [42, 5], [42, -5], [33, -5], [33, 5]
        ],
        'Tanzania': [
          [29, -1], [40, -1], [40, -12], [29, -12], [29, -1]
        ],
        'South Africa': [
          [16, -22], [33, -22], [33, -35], [16, -35], [16, -22]
        ],
        'Madagascar': [
          [43, -12], [50, -12], [50, -26], [43, -26], [43, -12]
        ],
        
        // Oceania
        'Australia': [
          [113, -10], [154, -10], [154, -44], [113, -44], [113, -10]
        ],
        'New Zealand': [
          [166, -34], [179, -34], [179, -47], [166, -47], [166, -34]
        ],
        
        // Additional countries
        'Turkey': [
          [25, 42], [45, 42], [45, 35], [25, 35], [25, 42]
        ],
        'Saudi Arabia': [
          [34, 32], [55, 32], [55, 16], [34, 16], [34, 32]
        ],
        'Afghanistan': [
          [60, 38], [75, 38], [75, 29], [60, 29], [60, 38]
        ],
        'Myanmar': [
          [92, 28], [101, 28], [101, 9], [92, 9], [92, 28]
        ],
        'Chile': [
          [-76, -17], [-66, -17], [-66, -56], [-76, -56], [-76, -17]
        ],
        'Venezuela': [
          [-73, 12], [-59, 12], [-59, 0], [-73, 0], [-73, 12]
        ],
        'Ethiopia': [
          [32, 15], [48, 15], [48, 3], [32, 3], [32, 15]
        ],
        'Democratic Republic of Congo': [
          [12, 5], [31, 5], [31, -13], [12, -13], [12, 5]
        ]
      };

      // Draw all countries
      Object.entries(countries).forEach(([name, coords]) => {
        // Color countries differently based on region
        let color = '#22c55e'; // Default green
        
        if (['United States', 'Canada', 'Mexico'].includes(name)) {
          color = '#3b82f6'; // Blue for North America
        } else if (['Brazil', 'Argentina', 'Peru', 'Colombia', 'Chile', 'Venezuela'].includes(name)) {
          color = '#10b981'; // Emerald for South America
        } else if (['Russia', 'Norway', 'Sweden', 'Finland', 'France', 'Germany', 'Spain', 'Italy', 'Poland', 'Ukraine', 'United Kingdom', 'Turkey'].includes(name)) {
          color = '#f59e0b'; // Amber for Europe
        } else if (['China', 'India', 'Pakistan', 'Iran', 'Mongolia', 'Kazakhstan', 'Japan', 'Indonesia', 'Thailand', 'Saudi Arabia', 'Afghanistan', 'Myanmar'].includes(name)) {
          color = '#ef4444'; // Red for Asia
        } else if (['Algeria', 'Libya', 'Egypt', 'Sudan', 'Nigeria', 'Kenya', 'Tanzania', 'South Africa', 'Madagascar', 'Ethiopia', 'Democratic Republic of Congo'].includes(name)) {
          color = '#8b5cf6'; // Purple for Africa
        } else if (['Australia', 'New Zealand'].includes(name)) {
          color = '#ec4899'; // Pink for Oceania
        }
        
        drawCountry(coords, name, color);
      });

      return new THREE.CanvasTexture(canvas);
    };

    const globeMaterial = new THREE.MeshBasicMaterial({ 
      map: createCountryTexture(),
      transparent: false
    });
    
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    globeRef.current = globe;
    scene.add(globe);

    // Add country boundary lines
    const boundaryGeometry = new THREE.SphereGeometry(1.001, 128, 64);
    const boundaryMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    });
    const boundaries = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
    scene.add(boundaries);

    // Basic lighting
    const light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    // Simple rotation
    let rotationX = 0;
    let rotationY = 0;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let isMouseDown = false;

    const handleMouseDown = () => { isMouseDown = true; };
    const handleMouseUp = () => { isMouseDown = false; };
    
    const handleMouseMove = (event) => {
      if (!mountRef.current) return;
      
      const rect = mountRef.current.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      if (isMouseDown) {
        rotationX = mouseY * 0.5;
        rotationY += mouseX * 0.01;
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      if (globe) {
        globe.rotation.x = rotationX;
        globe.rotation.y = rotationY;
        
        // Auto rotation when not interacting
        if (!isMouseDown) {
          rotationY += 0.005;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (mountRef.current && rendererRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Add tree markers
  useEffect(() => {
    if (!sceneRef.current || !selectedCountry) return;

    // Remove existing markers
    const existingMarkers = sceneRef.current.children.filter(child => child.userData?.isTreeMarker);
    existingMarkers.forEach(marker => {
      sceneRef.current.remove(marker);
    });

    const trees = sampleTreeData[selectedCountry] || [];
    setTreeData(trees);

    trees.forEach(tree => {
      // Convert lat/lng to 3D coordinates
      const phi = (90 - tree.lat) * (Math.PI / 180);
      const theta = (tree.lng + 180) * (Math.PI / 180);
      const radius = 1.02;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      // Simple tree marker
      const markerGeometry = new THREE.SphereGeometry(0.02, 8, 8);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: getTreeColor(tree.type)
      });
      
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, y, z);
      marker.userData = { isTreeMarker: true, treeData: tree };
      
      sceneRef.current.add(marker);
    });
  }, [selectedCountry]);

  const getTreeTypeStats = () => {
    const stats = {};
    treeData.forEach(tree => {
      stats[tree.type] = (stats[tree.type] || 0) + tree.count;
    });
    return stats;
  };

  const totalTrees = treeData.reduce((sum, tree) => sum + tree.count, 0);
  const typeStats = getTreeTypeStats();

  return (
    <div className="globe-container">
      <div className="globe-layout">
        {/* Globe Container */}
        <div className="globe-display">
          <div 
            ref={mountRef} 
            className="globe-canvas"
          />
          
          {/* Controls */}
          <div className="globe-controls">
            <h2 className="globe-title">World Trees Globe</h2>
            <div className="control-group">
              <label className="control-label">Select Region:</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="control-select"
              >
                {Object.keys(sampleTreeData).map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Data Panel */}
        <div className="data-panel">
          <h3 className="data-title">{selectedCountry} Tree Data</h3>
          
          <div className="data-summary">
            <p>Total Trees: <span className="tree-count">{totalTrees.toLocaleString()}</span></p>
            <p>Locations: {treeData.length}</p>
          </div>

          <div>
            <h4 className="tree-locations-title">Tree Locations</h4>
            <div className="tree-locations-container">
              {treeData.map((tree, index) => (
                <div key={index} className="tree-location-card">
                  <div className="tree-name">{tree.name}</div>
                  <div className="tree-details">
                    <p>Count: <span className="tree-count">{tree.count.toLocaleString()}</span></p>
                    <p>Type: {tree.type}</p>
                    <p>Location: {tree.lat.toFixed(2)}°, {tree.lng.toFixed(2)}°</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldTreesGlobe;