import fs from 'fs/promises';
import path from 'path';

const iconFixMap = {
  ArrowLeftOutlined: "LeftOutlined",
  CalendarDaysOutlined: "CalendarOutlined",
  Grid3x3Outlined: "AppstoreOutlined",
  HashOutlined: "NumberOutlined",
  LinkIconOutlined: "LinkOutlined",
  UserPlusOutlined: "UserAddOutlined",
  VideoOutlined: "VideoCameraOutlined",
};

async function processFile(filePath) {
  let content = await fs.readFile(filePath, 'utf-8');
  
  if (!content.includes('@ant-design/icons')) {
    return;
  }

  let modified = false;

  const importRegex = /import\s+\{([^}]+)\}\s+from\s+["']@ant-design\/icons["'];?/g;
  let match = importRegex.exec(content);
  if (match) {
    let importListStr = match[1];
    
    for (const [bad, good] of Object.entries(iconFixMap)) {
      if (importListStr.includes(bad)) {
        importListStr = importListStr.replace(new RegExp(`\\b${bad}\\b`, 'g'), good);
        modified = true;
      }
    }
    
    if (modified) {
      content = content.replace(match[1], importListStr);
    }
  }

  if (modified) {
    console.log('Fixed imports in', filePath);
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

findFiles('e:/zymoji/zymoji/src').then(() => console.log('Done fixing icons')).catch(console.error);
