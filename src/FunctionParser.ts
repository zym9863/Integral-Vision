/**
 * 简单的函数解析器，用于解析用户输入的数学函数
 */
export class FunctionParser {
  /**
   * 解析并计算二元函数 f(x, y)
   * @param expression 函数表达式字符串，如 "x*x + y*y"
   * @param x x坐标值
   * @param y y坐标值
   * @returns 函数值
   */
  static evaluateFunction(expression: string, x: number, y: number): number {
    try {
      // 替换数学函数
      let processedExpression = expression
        .replace(/\bsin\b/g, 'Math.sin')
        .replace(/\bcos\b/g, 'Math.cos')
        .replace(/\btan\b/g, 'Math.tan')
        .replace(/\bexp\b/g, 'Math.exp')
        .replace(/\blog\b/g, 'Math.log')
        .replace(/\bsqrt\b/g, 'Math.sqrt')
        .replace(/\babs\b/g, 'Math.abs')
        .replace(/\bpi\b/g, 'Math.PI')
        .replace(/\be\b/g, 'Math.E')
        .replace(/\^/g, '**'); // 幂运算

      // 创建函数并计算
      const func = new Function('x', 'y', 'Math', `return ${processedExpression}`);
      const result = func(x, y, Math);
      
      // 检查结果是否有效
      if (isNaN(result) || !isFinite(result)) {
        return 0;
      }
      
      return result;
    } catch (error) {
      console.warn('函数计算错误:', error);
      return 0;
    }
  }

  /**
   * 检查点 (x, y) 是否在积分域内
   * @param domainExpression 域表达式，如 "x*x + y*y <= 1"
   * @param x x坐标值
   * @param y y坐标值
   * @returns 是否在域内
   */
  static isInDomain(domainExpression: string, x: number, y: number): boolean {
    try {
      // 处理逻辑运算符和数学函数
      let processedExpression = domainExpression
        .replace(/\bsin\b/g, 'Math.sin')
        .replace(/\bcos\b/g, 'Math.cos')
        .replace(/\btan\b/g, 'Math.tan')
        .replace(/\bexp\b/g, 'Math.exp')
        .replace(/\blog\b/g, 'Math.log')
        .replace(/\bsqrt\b/g, 'Math.sqrt')
        .replace(/\babs\b/g, 'Math.abs')
        .replace(/\bpi\b/g, 'Math.PI')
        .replace(/\be\b/g, 'Math.E')
        .replace(/\^/g, '**')
        .replace(/&&/g, ' && ')
        .replace(/\|\|/g, ' || ');

      // 处理复合条件（包含 && 或 ||）
      if (processedExpression.includes('&&') || processedExpression.includes('||')) {
        const func = new Function('x', 'y', 'Math', `return ${processedExpression}`);
        return Boolean(func(x, y, Math));
      }

      // 处理单个不等式
      if (processedExpression.includes('<=')) {
        const [left, right] = processedExpression.split('<=');
        const leftFunc = new Function('x', 'y', 'Math', `return ${left.trim()}`);
        const rightFunc = new Function('x', 'y', 'Math', `return ${right.trim()}`);
        return leftFunc(x, y, Math) <= rightFunc(x, y, Math);
      } else if (processedExpression.includes('>=')) {
        const [left, right] = processedExpression.split('>=');
        const leftFunc = new Function('x', 'y', 'Math', `return ${left.trim()}`);
        const rightFunc = new Function('x', 'y', 'Math', `return ${right.trim()}`);
        return leftFunc(x, y, Math) >= rightFunc(x, y, Math);
      } else if (processedExpression.includes('<')) {
        const [left, right] = processedExpression.split('<');
        const leftFunc = new Function('x', 'y', 'Math', `return ${left.trim()}`);
        const rightFunc = new Function('x', 'y', 'Math', `return ${right.trim()}`);
        return leftFunc(x, y, Math) < rightFunc(x, y, Math);
      } else if (processedExpression.includes('>')) {
        const [left, right] = processedExpression.split('>');
        const leftFunc = new Function('x', 'y', 'Math', `return ${left.trim()}`);
        const rightFunc = new Function('x', 'y', 'Math', `return ${right.trim()}`);
        return leftFunc(x, y, Math) > rightFunc(x, y, Math);
      } else if (processedExpression.includes('=') && !processedExpression.includes('!')) {
        const [left, right] = processedExpression.split('=');
        const leftFunc = new Function('x', 'y', 'Math', `return ${left.trim()}`);
        const rightFunc = new Function('x', 'y', 'Math', `return ${right.trim()}`);
        return Math.abs(leftFunc(x, y, Math) - rightFunc(x, y, Math)) < 0.01;
      }

      // 如果没有比较运算符，假设表达式本身是布尔值
      const func = new Function('x', 'y', 'Math', `return ${processedExpression}`);
      return Boolean(func(x, y, Math));
    } catch (error) {
      console.warn('域检查错误:', error);
      return false;
    }
  }

  /**
   * 获取积分域的边界框
   * @param domainExpression 域表达式
   * @param range 搜索范围
   * @returns 边界框 {minX, maxX, minY, maxY}
   */
  static getDomainBounds(domainExpression: string, range: number = 3): {minX: number, maxX: number, minY: number, maxY: number} {
    let minX = range, maxX = -range, minY = range, maxY = -range;
    const step = 0.1;
    
    for (let x = -range; x <= range; x += step) {
      for (let y = -range; y <= range; y += step) {
        if (this.isInDomain(domainExpression, x, y)) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }
    
    // 如果没有找到有效点，返回默认范围
    if (minX === range) {
      return { minX: -1, maxX: 1, minY: -1, maxY: 1 };
    }
    
    return { minX, maxX, minY, maxY };
  }
}
