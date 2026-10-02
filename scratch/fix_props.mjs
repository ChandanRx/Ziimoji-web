import fs from 'fs/promises';
import path from 'path';

async function processFile(filePath) {
  let content = await fs.readFile(filePath, 'utf-8');
  
  if (!content.includes('@ant-design/icons')) {
    return;
  }

  let modified = false;

  // Remove fill props
  const before = content;
  content = content.replace(/\s+fill=\{[^}]+\}/g, '');
  content = content.replace(/\s+fill=["'][^"']+["']/g, '');
  
  // Fix ClockOutlined to ClockCircleOutlined
  if (content.includes('ClockOutlined')) {
    content = content.replace(/ClockOutlined/g, 'ClockCircleOutlined');
  }

  if (content !== before) {
    console.log('Fixed props/icons in', filePath);
    await fs.writeFile(filePath, content, 'utf-8');
  }
}

async function findFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await findFiles(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      await processFile(fullPath);
    }
  }
}

findFiles('e:/zymoji/zymoji/src').then(() => console.log('Done fixing props')).catch(console.error);
