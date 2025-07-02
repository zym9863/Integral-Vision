import * as THREE from 'three';
import { FunctionParser } from './FunctionParser';

export class IntegralVisualizer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: any; // OrbitControls will be imported dynamically
  
  private functionMesh: THREE.Mesh | null = null;
  private domainMesh: THREE.Mesh | null = null;
  private riemannBoxes: THREE.Group | null = null;
  
  private currentFunction: string = 'x*x + y*y';
  private currentDomain: string = 'x*x + y*y <= 1';
  private subdivisions: number = 10;
  private showRiemann: boolean = false;

  constructor(container: HTMLElement) {
    // 初始化场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);

    // 初始化相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(5, 5, 5);

    // 初始化渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 初始化控制器
    this.initControls();

    // 添加光照
    this.setupLighting();

    // 添加坐标轴
    this.addAxes();

    // 处理窗口大小变化
    window.addEventListener('resize', () => this.onWindowResize(container));

    // 开始渲染循环
    this.animate();
  }

  private async initControls() {
    // 动态导入 OrbitControls
    const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
  }

  private setupLighting() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    // 方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // 点光源
    const pointLight = new THREE.PointLight(0x64ffda, 0.5);
    pointLight.position.set(-5, 5, -5);
    this.scene.add(pointLight);
  }

  private addAxes() {
    const axesHelper = new THREE.AxesHelper(3);
    this.scene.add(axesHelper);

    // 添加网格
    const gridHelper = new THREE.GridHelper(6, 20, 0x444444, 0x222222);
    this.scene.add(gridHelper);
  }

  private onWindowResize(container: HTMLElement) {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    
    if (this.controls) {
      this.controls.update();
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * 更新函数和积分域
   */
  public updateVisualization(functionExpr: string, domainExpr: string, subdivisions: number) {
    this.currentFunction = functionExpr;
    this.currentDomain = domainExpr;
    this.subdivisions = subdivisions;

    // 清除旧的网格
    this.clearMeshes();

    // 创建新的可视化
    this.createFunctionSurface();
    this.createDomainVisualization();
    
    if (this.showRiemann) {
      this.createRiemannSum();
    }
  }

  /**
   * 切换黎曼和显示
   */
  public toggleRiemannSum(): boolean {
    this.showRiemann = !this.showRiemann;
    
    if (this.showRiemann) {
      this.createRiemannSum();
    } else {
      this.clearRiemannBoxes();
    }
    
    return this.showRiemann;
  }

  /**
   * 计算积分近似值
   */
  public calculateIntegralApproximation(): number {
    const bounds = FunctionParser.getDomainBounds(this.currentDomain);
    const dx = (bounds.maxX - bounds.minX) / this.subdivisions;
    const dy = (bounds.maxY - bounds.minY) / this.subdivisions;
    
    let sum = 0;
    let validBoxes = 0;

    for (let i = 0; i < this.subdivisions; i++) {
      for (let j = 0; j < this.subdivisions; j++) {
        const x = bounds.minX + (i + 0.5) * dx;
        const y = bounds.minY + (j + 0.5) * dy;
        
        if (FunctionParser.isInDomain(this.currentDomain, x, y)) {
          const height = FunctionParser.evaluateFunction(this.currentFunction, x, y);
          if (height >= 0) { // 只计算正值部分
            sum += height * dx * dy;
            validBoxes++;
          }
        }
      }
    }

    return sum;
  }

  private clearMeshes() {
    if (this.functionMesh) {
      this.scene.remove(this.functionMesh);
      this.functionMesh = null;
    }
    
    if (this.domainMesh) {
      this.scene.remove(this.domainMesh);
      this.domainMesh = null;
    }
    
    this.clearRiemannBoxes();
  }

  private clearRiemannBoxes() {
    if (this.riemannBoxes) {
      this.scene.remove(this.riemannBoxes);
      this.riemannBoxes = null;
    }
  }

  private createFunctionSurface() {
    const bounds = FunctionParser.getDomainBounds(this.currentDomain);
    const resolution = 60;

    // 创建自定义几何体
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];
    const colors: number[] = [];

    const dx = (bounds.maxX - bounds.minX) / resolution;
    const dy = (bounds.maxY - bounds.minY) / resolution;

    // 生成顶点
    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const x = bounds.minX + i * dx;
        const y = bounds.minY + j * dy;

        let z = 0;
        let alpha = 0.1; // 默认透明度很低

        if (FunctionParser.isInDomain(this.currentDomain, x, y)) {
          z = FunctionParser.evaluateFunction(this.currentFunction, x, y);
          alpha = 1.0; // 在域内的点完全不透明
        }

        vertices.push(x, z, y); // 注意Three.js的坐标系

        // 根据高度设置颜色
        const normalizedHeight = Math.max(0, Math.min(1, (z + 2) / 4));
        colors.push(
          0.4 + normalizedHeight * 0.6, // R
          1.0 - normalizedHeight * 0.4, // G
          1.0 - normalizedHeight * 0.6, // B
          alpha // A
        );
      }
    }

    // 生成索引
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const a = i * (resolution + 1) + j;
        const b = a + 1;
        const c = (i + 1) * (resolution + 1) + j;
        const d = c + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4));
    geometry.computeVertexNormals();

    const material = new THREE.MeshLambertMaterial({
      vertexColors: true,
      transparent: true,
      side: THREE.DoubleSide
    });

    this.functionMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.functionMesh);
  }

  private createDomainVisualization() {
    const bounds = FunctionParser.getDomainBounds(this.currentDomain);
    const resolution = 40;

    // 创建域的几何体
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];

    const dx = (bounds.maxX - bounds.minX) / resolution;
    const dy = (bounds.maxY - bounds.minY) / resolution;

    // 生成域内的顶点
    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const x = bounds.minX + i * dx;
        const y = bounds.minY + j * dy;

        if (FunctionParser.isInDomain(this.currentDomain, x, y)) {
          vertices.push(x, 0.01, y); // 稍微抬高避免z-fighting
        } else {
          vertices.push(x, -10, y); // 域外的点放到很低的位置
        }
      }
    }

    // 生成索引
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const a = i * (resolution + 1) + j;
        const b = a + 1;
        const c = (i + 1) * (resolution + 1) + j;
        const d = c + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshBasicMaterial({
      color: 0xff6b6b,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });

    this.domainMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.domainMesh);
  }

  private createRiemannSum() {
    this.clearRiemannBoxes();
    
    this.riemannBoxes = new THREE.Group();
    
    const bounds = FunctionParser.getDomainBounds(this.currentDomain);
    const dx = (bounds.maxX - bounds.minX) / this.subdivisions;
    const dy = (bounds.maxY - bounds.minY) / this.subdivisions;

    for (let i = 0; i < this.subdivisions; i++) {
      for (let j = 0; j < this.subdivisions; j++) {
        const x = bounds.minX + (i + 0.5) * dx;
        const y = bounds.minY + (j + 0.5) * dy;
        
        if (FunctionParser.isInDomain(this.currentDomain, x, y)) {
          const height = Math.max(0, FunctionParser.evaluateFunction(this.currentFunction, x, y));
          
          if (height > 0.01) { // 只显示有意义高度的盒子
            const geometry = new THREE.BoxGeometry(dx * 0.9, height, dy * 0.9);
            const material = new THREE.MeshLambertMaterial({
              color: new THREE.Color().setHSL((height / 5) * 0.3, 0.8, 0.6),
              transparent: true,
              opacity: 0.7
            });
            
            const box = new THREE.Mesh(geometry, material);
            box.position.set(x, height / 2, y);
            this.riemannBoxes.add(box);
          }
        }
      }
    }

    this.scene.add(this.riemannBoxes);
  }
}
