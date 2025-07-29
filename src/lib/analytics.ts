declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: object) => void;
  }
}

export const trackBlogView = (slug: string, title: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: title,
      page_location: window.location.href,
      custom_parameters: {
        content_type: 'blog_post',
        content_id: slug,
      }
    });
  }
};

export const trackBlogShare = (slug: string, title: string, method: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'share', {
      method: method,
      content_type: 'blog_post',
      content_id: slug,
      item_id: slug,
    });
  }
};