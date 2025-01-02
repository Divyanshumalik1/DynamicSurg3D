import React, { useEffect, useState} from 'react';
import * as THREE from 'three';
import './Input.css';

const PointCloud = ({ points, pointSize }) => {
    const geometry = new THREE.BufferGeometry();
    const positions = points.flatMap(p => [p.x, p.y, p.z]);
    const colors = points.flatMap(p => p.color ? [p.color.r / 255, p.color.g / 255, p.color.b / 255] : [1, 1, 1]);
  
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  
    return (
      <points rotation={[0, 0, Math.PI]}>
        <bufferGeometry attach="geometry" {...geometry} />
        <pointsMaterial attach="material" vertexColors size={pointSize} />
      </points>
    );
  };

export default PointCloud

