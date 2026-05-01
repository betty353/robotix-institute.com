import type { MetadataRoute } from 'next';
import { GameProjectStatus } from '@prisma/client';
import prisma from '@/lib/prisma';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://robotixinstitute.co.zm';

const STATIC_ROUTES = [
  '',
  'courses',
  'paths',
  'projects',
  'playground',
  'simulation',
  'iot',
  'arena',
  'competitions',
  'marketplace',
  'community',
  'blog',
  'ai-tutor',
  'about',
  'contact',
  'privacy',
  'terms',
  'faq',
  'docs',
  'events',
  'mentorship',
  'partners',
  'careers',
  'portfolio',
  'game-gallery',
  'login',
  'register',
  'forgot-password',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((p) => ({
    url: `${SITE_URL}/${p}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.7,
  }));

  // Try to add dynamic content; fail soft so the build never breaks if DB is down.
  let dynamicEntries: MetadataRoute.Sitemap = [];
  try {
    const [courses, paths, projects, blogs, games, studioGames] = await Promise.all([
      prisma.course.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.learningPath.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.robotProject.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.game.findMany({ select: { slug: true } }),
      prisma.gameProject.findMany({
        where: { status: GameProjectStatus.PUBLISHED },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    dynamicEntries = [
      ...courses.map((c) => ({ url: `${SITE_URL}/courses/${c.slug}`, lastModified: c.updatedAt, changeFrequency: 'weekly' as const, priority: 0.8 })),
      ...paths.map((p) => ({ url: `${SITE_URL}/paths/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'weekly' as const, priority: 0.8 })),
      ...projects.map((p) => ({ url: `${SITE_URL}/projects/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'weekly' as const, priority: 0.7 })),
      ...blogs.map((b) => ({ url: `${SITE_URL}/blog/${b.slug}`, lastModified: b.updatedAt, changeFrequency: 'monthly' as const, priority: 0.6 })),
      ...games.map((g) => ({ url: `${SITE_URL}/arena/${g.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 })),
      ...studioGames.map((g) => ({
        url: `${SITE_URL}/game-lab/play/${g.slug}`,
        lastModified: g.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.65,
      })),
    ];
  } catch (e) {
    console.warn('[sitemap] dynamic entries skipped:', e instanceof Error ? e.message : e);
  }

  return [...staticEntries, ...dynamicEntries];
}
