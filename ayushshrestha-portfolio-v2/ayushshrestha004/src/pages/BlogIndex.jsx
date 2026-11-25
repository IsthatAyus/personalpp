import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogLayout from '../components/BlogLayout';
import { posts, formatDate } from '../blog/posts';
import profilePhoto from '../assets/man-using-laptop-drinking-coffee.png';

export default function BlogIndex() {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  const tags = useMemo(
    () => ['All', ...new Set(posts.flatMap((post) => post.tags))],
    []
  );
  const filteredPosts = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag = activeTag === 'All' || post.tags.includes(activeTag);
      const searchableText = `${post.title} ${post.description} ${post.tags.join(' ')}`.toLowerCase();
      return matchesTag && (!searchTerm || searchableText.includes(searchTerm));
    });
  }, [activeTag, query]);

  return (
    <BlogLayout>
      <div className="blog-container">
        <section className="blog-intro" aria-labelledby="blog-heading">
          <div className="blog-intro-copy">
            <p className="blog-eyebrow"><span aria-hidden="true">✦</span> THE NOTEBOOK</p>
            <h1 className="blog-heading" id="blog-heading">
              Ideas, builds <span>&amp; lessons learned.</span>
            </h1>
            <p className="blog-lede">
              Hey, I’m Ayush. I write about the things I build, the tools I’m exploring,
              and the little lessons that make the next project better.
            </p>
            <p className="blog-count">
              <span className="blog-count-dot" aria-hidden="true" />
              {posts.length} {posts.length === 1 ? 'story' : 'stories'} to explore
            </p>
          </div>
          <div className="blog-profile">
            <img src={profilePhoto} alt="Ayush Shrestha" />
            <span className="blog-profile-note">written with ☕ &amp; curiosity</span>
          </div>
        </section>

        <section className="blog-discovery" aria-labelledby="discovery-heading">
          <div className="blog-discovery-heading">
            <div>
              <p className="blog-section-kicker">PICK A PATH</p>
              <h2 id="discovery-heading">Find your next read</h2>
            </div>
            <label className="blog-search">
              <span className="blog-search-icon" aria-hidden="true">⌕</span>
              <span className="sr-only">Search stories</span>
              <input
                type="search"
                placeholder="Search stories..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>

          <div className="blog-filters" aria-label="Filter stories by topic">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`blog-filter${activeTag === tag ? ' active' : ''}`}
                aria-pressed={activeTag === tag}
                onClick={() => setActiveTag(tag)}
              >
                {tag === 'All' ? '✦ All stories' : tag}
              </button>
            ))}
          </div>
        </section>

        {posts.length === 0 ? (
          <div className="blog-empty-state">
            <span className="blog-empty-icon" aria-hidden="true">✎</span>
            <h2>Fresh stories are brewing</h2>
            <p>There’s nothing here just yet. Check back soon for notes from my latest builds.</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="blog-empty-state">
            <span className="blog-empty-icon" aria-hidden="true">⌕</span>
            <h2>No stories found</h2>
            <p>Try another search or clear your topic filter to see all the stories.</p>
            <button
              type="button"
              className="blog-reset"
              onClick={() => { setQuery(''); setActiveTag('All'); }}
            >
              Show all stories
            </button>
          </div>
        ) : (
          <section className="blog-results" aria-labelledby="results-heading">
            <div className="blog-results-heading">
              <h2 id="results-heading">
                {query || activeTag !== 'All' ? 'Your matches' : 'Fresh from the notebook'}
              </h2>
              <span>{filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'}</span>
            </div>
            <ul className="post-list">
              {filteredPosts.map((post) => (
                <li key={post.slug}>
                  <Link to={`/blog/${post.slug}/`} className="post-card">
                    <div className="post-card-meta">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span aria-hidden="true">·</span>
                      <span>{post.readingTime} min read</span>
                      {post.draft && <span className="post-draft">draft</span>}
                    </div>
                    <h3 className="post-card-title">{post.title}</h3>
                    <p className="post-card-desc">{post.description}</p>
                    {post.tags.length > 0 && (
                      <div className="post-tags">
                        {post.tags.map((tag) => (
                          <span key={tag} className="post-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    <span className="post-card-cta">Read the story <span aria-hidden="true">↗</span></span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </BlogLayout>
  );
}
