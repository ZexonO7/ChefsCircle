
const LoadingState = () => {
  return (
    <section className="py-16 md:py-24 bg-chef-warm-ivory">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chef-royal-blue mx-auto mb-4"></div>
            <p className="text-chef-charcoal">Loading your culinary progress...</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoadingState;
