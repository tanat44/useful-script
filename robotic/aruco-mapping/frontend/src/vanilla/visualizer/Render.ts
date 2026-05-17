import {
  Box2,
  BoxGeometry,
  BufferGeometry,
  FrontSide,
  GridHelper,
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
  /**
   * MATERIAL
   */
  static cacheMaterial: Map<string, Material> = new Map()
  static createMaterial(color: string, opacity?: number) {
    const material = new MeshStandardMaterial({
      color,
      side: FrontSide,
      opacity: opacity ?? 1.0,
      transparent: opacity !== undefined,
    })
    Render.cacheMaterial.set(color, material)

    return material
  }

  static getMaterial(color: string): Material {
    if (!Render.cacheMaterial.has(color)) return Render.createMaterial(color)
    return Render.cacheMaterial.get(color)!
  }

  /**
   * LINE
   */

  static createPath(path: Vector3[], color: string): Line {
    const material = new LineBasicMaterial({ color })
    const geometry = new BufferGeometry().setFromPoints(path)
    const line = new Line(geometry, material)
    return line
  }

  static createPath2D(path: Vector2[], z: number, color: string): Object3D {
    const path3 = path.map((pos) => new Vector3(pos.x, pos.y, z))
    const pathMesh = Render.createPath(path3, color)

    return pathMesh
  }

  /**
   * 3D OBJECTS
   */

  static createPlane(box: Box2, color: string, z: number) {
    const size = new Vector2()
    box.getSize(size)
    const center = new Vector2()
    box.getCenter(center)
    const geometry = new PlaneGeometry(size.x, size.y)
    const plane = new Mesh(geometry, Render.getMaterial(color))
    plane.position.set(center.x, center.y, z)
    return plane
  }

  static createBox(size: Vector3, color: string) {
    const geometry = new BoxGeometry(size.x, size.y, size.z)
    const box = new Mesh(geometry, Render.getMaterial(color))
    return box
  }

  static createSphere(pos: Vector3, radius: number, color: string) {
    const geometry = new SphereGeometry(radius)
    const sphere = new Mesh(geometry, Render.getMaterial(color)!)
    sphere.position.set(pos.x, pos.y, pos.z)
    return sphere
  }

  static gridHelper() {
    const size = 10
    const divisions = 10
    const object = new GridHelper(size, divisions, 0xc0c0c0, 0xc0c0c0)
    object.rotateX(Math.PI / 2)

    return object
  }
}
