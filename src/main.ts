import './style.css';
import { IntegralVisualizer } from './IntegralVisualizer';
import { examples } from './examples';
import { runTests } from './test';

class IntegralVisionApp {
  private visualizer!: IntegralVisualizer;
  private exampleSelect!: HTMLSelectElement;
  private functionInput!: HTMLInputElement;
  private domainInput!: HTMLInputElement;
  private subdivisionSlider!: HTMLInputElement;
  private subdivisionValue!: HTMLSpanElement;
  private updateButton!: HTMLButtonElement;
  private toggleRiemannButton!: HTMLButtonElement;
  private integralValueSpan!: HTMLSpanElement;
  private exampleDescription!: HTMLParagraphElement;
  private loadingIndicator!: HTMLDivElement;

  constructor() {
    this.initializeElements();
    this.populateExamples();
    this.setupEventListeners();
    this.initializeVisualizer().then(() => {
      this.updateVisualization();
    });
  }

  private initializeElements() {
    this.exampleSelect = document.getElementById('example-select') as HTMLSelectElement;
    this.functionInput = document.getElementById('function-input') as HTMLInputElement;
    this.domainInput = document.getElementById('domain-input') as HTMLInputElement;
    this.subdivisionSlider = document.getElementById('subdivision-slider') as HTMLInputElement;
    this.subdivisionValue = document.getElementById('subdivision-value') as HTMLSpanElement;
    this.updateButton = document.getElementById('update-visualization') as HTMLButtonElement;
    this.toggleRiemannButton = document.getElementById('toggle-riemann') as HTMLButtonElement;
    this.integralValueSpan = document.getElementById('integral-value') as HTMLSpanElement;
    this.exampleDescription = document.getElementById('example-description') as HTMLParagraphElement;
    this.loadingIndicator = document.getElementById('loading-indicator') as HTMLDivElement;
  }

  private populateExamples() {
    examples.forEach((example, index) => {
      const option = document.createElement('option');
      option.value = index.toString();
      option.textContent = example.name;
      option.title = example.description;
      this.exampleSelect.appendChild(option);
    });
  }

  private setupEventListeners() {
    // 示例选择器
    this.exampleSelect.addEventListener('change', () => {
      const selectedIndex = parseInt(this.exampleSelect.value);
      if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < examples.length) {
        const example = examples[selectedIndex];
        this.functionInput.value = example.function;
        this.domainInput.value = example.domain;
        this.exampleDescription.textContent = example.description;
        this.updateVisualization();
      } else {
        this.exampleDescription.textContent = '';
      }
    });

    // 更新可视化按钮
    this.updateButton.addEventListener('click', () => {
      this.updateVisualization();
    });

    // 切换黎曼和显示
    this.toggleRiemannButton.addEventListener('click', () => {
      const isShowing = this.visualizer.toggleRiemannSum();
      this.toggleRiemannButton.textContent = isShowing ? '隐藏黎曼和' : '显示黎曼和';
      this.updateIntegralValue();
    });

    // 分割数滑块
    this.subdivisionSlider.addEventListener('input', () => {
      this.subdivisionValue.textContent = this.subdivisionSlider.value;
    });

    this.subdivisionSlider.addEventListener('change', () => {
      this.updateVisualization();
    });

    // 回车键更新
    this.functionInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.updateVisualization();
      }
    });

    this.domainInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.updateVisualization();
      }
    });
  }

  private async initializeVisualizer() {
    const container = document.getElementById('canvas-container') as HTMLElement;

    // 显示加载指示器
    this.loadingIndicator.style.display = 'block';

    try {
      this.visualizer = new IntegralVisualizer(container);

      // 等待一小段时间确保Three.js完全初始化
      await new Promise(resolve => setTimeout(resolve, 500));

      // 隐藏加载指示器
      this.loadingIndicator.style.display = 'none';
    } catch (error) {
      console.error('初始化可视化器时出错:', error);
      this.loadingIndicator.innerHTML = '<p style="color: #ff6b6b;">加载失败，请刷新页面重试</p>';
    }
  }

  private updateVisualization() {
    try {
      const functionExpr = this.functionInput.value.trim();
      const domainExpr = this.domainInput.value.trim();
      const subdivisions = parseInt(this.subdivisionSlider.value);

      if (!functionExpr || !domainExpr) {
        alert('请输入函数和积分域表达式');
        return;
      }

      this.visualizer.updateVisualization(functionExpr, domainExpr, subdivisions);
      this.updateIntegralValue();

      // 重置黎曼和按钮文本
      this.toggleRiemannButton.textContent = '显示黎曼和';
    } catch (error) {
      console.error('更新可视化时出错:', error);
      alert('更新可视化时出错，请检查输入的表达式');
    }
  }

  private updateIntegralValue() {
    try {
      const approximation = this.visualizer.calculateIntegralApproximation();
      this.integralValueSpan.textContent = approximation.toFixed(4);
    } catch (error) {
      console.error('计算积分近似值时出错:', error);
      this.integralValueSpan.textContent = '计算错误';
    }
  }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  new IntegralVisionApp();

  // 在开发环境中运行测试
  if (import.meta.env.DEV) {
    console.log('开发模式：运行核心功能测试');
    runTests();
  }
});
