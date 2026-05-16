import {
  Box2,
  BoxGeometry,
  BufferGeometry,
  FrontSide,
  Line,
  LineBasicMaterial,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  SphereGeometry,
  Vector2,
  Vector3,
} from "three"

export class Render {
  static createPlane(box: Box2, material: Material, z: number) {
    const size = new Vector2()
    box.getSize(size)
    const center = new Vector2()
    box.getCenter(center)
    const geometry = new PlaneGeometry(size.x, size.y)
    const plane = new Mesh(geometry, material)
    plane.position.set(center.x, center.y, z)
    return plane
  }

  static createBox(size: Vector3, material: Material) {
    const geometry = new BoxGeometry(size.x, size.y, size.z)
    const box = new Mesh(geometry, material)
    return box
  }

  static createMaterial(color: string, opacity?: number) {
    return new MeshStandardMaterial({
      color,
      side: FrontSide,
      opacity: opacity ?? 1.0,
      transparent: opacity !== undefined,
    })
  }

  static createPath(path: Vector3[], color: number): Line {
    const material = new LineBasicMaterial({ color })
    const geometry = new BufferGeometry().setFromPoints(path)
    const line = new Line(geometry, material)
    return line
  }

  static createPath2D(path: Vector2[], z: number, color: number): Object3D {
    const path3 = path.map((pos) => new Vector3(pos.x, pos.y, z))
    const pathMesh = Render.createPath(path3, color)

    return pathMesh
  }

  static createSphere(
    center: Vector2,
    z: number,
    radius: number,
    material: Material
  ) {
    const geometry = new SphereGeometry(radius)
    const sphere = new Mesh(geometry, material)
    sphere.position.set(center.x, center.y, z)
    return sphere
  }
}
