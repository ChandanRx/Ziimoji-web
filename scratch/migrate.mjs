import fs from 'fs/promises';
import path from 'path';

const iconMap = {
  Plus: "PlusOutlined",
  Image: "PictureOutlined",
  Send: "SendOutlined",
  Loader2: "LoadingOutlined",
  X: "CloseOutlined",
  Smile: "SmileOutlined",
  BarChart2: "BarChartOutlined",
  MapPin: "EnvironmentOutlined",
  Crop: "ScissorOutlined",
  Maximize2: "ExpandOutlined",
  Heart: "HeartOutlined",
  MessageCircle: "MessageOutlined",
  Share2: "ShareAltOutlined",
  Bookmark: "BookOutlined",
  MoreHorizontal: "MoreOutlined",
  ChevronLeft: "LeftOutlined",
  Search: "SearchOutlined",
  Bell: "BellOutlined",
  Settings: "SettingOutlined",
  Flame: "FireOutlined",
  TrendingUp: "RiseOutlined",
  User: "UserOutlined",
  Users: "TeamOutlined",
  LogOut: "LogoutOutlined",
  BadgeCheck: "CheckCircleOutlined",
  Lock: "LockOutlined",
  Eye: "EyeOutlined",
  EyeOff: "EyeInvisibleOutlined",
  ArrowLeft: "ArrowLeftOutlined",
  Compass: "CompassOutlined",
  Home: "HomeOutlined",
  MessageSquare: "MessageOutlined",
  MoreVertical: "MoreOutlined",
  // add any others found
};

const tailwindSizeToPx = {
  '3': 12,
  '3.5': 14,
  '4': 16,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
};

async function processFile(filePath) {
  let content = await fs.readFile(filePath, 'utf-8');
  
  if (!content.includes('lucide-react')) {
    return; // Already processed
  }

  console.log('Processing', filePath);

  // 1. Replace imports
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+["']lucide-react["'];?/g;
  let match = importRegex.exec(content);
  let importedIcons = [];
  if (match) {
    const iconsList = match[1].split(',').map(s => s.trim()).filter(Boolean);
    const newImports = iconsList.map(iconStr => {
      let original, alias;
      if (iconStr.includes(' as ')) {
        const parts = iconStr.split(' as ');
        original = parts[0].trim();
        alias = parts[1].trim();
      } else {
        original = iconStr;
        alias = iconStr;
      }
      
      const antIcon = iconMap[original] || `${original}Outlined`; // fallback
      importedIcons.push(alias);
      if (antIcon === alias) return antIcon;
      return `${antIcon} as ${alias}`;
    });
    
    content = content.replace(match[0], `import { ${newImports.join(', ')} } from "@ant-design/icons";`);
  }

  // 2. Remove strokeWidth and stroke
  content = content.replace(/\s+strokeWidth=\{[^}]+\}/g, '');
  content = content.replace(/\s+strokeWidth=["'][^"']+["']/g, '');
  content = content.replace(/\s+stroke=\{[^}]+\}/g, '');
  content = content.replace(/\s+stroke=["'][^"']+["']/g, '');

  // 3. Fix icon sizing. We need to find usages of the icons.
  for (const icon of importedIcons) {
    const jsxRegex = new RegExp(`<${icon}\\b[^>]*className=["']([^"']+)["'][^>]*>`, 'g');
    content = content.replace(jsxRegex, (fullMatch, className) => {
      let newClassName = className;
      // Replace w-* and h-* with text-*
      const wMatch = className.match(/w-(\[?[\d.]+px\]?|\d+(?:\.\d+)?)/);
      if (wMatch) {
        let size = wMatch[1];
        if (size.startsWith('[')) {
          // w-[18px] -> text-[18px]
          size = size.slice(1, -1);
        } else {
          size = tailwindSizeToPx[size] ? `${tailwindSizeToPx[size]}px` : `${parseFloat(size) * 4}px`;
        }
        newClassName = newClassName.replace(/\bw-(\[?[\d.]+px\]?|\d+(?:\.\d+)?)\b/, `text-[${size}]`);
      }
      newClassName = newClassName.replace(/\bh-(\[?[\d.]+px\]?|\d+(?:\.\d+)?)\b/, '').replace(/\s+/g, ' ').trim();
      
      return fullMatch.replace(className, newClassName);
    });
  }

  await fs.writeFile(filePath, content, 'utf-8');
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

findFiles('e:/zymoji/zymoji/src').then(() => console.log('Done')).catch(console.error);
