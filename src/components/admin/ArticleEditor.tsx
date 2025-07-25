'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Save,
  Eye,
  Send,
  X,
  Plus,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  FileImage
} from 'lucide-react';
import type { Article } from '@/types/article';

interface ArticleEditorProps {
  mode: 'create' | 'edit';
  articleId?: string;
}

interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  meta_title: string;
  meta_description: string;
  status: 'draft' | 'published';
  featured_image: string | null;
  categories: string[];
  reading_time: number;
}

export function ArticleEditor({ mode, articleId }: ArticleEditorProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    meta_title: '',
    meta_description: '',
    status: 'draft',
    featured_image: null,
    categories: [],
    reading_time: 5
  });

  const [availableCategories, setAvailableCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingContentImage, setUploadingContentImage] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setAvailableCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  // Load existing article for editing
  useEffect(() => {
    if (mode === 'edit' && articleId) {
      async function fetchArticle() {
        try {
          const response = await fetch(`/api/articles/${articleId}`);
          if (response.ok) {
            const article = await response.json();
            setFormData({
              title: article.title,
              slug: article.slug,
              excerpt: article.excerpt,
              content: article.content,
              meta_title: article.seo_title || article.title,
              meta_description: article.seo_description || article.excerpt,
              status: article.status,
              featured_image: article.featured_image,
              categories: article.categories.map((cat: { id: string }) => cat.id),
              reading_time: article.reading_time
            });
          }
        } catch (error) {
          console.error('Error fetching article:', error);
        }
      }
      fetchArticle();
    }
  }, [mode, articleId]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && mode === 'create') {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, mode]);

  // Estimate reading time based on content
  useEffect(() => {
    const wordCount = formData.content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
    setFormData(prev => ({ ...prev, reading_time: readingTime }));
  }, [formData.content]);

  // Auto-generate meta fields if empty
  useEffect(() => {
    if (formData.title && !formData.meta_title) {
      setFormData(prev => ({ ...prev, meta_title: formData.title }));
    }
    if (formData.excerpt && !formData.meta_description) {
      setFormData(prev => ({ ...prev, meta_description: formData.excerpt }));
    }
  }, [formData.title, formData.excerpt]);

  const handleInputChange = (field: keyof ArticleFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'article');

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, featured_image: data.url }));
      } else {
        const errorData = await response.json();
        console.error('Upload error details:', errorData);
        alert(`Error uploading image: ${errorData.error}${errorData.details ? ` - ${errorData.details}` : ''}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeFeaturedImage = () => {
    setFormData(prev => ({ ...prev, featured_image: null }));
  };

  const handleContentImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Get current cursor position before upload
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }

    await uploadImageFile(file);
    // Reset file input
    event.target.value = '';
  };

  const uploadImageFile = async (file: File) => {
    setUploadingContentImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'article');

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        
        // Generate markdown image syntax
        const imageMarkdown = `\n\n![${file.name.replace(/\.[^/.]+$/, "")}](${data.url})\n\n`;
        
        // Insert at cursor position
        setFormData(prev => ({ 
          ...prev, 
          content: prev.content.slice(0, cursorPosition) + imageMarkdown + prev.content.slice(cursorPosition)
        }));
        
        // Update cursor position to after the inserted image
        const newCursorPosition = cursorPosition + imageMarkdown.length;
        setCursorPosition(newCursorPosition);
        
        // Focus textarea and set cursor position
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
          }
        }, 100);
        
        // Show success message
        alert(`Image uploaded and inserted at cursor position!`);
      } else {
        const errorData = await response.json();
        console.error('Upload error details:', errorData);
        alert(`Error uploading image: ${errorData.error}${errorData.details ? ` - ${errorData.details}` : ''}`);
      }
    } catch (error) {
      console.error('Error uploading content image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploadingContentImage(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    // Get cursor position from textarea if available
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      // Upload the first image file
      uploadImageFile(imageFiles[0]);
    }
  };

  // Simple markdown to HTML conversion for preview
  const convertMarkdownToHtml = (markdown: string): string => {
    return markdown
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full max-w-2xl mx-auto my-6 rounded-lg shadow-sm" />')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold my-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold my-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm">$1</code>')
      .replace(/^\* (.+)$/gm, '<li>$1</li>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc pl-6 my-4">$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.*)$/gm, '<p>$1</p>')
      .replace(/<p><\/p>/g, '')
      .replace(/<p>(<h[1-6].*<\/h[1-6]>)<\/p>/g, '$1')
      .replace(/<p>(<pre.*<\/pre>)<\/p>/gs, '$1')
      .replace(/<p>(<ul.*<\/ul>)<\/p>/gs, '$1')
      .replace(/<p>(<img.*\/>)<\/p>/g, '<div class="text-center my-6">$1</div>');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (formData.categories.length === 0) newErrors.categories = 'At least one category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (publishNow = false) => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        status: publishNow ? 'published' : formData.status
      };

      const url = mode === 'create' ? '/api/articles' : `/api/articles/${articleId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        router.push('/admin/articles');
      } else {
        const errorData = await response.json();
        alert(`Error saving article: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error saving article. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const selectedCategoryNames = formData.categories
    .map(id => availableCategories.find(cat => cat.id === id)?.name)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/articles">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Articles
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">
              {mode === 'create' ? 'New Article' : 'Edit Article'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button 
              onClick={() => handleSave(true)}
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <Card className="modern-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Title <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className={`w-full px-3 py-2 text-lg font-medium bg-transparent border-0 border-b-2 ${
                          errors.title ? 'border-destructive' : 'border-border'
                        } focus:outline-none focus:border-primary`}
                        placeholder="Enter article title..."
                      />
                      {errors.title && (
                        <p className="text-sm text-destructive mt-1">{errors.title}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        URL Slug <span className="text-destructive">*</span>
                      </label>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>/blog/</span>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => handleInputChange('slug', e.target.value)}
                          className={`flex-1 px-2 py-1 bg-transparent border rounded ${
                            errors.slug ? 'border-destructive' : 'border-border'
                          } focus:outline-none focus:border-primary`}
                          placeholder="article-url-slug"
                        />
                      </div>
                      {errors.slug && (
                        <p className="text-sm text-destructive mt-1">{errors.slug}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Excerpt */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="text-lg">Excerpt</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 bg-input border ${
                      errors.excerpt ? 'border-destructive' : 'border-border'
                    } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none`}
                    placeholder="Write a brief excerpt that summarizes your article..."
                  />
                  {errors.excerpt && (
                    <p className="text-sm text-destructive mt-1">{errors.excerpt}</p>
                  )}
                </CardContent>
              </Card>

              {/* Content */}
              <Card className="modern-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Content</CardTitle>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleContentImageUpload}
                        className="hidden"
                        id="content-image-upload"
                        disabled={uploadingContentImage}
                      />
                      <label htmlFor="content-image-upload">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                          disabled={uploadingContentImage}
                          asChild
                        >
                          <span>
                            {uploadingContentImage ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <FileImage className="h-4 w-4 mr-2" />
                                Add Image
                              </>
                            )}
                          </span>
                        </Button>
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {showPreview ? 'Edit' : 'Preview'}
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        {formData.reading_time} min read
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {showPreview ? (
                    <div className="border border-border rounded-md p-4 min-h-[500px] bg-background">
                      <div 
                        className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground"
                        dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(formData.content) }}
                      />
                      {!formData.content.trim() && (
                        <div className="text-muted-foreground italic">Preview will appear here as you write...</div>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`relative ${isDragOver ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <textarea
                        ref={textareaRef}
                        value={formData.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        onSelect={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          setCursorPosition(target.selectionStart);
                        }}
                        onClick={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          setCursorPosition(target.selectionStart);
                        }}
                        onKeyUp={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          setCursorPosition(target.selectionStart);
                        }}
                        rows={20}
                        className={`w-full px-3 py-2 bg-input border ${
                          errors.content ? 'border-destructive' : 'border-border'
                        } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono`}
                        placeholder="Write your article content in Markdown format...

# Main Heading

## Subheading

Your content here...

You can also drag and drop images here or click 'Add Image' button above.

```javascript
// Code blocks supported
const example = 'hello world';
```

- Bullet points
- Are supported too"
                      />
                      {isDragOver && (
                        <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-md flex items-center justify-center">
                          <div className="text-center">
                            <FileImage className="h-12 w-12 text-primary mx-auto mb-2" />
                            <p className="text-primary font-medium">Drop image here to upload</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {errors.content && (
                    <p className="text-sm text-destructive mt-1">{errors.content}</p>
                  )}
                  <div className="mt-2 text-xs text-muted-foreground">
                    <strong>Markdown formatting supported:</strong> Use # for headings, ** for bold, ``` for code blocks.
                    <br />
                    <strong>Images:</strong> Click "Add Image" or drag & drop images here. They'll be inserted at your cursor position.
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="text-lg">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant={formData.status === 'published' ? 'default' : 'secondary'}>
                      {formData.status}
                    </Badge>
                    
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="status"
                          value="draft"
                          checked={formData.status === 'draft'}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                        />
                        <span className="text-sm">Draft</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="status"
                          value="published"
                          checked={formData.status === 'published'}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                        />
                        <span className="text-sm">Published</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="text-lg">Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.featured_image ? (
                      <div className="space-y-3">
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                          <img
                            src={formData.featured_image}
                            alt="Featured image preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeFeaturedImage}
                          className="w-full"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="aspect-video bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No featured image</p>
                          </div>
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="featured-image-upload"
                            disabled={uploadingImage}
                          />
                          <label htmlFor="featured-image-upload">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full cursor-pointer"
                              disabled={uploadingImage}
                              asChild
                            >
                              <span>
                                {uploadingImage ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Image
                                  </>
                                )}
                              </span>
                            </Button>
                          </label>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Recommended: 1200x630px (16:9 ratio). Max 5MB.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedCategoryNames.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedCategoryNames.map((name) => (
                          <Badge key={name} variant="secondary">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {availableCategories.map((category) => (
                        <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.categories.includes(category.id)}
                            onChange={() => toggleCategory(category.id)}
                          />
                          <span className="text-sm">{category.name}</span>
                        </label>
                      ))}
                    </div>
                    {errors.categories && (
                      <p className="text-sm text-destructive">{errors.categories}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* SEO */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="text-lg">SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.meta_title}
                      onChange={(e) => handleInputChange('meta_title', e.target.value)}
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="SEO optimized title"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {formData.meta_title.length}/60 chars
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.meta_description}
                      onChange={(e) => handleInputChange('meta_description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="SEO description for search results"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {formData.meta_description.length}/160 chars
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}