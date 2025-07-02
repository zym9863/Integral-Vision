/**
 * 预设的函数和积分域示例
 */
export interface Example {
  name: string;
  function: string;
  domain: string;
  description: string;
}

export const examples: Example[] = [
  {
    name: "抛物面（圆形域）",
    function: "x*x + y*y",
    domain: "x*x + y*y <= 1",
    description: "经典的抛物面在单位圆内的积分"
  },
  {
    name: "波浪函数",
    function: "sin(x) * cos(y)",
    domain: "x*x + y*y <= 4",
    description: "正弦余弦函数的乘积"
  },
  {
    name: "高斯函数",
    function: "exp(-(x*x + y*y))",
    domain: "x*x + y*y <= 2",
    description: "二维高斯函数"
  },
  {
    name: "马鞍面",
    function: "x*x - y*y",
    domain: "abs(x) <= 1 && abs(y) <= 1",
    description: "双曲抛物面在正方形域内"
  },
  {
    name: "锥面",
    function: "sqrt(x*x + y*y)",
    domain: "x*x + y*y <= 1",
    description: "圆锥面在单位圆内"
  },
  {
    name: "三角函数组合",
    function: "sin(x*y)",
    domain: "x >= 0 && y >= 0 && x + y <= 3.14159",
    description: "在三角形域内的正弦函数"
  },
  {
    name: "简单线性函数",
    function: "x + y",
    domain: "x >= 0 && y >= 0 && x <= 2 && y <= 2",
    description: "在正方形域内的线性函数"
  }
];
