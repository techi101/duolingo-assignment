const fs = require('fs');

const svgMap = {
    'apple.svg': '🍎',
    'bread.svg': '🍞',
    'milk.svg': '🥛',
    'water.svg': '💧',
    'cat.svg': '🐱',
    'dog.svg': '🐶',
    'bird.svg': '🐦',
    'fish.svg': '🐟',
    'boy.svg': '👦',
    'girl.svg': '👧',
    'man.svg': '👨',
    'woman.svg': '👩'
};

for (const [filename, emoji] of Object.entries(svgMap)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text x="50" y="50" dominant-baseline="central" text-anchor="middle" font-size="80">${emoji}</text>
</svg>`;
    fs.writeFileSync(`frontend/public/${filename}`, svg, 'utf-8');
}
console.log('SVGs created');
