
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'src/content/kx');

function getReadingTime(content: string) {
  if (!content) return 0;
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  if (wordCount === 0) return 0;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function getSortedPostsData() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  // Only process .md files to avoid "Invalid time value" from hidden system files
  const fileNames = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
  
  const allPostsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
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
  }).filter(post => !!post.date); // Ensure only posts with a valid date field are included

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const sortedPosts = getSortedPostsData();
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
