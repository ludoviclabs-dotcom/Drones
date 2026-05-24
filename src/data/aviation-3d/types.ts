export type Point3D = [number, number, number];
export type Segment3D = [Point3D, Point3D];

export interface Wireframe3DSpec {
  bounds: Point3D;
  segments: Segment3D[];
}
