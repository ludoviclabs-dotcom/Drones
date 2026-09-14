import * as THREE from "three";
import { PATRIOT_ASSET_MANIFEST } from "@/data/hud/patriot";

/**
 * Détails de surface de la planche Patriot, dessinés en Canvas 2D au montage
 * (aucun fichier téléchargé) :
 *
 * - face du réseau radar : grille illustrative d'éléments, appliquée aux
 *   matériaux `PAT_MAT_ArrayFace` (le GLB porte des UV planaires sur ces
 *   disques) — aucune caractéristique électromagnétique n'en est déduite ;
 * - numéros des conteneurs de tir (03, 04), posés sur leur opercule avant :
 *   ils disparaissent avec lui à la mise à feu.
 */

type DetailKit = { dispose: () => void };

function canvasTexture(
  width: number,
  height: number,
  draw: (context: CanvasRenderingContext2D) => void,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D indisponible pour les détails Patriot");
  draw(context);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function arrayFaceTexture(): THREE.CanvasTexture {
  return canvasTexture(512, 512, (ctx) => {
    ctx.fillStyle = "#4d563b";
    ctx.fillRect(0, 0, 512, 512);
    // Grille hexagonale d'éléments (motif illustratif, non dimensionné).
    const step = 13;
    for (let row = 0; row * step * 0.866 < 540; row += 1) {
      const y = row * step * 0.866;
      const shift = row % 2 ? step / 2 : 0;
      for (let x = -step; x < 530; x += step) {
        ctx.fillStyle = "#2c3222";
        ctx.beginPath();
        ctx.arc(x + shift, y, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(170, 176, 150, 0.35)";
        ctx.beginPath();
        ctx.arc(x + shift - 0.8, y - 0.8, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Couronne d'assemblage : le disque est vu comme un réseau de panneaux.
    ctx.strokeStyle = "rgba(30, 34, 24, 0.55)";
    ctx.lineWidth = 3;
    for (const r of [120, 200]) {
      ctx.beginPath();
      ctx.arc(256, 256, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let k = 0; k < 8; k += 1) {
      const a = (k / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(256 + Math.cos(a) * 60, 256 + Math.sin(a) * 60);
      ctx.lineTo(256 + Math.cos(a) * 254, 256 + Math.sin(a) * 254);
      ctx.stroke();
    }
  });
}

function numberTexture(label: string): THREE.CanvasTexture {
  return canvasTexture(256, 256, (ctx) => {
    ctx.clearRect(0, 0, 256, 256);
    ctx.fillStyle = "rgba(20, 20, 16, 0.86)";
    ctx.font = "700 118px ui-monospace, SFMono-Regular, Consolas, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 128, 118);
    ctx.font = "600 30px ui-monospace, SFMono-Regular, Consolas, monospace";
    ctx.fillText("PAC-3 MSE", 128, 204);
  });
}

function decalMaterial(texture: THREE.Texture): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.05,
    roughness: 0.9,
    metalness: 0,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
  });
}

/**
 * À appeler sur le clone du modèle, AVANT d'enregistrer les couleurs de base
 * de l'inspection : les matériaux concernés sont déjà des clones par mesh.
 */
export function attachPatriotSurfaceDetails(model: THREE.Object3D): DetailKit {
  const textures: THREE.Texture[] = [];
  const materials: THREE.Material[] = [];
  const meshes: THREE.Mesh[] = [];

  const face = arrayFaceTexture();
  textures.push(face);
  model.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const list = Array.isArray(child.material) ? child.material : [child.material];
    for (const material of list) {
      if (material instanceof THREE.MeshStandardMaterial && material.name === "PAT_MAT_ArrayFace") {
        material.map = face;
        material.color.set("#ffffff");
        material.needsUpdate = true;
      }
    }
  });

  const manifest = PATRIOT_ASSET_MANIFEST;
  for (const [slot, covers] of Object.entries(manifest.coverNodes)) {
    const cover = model.getObjectByName(covers.front);
    if (!cover) continue;
    const label = slot === "A" ? "04" : "03";
    const texture = numberTexture(label);
    const material = decalMaterial(texture);
    textures.push(texture);
    materials.push(material);
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), material);
    plane.name = `PAT_UI_Detail_CanisterNumber_${label}`;
    // Face avant de l'opercule : axe du conteneur sur -Z local (conversion Y-up).
    plane.position.set(0, 0, -(manifest.canisterLength - 0.066));
    plane.rotation.set(0, Math.PI, 0);
    plane.renderOrder = 2;
    plane.raycast = () => undefined;
    cover.add(plane);
    meshes.push(plane);
  }

  return {
    dispose: () => {
      for (const mesh of meshes) {
        mesh.parent?.remove(mesh);
        mesh.geometry.dispose();
      }
      for (const material of materials) material.dispose();
      for (const texture of textures) texture.dispose();
    },
  };
}
