import type { Article, Comment } from "@/lib/types";

export const featuredArticles: Article[] = [
  {
    id: "nfl-weekly-film-room",
    author: "3 Zone Sports Staff",
    authorSlug: "3-zone-sports-staff",
    category: "NFL",
    content:
      "Tempo is reshaping how offenses stress defensive substitutions, simplify reads, and create explosive plays. 3 Zone Sports can use this article template for film-room analysis, photo galleries, and embedded highlight clips.",
    excerpt:
      "Break down the play design, key matchups, and coaching decisions behind the week’s most important drives.",
    imageUrl: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    league: "Professional Football",
    publishedAt: "2026-09-12",
    readTime: "6 min read",
    slug: "film-room-nfl-tempo",
    status: "published",
    tags: ["Film Room", "Offense", "Weekly Analysis"],
    team: "Atlanta Falcons",
    title: "Film Room: Why tempo is defining early-season NFL offense",
  },
  {
    id: "nba-training-camp-watch",
    author: "A. Moten",
    authorSlug: "a-moten",
    category: "NBA",
    content:
      "Training camp storylines are ideal for quick-turn coverage and can anchor a larger content calendar that includes video, photo, and social recaps. This seeded article shows how to structure preview copy for roster battles and breakout candidates.",
    excerpt:
      "A flexible content card template for previews, analysis, and quick-hit updates across every league.",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    league: "Professional Basketball",
    publishedAt: "2026-09-11",
    readTime: "4 min read",
    slug: "nba-training-camp-watch-list",
    status: "published",
    tags: ["Camp", "Rotations", "Preview"],
    team: "Atlanta Hawks",
    title: "Training Camp Watch List: Five rotations ready to surprise",
  },
  {
    id: "high-school-recruiting-roundup",
    author: "3 Zone Sports Staff",
    authorSlug: "3-zone-sports-staff",
    category: "Recruiting",
    content:
      "Regional recruiting content is one of the clearest differentiators for a local sports media brand. This starter article is designed to become a database-backed player spotlight with tags, league metadata, and future comment threads.",
    excerpt:
      "Use Supabase-backed content workflows to scale local stories, interviews, and player profiles.",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
    isFeatured: false,
    league: "High School Sports",
    publishedAt: "2026-09-10",
    readTime: "5 min read",
    slug: "recruiting-roundup-regional-standouts",
    status: "published",
    tags: ["Recruiting", "Local", "Prospects"],
    team: "Georgia High School",
    title: "Recruiting Roundup: Regional standouts to feature next",
  },
  {
    id: "behind-the-scenes-newsroom",
    author: "3 Zone Sports Staff",
    authorSlug: "3-zone-sports-staff",
    category: "Behind the Scenes",
    content:
      "Draft stories can live in the editorial dashboard before they are promoted to the homepage. This seed gives the dashboard an unpublished item so create and edit workflows have visible state immediately.",
    excerpt:
      "A dashboard-ready draft that demonstrates publish status and editorial workflow controls.",
    imageUrl: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
    isFeatured: false,
    league: "Company Updates",
    publishedAt: "2026-09-09",
    readTime: "3 min read",
    slug: "behind-the-scenes-newsroom",
    status: "draft",
    tags: ["Operations", "Editorial"],
    team: "3 Zone Sports",
    title: "Behind the Scenes: Building a local-first newsroom",
  },
];

export const featuredComments: Comment[] = [
  {
    articleSlug: "film-room-nfl-tempo",
    authorName: "Jordan",
    body: "The tempo breakdown feels ready for premium film-room coverage once video clips are added.",
    createdAt: "2026-09-12T14:30:00.000Z",
    id: "comment-1",
  },
];
