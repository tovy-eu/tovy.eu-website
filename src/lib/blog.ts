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

export function getSortedPostsData(lang: string = 'en') {
  const postsDirectory = path.join(basePostsDirectory, lang);
  
  try {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }
    
    const fileNames = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
    return processFiles(postsDirectory, fileNames);
  } catch (e) {
    console.error(`Could not read posts for language: ${lang}`, e);
    return [];
  }
}

function processFiles(dir: string, fileNames: string[]) {
  const allPostsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(dir, fileName);
    
    // Efficiently read only the frontmatter
    const { data } = matter.read(fullPath);
    
    // Excerpt and readingTime are not needed for the list page, 
    // they can be calculated on the individual post page instead.
    const excerpt = data.summary || '';

    return {
      id,
      excerpt,
      slug: id,
      ...(data as { date: string; title: string, author: string, image: string, tags: string[], summary: string }),
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

export function getPaginatedPostsData(
  lang: string = 'en',
  limit: number = 6,
  page: number = 1
) {
  const allPosts = getSortedPostsData(lang);
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const offset = (page - 1) * limit;
  const posts = allPosts.slice(offset, offset + limit);

  return {
    posts,
    totalPages,
    currentPage: page,
  };
}

export async function getPostData(id: string, lang: string = 'en') {
  let fullPath = path.join(basePostsDirectory, lang, `${id}.md`);
  
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

  const contentParts = matterResult.content.split(/\n\s*\n/);
  const introContent = contentParts.splice(0, 2).join('\n\n');
  const restOfContent = contentParts.join('\n\n');

  const processedIntro = await remark().use(html).process(introContent);
  const introHtml = processedIntro.toString();

  const processedContent = await remark().use(html).process(restOfContent);
  const contentHtml = processedContent.toString();

  const excerpt = matterResult.data.summary || (introContent.substring(0, 160).trim() + '...');
  const readingTime = getReadingTime(matterResult.content);
  
  const previousPost = postIndex > 0 ? sortedPosts[postIndex - 1] : null;
  const nextPost = postIndex < sortedPosts.length - 1 ? sortedPosts[postIndex + 1] : null;

  return {
    id,
    contentHtml,
    introHtml,
    excerpt,
    readingTime,
    previousPost,
    nextPost,
    ...(matterResult.data as { date: string; title: string, author: string, image: string, tags: string[], summary: string }),
  };
}
