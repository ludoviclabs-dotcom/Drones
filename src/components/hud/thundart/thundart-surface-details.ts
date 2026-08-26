import * as THREE from "three";

const CAB_NODE = "THD_Cab";
const CANISTER_NODE = "THD_Canister_08";
const PROJECTILE_NODE = "THD_Rocket_Demo";

type DetailKit = {
  dispose: () => void;
};

type LabelPalette = {
  ink: string;
  muted: string;
  accent: string;
};

const PALETTE: LabelPalette = {
  ink: "#e8e2cf",
  muted: "#a9a18d",
  accent: "#c86c3d",
};

function labelTexture(
  width: number,
  height: number,
  draw: (context: CanvasRenderingContext2D) => void,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D indisponible pour les détails Thundart");

  context.clearRect(0, 0, width, height);
  draw(context);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function technicalLabel(
  eyebrow: string,
  title: string,
  suffix: string,
): THREE.CanvasTexture {
  return labelTexture(768, 192, (context) => {
    context.textBaseline = "middle";
    context.fillStyle = PALETTE.accent;
    context.fillRect(12, 22, 8, 148);

    context.font = "600 30px ui-monospace, SFMono-Regular, Consolas, monospace";
    context.letterSpacing = "5px";
    context.fillStyle = PALETTE.muted;
    context.fillText(eyebrow, 48, 46);

    context.font = "700 62px ui-monospace, SFMono-Regular, Consolas, monospace";
    context.letterSpacing = "7px";
    context.fillStyle = PALETTE.ink;
    context.fillText(title, 46, 111);

    context.font = "500 24px ui-monospace, SFMono-Regular, Consolas, monospace";
    context.letterSpacing = "4px";
    context.fillStyle = PALETTE.muted;
    context.fillText(suffix, 48, 158);
  });
}

function cabSideTexture(): THREE.CanvasTexture {
  return labelTexture(768, 640, (context) => {
    context.strokeStyle = "rgba(225, 218, 196, 0.48)";
    context.lineWidth = 8;
    context.strokeRect(28, 26, 712, 586);

    context.strokeStyle = "rgba(28, 30, 27, 0.72)";
    context.lineWidth = 14;
    context.beginPath();
    context.moveTo(555, 100);
    context.lineTo(680, 100);
    context.stroke();

    context.fillStyle = "rgba(24, 26, 24, 0.78)";
    for (let row = 0; row < 6; row += 1) {
      context.fillRect(74, 386 + row * 24, 170, 8);
    }

    context.font = "700 38px ui-monospace, SFMono-Regular, Consolas, monospace";
    context.letterSpacing = "8px";
    context.fillStyle = "rgba(226, 218, 194, 0.74)";
    context.fillText("THD", 548, 536);
  });
}

function cabGrilleTexture(): THREE.CanvasTexture {
  return labelTexture(640, 288, (context) => {
    context.fillStyle = "rgba(19, 22, 21, 0.9)";
    context.fillRect(16, 16, 608, 256);
    context.strokeStyle = "rgba(166, 160, 143, 0.62)";
    context.lineWidth = 5;
    context.strokeRect(18, 18, 604, 252);

    context.strokeStyle = "rgba(129, 132, 123, 0.72)";
    context.lineWidth = 7;
    for (let row = 0; row < 7; row += 1) {
      context.beginPath();
      context.moveTo(42, 48 + row * 31);
      context.lineTo(598, 48 + row * 31);
      context.stroke();
    }

    context.fillStyle = "rgba(218, 211, 190, 0.92)";
    context.beginPath();
    context.arc(320, 144, 52, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "rgba(39, 43, 40, 0.96)";
    context.beginPath();
    context.arc(320, 144, 36, 0, Math.PI * 2);
    context.fill();
    context.font = "700 28px ui-monospace, SFMono-Regular, Consolas, monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = PALETTE.ink;
    context.fillText("THD", 320, 146);
  });
}

function detailMaterial(texture: THREE.Texture): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: texture,
    emissiveMap: texture,
    emissive: "#ffffff",
    emissiveIntensity: 0.2,
    transparent: true,
    alphaTest: 0.08,
    color: "#ffffff",
    roughness: 0.86,
    metalness: 0.02,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    side: THREE.DoubleSide,
  });
}

function addDetailPlane(
  host: THREE.Object3D,
  name: string,
  size: readonly [number, number],
  position: readonly [number, number, number],
  rotation: readonly [number, number, number],
  material: THREE.Material,
): THREE.Mesh {
  const detail = new THREE.Mesh(new THREE.PlaneGeometry(...size), material);
  detail.name = name;
  detail.position.set(...position);
  detail.rotation.set(...rotation);
  detail.renderOrder = 2;
  detail.castShadow = false;
  detail.receiveShadow = false;
  detail.raycast = () => undefined;
  host.add(detail);
  return detail;
}

/**
 * Ajoute des détails de surface sobres aux trois zones indiquées, sans modifier
 * le GLB ni sa hiérarchie. Chaque plan reste enfant de la pièce qu'il habille :
 * les marquages suivent donc naturellement l'élévation et la séparation.
 */
export function attachThundartSurfaceDetails(model: THREE.Object3D): DetailKit {
  const projectile = model.getObjectByName(PROJECTILE_NODE);
  const canister = model.getObjectByName(CANISTER_NODE);
  const cab = model.getObjectByName(CAB_NODE);
  const textures: THREE.Texture[] = [];
  const materials: THREE.Material[] = [];
  const meshes: THREE.Mesh[] = [];

  if (projectile) {
    const texture = technicalLabel("MBDA · SAFRAN", "THUNDART", "DEMONSTRATION");
    const material = detailMaterial(texture);
    textures.push(texture);
    materials.push(material);
    meshes.push(
      addDetailPlane(
        projectile,
        "THD_UI_Detail_ProjectileMarking",
        [2.28, 0.31],
        [0.188, 0, 0.18],
        [0, Math.PI / 2, 0],
        material,
      ),
    );
  }

  if (canister) {
    const texture = technicalLabel("MBDA · SAFRAN", "THUNDART", "CONTAINER 01");
    const material = detailMaterial(texture);
    textures.push(texture);
    materials.push(material);
    meshes.push(
      addDetailPlane(
        canister,
        "THD_UI_Detail_CanisterMarking",
        [2.42, 0.31],
        [0.304, 0, 0.24],
        [0, Math.PI / 2, 0],
        material,
      ),
    );
  }

  if (cab) {
    const sideTexture = cabSideTexture();
    const sideMaterial = detailMaterial(sideTexture);
    const grilleTexture = cabGrilleTexture();
    const grilleMaterial = detailMaterial(grilleTexture);
    textures.push(sideTexture, grilleTexture);
    materials.push(sideMaterial, grilleMaterial);
    meshes.push(
      addDetailPlane(
        cab,
        "THD_UI_Detail_CabDoor",
        [1.72, 1.38],
        [1.224, 1.06, 0.18],
        [0, Math.PI / 2, 0],
        sideMaterial,
      ),
      addDetailPlane(
        cab,
        "THD_UI_Detail_CabGrille",
        [1.44, 0.62],
        [0, 0.67, -1.226],
        [0, Math.PI, 0],
        grilleMaterial,
      ),
    );
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
