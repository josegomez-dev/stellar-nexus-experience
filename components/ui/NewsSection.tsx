import React from 'react';
import { NewsArticle } from '@/lib/newsData';

interface NewsSectionProps {
  title: string;
  articles: NewsArticle[];
  className?: string;
}

export default function NewsSection({ title, articles, className = '' }: NewsSectionProps) {
  const handleArticleClick = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className={`py-16 ${className}`}>
      {/* Section Title */}
      <div className='text-center mb-12'>
        <h2 className='text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-500 to-accent-600 mb-4'>
          {title}
        </h2>
        <div className='w-24 h-1 bg-gradient-to-r from-brand-500 to-accent-600 mx-auto rounded-full'></div>
      </div>

      {/* Articles Grid */}
      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4'>
        {articles.map(article => (
          <article
            key={article.id}
            className='group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-brand-400/50 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-brand-500/20'
          >
            {/* Article Image */}
            <div className='relative h-48 bg-gradient-to-br from-brand-500/20 to-accent-600/20 overflow-hidden'>
              <div className='absolute inset-0 bg-gradient-to-br from-brand-500/30 via-transparent to-accent-600/30 group-hover:from-brand-400/40 group-hover:to-accent-500/40 transition-all duration-300'></div>

              {/* Read Time */}
              <div className='absolute top-3 right-3'>
                <span className='px-2 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm'>
                  {article.readTime}
                </span>
              </div>

              {/* Demo Badge */}
              <div className='absolute bottom-3 left-3'>
                <span className='px-2 py-1 rounded-full text-xs font-semibold bg-brand-500/80 text-white'>
                  {article.demo}
                </span>
              </div>
            </div>

            {/* Article Content */}
            <div className='p-6'>
              {/* Date */}
              <p className='text-white/60 text-sm mb-2'>
                {new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>

              {/* Title */}
              <h3 className='text-lg font-semibold text-white mb-3 group-hover:text-brand-300 transition-colors duration-300 line-clamp-2'>
                {article.title}
              </h3>

              {/* Description */}
              <p className='text-white/70 text-sm mb-4 line-clamp-3'>{article.description}</p>

              {/* Tags */}
              <div className='flex flex-wrap gap-1 mb-4'>
                {article.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className='px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 group-hover:bg-brand-500/20 group-hover:text-brand-300 transition-all duration-300'
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className='flex gap-2'>
                <button
                  onClick={() => handleArticleClick(article.link)}
                  className='flex-1 px-4 py-2 bg-gradient-to-r from-brand-500/20 to-accent-600/20 hover:from-brand-500/30 hover:to-accent-600/30 border border-brand-400/30 hover:border-brand-400/50 rounded-lg text-brand-300 hover:text-brand-200 transition-all duration-300 font-medium group-hover:scale-105'
                >
                  Watch Video
                </button>
                <button
                  onClick={() => handleArticleClick(article.link)}
                  className='flex-1 px-4 py-2 bg-gradient-to-r from-brand-500/20 to-accent-600/20 hover:from-brand-500/30 hover:to-accent-600/30 border border-brand-400/30 hover:border-brand-400/50 rounded-lg text-brand-300 hover:text-brand-200 transition-all duration-300 font-medium group-hover:scale-105'
                >
                  Read Article
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
