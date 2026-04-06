import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const basePostsDirectory = path.join(process.cwd(), 'src/content/kx');

function getReadingTime(content: string) {
  if (!content) return 0;
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  if (wordCount === 0) return 0;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Retrieves sorted posts for a specific language.
 * Defaults to 'en' if the language directory doesn't exist.
 */
export function getSortedPostsData(lang: string = 'en') {
  const postsDirectory = path.join(basePostsDirectory, lang);
  
  if (!fs.existsSync(postsDirectory)) {
    // Fallback to base directory for backwards compatibility or return empty
    if (fs.existsSync(basePostsDirectory)) {
       const baseFiles = fs.readdirSync(basePostsDirectory).filter(file => file.endsWith('.md'));
       if (baseFiles.length > 0) return processFiles(basePostsDirectory, baseFiles);
    }
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
  return processFiles(postsDirectory, fileNames);
}

function processFiles(dir: string, fileNames: string[]) {
  const allPostsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(dir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    
    const excerpt = matterResult.content.substring(0, 150).trim() + (matterResult.content.length > 150 ? '...' : '');
    const readingTime = getReadingTime(matterResult.content);

    return {
      id,
      excerpt,
      readingTime,
      ...(matterResult.data as { date: string; title: string, author: string, image: string, tags: string[] }),
    };
  }).filter(post => {
    if (!post.date) return false;
    const dateObj = new Date(post.date);
    return !isNaN(dateObj.getTime());
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/**
 * Retrieves specific post data for a slug and language.
 */
export async function getPostData(id: string, lang: string = 'en') {
  let fullPath = path.join(basePostsDirectory, lang, `${id}.md`);
  
  // Fallback for root files
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(basePostsDirectory, `${id}.md`);
  }

  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const sortedPosts = getSortedPostsData(lang);
  const postIndex = sortedPosts.findIndex(p => p.id === id);
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  const excerpt = matterResult.content.substring(0, 160).trim() + '...';
  const readingTime = getReadingTime(matterResult.content);
  
  const previousPost = postIndex > 0 ? sortedPosts[postIndex - 1] : null;
  const nextPost = postIndex < sortedPosts.length - 1 ? sortedPosts[postIndex + 1] : null;

  return {
    id,
    contentHtml,
    excerpt,
    readingTime,
    previousPost,
    nextPost,
    ...(matterResult.data as { date: string; title: string, author: string, image: string, tags: string[] }),
  };
}
