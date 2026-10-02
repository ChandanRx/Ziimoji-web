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
  
  if (!content.includes('@ant-design/icons')) {
    return; // Already processed if looking for lucide-react, but we are fixing existing replacements
  }

  // Find imported icons from ant-design/icons
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+["']@ant-design\/icons["'];?/g;
  let match = importRegex.exec(content);
  if (!match) return;
  
  const iconsList = match[1].split(',').map(s => s.trim()).filter(Boolean);
  let importedIcons = iconsList.map(iconStr => {
    if (iconStr.includes(' as ')) {
      return iconStr.split(' as ')[1].trim();
    }
    return iconStr;
  });

  let modified = false;

  for (const icon of importedIcons) {
    const jsxRegex = new RegExp(`<${icon}\\b[^>]*className=["']([^"']+)["'][^>]*>`, 'g');
    content = content.replace(jsxRegex, (fullMatch, className) => {
      let newClassName = className;
      
      // Replace arbitrary prefixed w-* and h-* with text-*
      // Regex matches word boundary, optional prefix (sm:, hover:, etc), w- or h-, then size
      const whRegex = /\b([a-z0-9:-]*?)(w|h)-(\[?[\d.]+px\]?|\d+(?:\.\d+)?)\b/g;
      
      newClassName = newClassName.replace(whRegex, (match, prefix, type, size) => {
        if (type === 'h') return ''; // Remove h-* classes completely
        
        // For w-*, replace with text-*
        let newSize = size;
        if (size.startsWith('[')) {
          newSize = size.slice(1, -1);
        } else {
          newSize = tailwindSizeToPx[size] ? `${tailwindSizeToPx[size]}px` : `${parseFloat(size) * 4}px`;
        }
        return `${prefix}text-[${newSize}]`;
      });
      
      // Clean up multiple spaces
      newClassName = newClassName.replace(/\s+/g, ' ').trim();
      
      if (className !== newClassName) {
        modified = true;
      }
      return fullMatch.replace(className, newClassName);
    });
  }

  if (modified) {
    console.log('Fixed sizes in', filePath);
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

findFiles('e:/zymoji/zymoji/src').then(() => console.log('Done fixing sizes')).catch(console.error);
