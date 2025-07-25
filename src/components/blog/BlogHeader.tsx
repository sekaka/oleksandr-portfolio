export function BlogHeader() {
  return (
    <section className="gradient-bg py-10 lg:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            <span className="gradient-text">Technical Blog</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            In-depth articles about modern web development, architecture decisions, 
            and technical insights from the field.
          </p>
        </div>
      </div>
    </section>
  );
}