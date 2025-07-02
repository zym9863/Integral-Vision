import { FunctionParser } from './FunctionParser';

/**
 * 简单的测试函数，验证核心功能
 */
function runTests() {
  console.log('开始测试积分视界核心功能...');

  // 测试函数解析
  console.log('\n=== 测试函数解析 ===');
  
  // 测试基本函数
  const result1 = FunctionParser.evaluateFunction('x*x + y*y', 1, 1);
  console.log('f(1,1) = x*x + y*y =', result1, '(期望: 2)');
  
  const result2 = FunctionParser.evaluateFunction('sin(x) * cos(y)', 0, 0);
  console.log('f(0,0) = sin(x) * cos(y) =', result2, '(期望: 0)');
  
  const result3 = FunctionParser.evaluateFunction('exp(-(x*x + y*y))', 0, 0);
  console.log('f(0,0) = exp(-(x*x + y*y)) =', result3, '(期望: 1)');

  // 测试域检查
  console.log('\n=== 测试积分域检查 ===');
  
  const inDomain1 = FunctionParser.isInDomain('x*x + y*y <= 1', 0.5, 0.5);
  console.log('(0.5, 0.5) 在 x*x + y*y <= 1 内:', inDomain1, '(期望: true)');
  
  const inDomain2 = FunctionParser.isInDomain('x*x + y*y <= 1', 1.5, 1.5);
  console.log('(1.5, 1.5) 在 x*x + y*y <= 1 内:', inDomain2, '(期望: false)');
  
  const inDomain3 = FunctionParser.isInDomain('abs(x) <= 1 && abs(y) <= 1', 0.5, -0.5);
  console.log('(0.5, -0.5) 在 abs(x) <= 1 && abs(y) <= 1 内:', inDomain3, '(期望: true)');
  
  const inDomain4 = FunctionParser.isInDomain('x >= 0 && y >= 0 && x + y <= 2', 1, 1);
  console.log('(1, 1) 在 x >= 0 && y >= 0 && x + y <= 2 内:', inDomain4, '(期望: true)');

  // 测试域边界计算
  console.log('\n=== 测试域边界计算 ===');
  
  const bounds1 = FunctionParser.getDomainBounds('x*x + y*y <= 1');
  console.log('x*x + y*y <= 1 的边界:', bounds1);
  
  const bounds2 = FunctionParser.getDomainBounds('abs(x) <= 1 && abs(y) <= 1');
  console.log('abs(x) <= 1 && abs(y) <= 1 的边界:', bounds2);

  console.log('\n测试完成！');
}

// 如果在浏览器环境中，将测试函数添加到全局对象
if (typeof window !== 'undefined') {
  (window as any).runTests = runTests;
  console.log('测试函数已添加到 window.runTests，可在浏览器控制台中调用');
}

export { runTests };
