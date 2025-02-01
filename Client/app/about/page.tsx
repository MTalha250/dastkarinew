import React from "react";
import Faqs from "@/components/home/faqs";
import SEO from "@/components/seo";

const AboutUs = () => {
  return (
    <>
      <SEO
        title="About Us | DastKari"
        description="At DastKari, we preserve and celebrate South Asian cultural heritage through carefully curated artifacts, textiles, and artworks. Our collection represents centuries of artistic excellence and craftsmanship."
      />
      <div className="bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="pt-32 pb-10 px-6 md:px-12 lg:px-24">
          {/* Hero Section */}
          <section className="mb-16">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 px-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide mb-4 text-amber-900">
                  About DastKari
                </h1>
                <p className="text-lg text-amber-800 leading-relaxed">
                  At DastKari, we are custodians of South Asian cultural heritage,
                  dedicated to preserving and sharing the magnificent artistry of our
                  ancestors. Our carefully curated collection spans centuries,
                  featuring authentic artifacts, textiles, and artworks that embody
                  the pinnacle of craftsmanship.
                </p>
              </div>
              <div className="w-full md:w-1/2 mt-8 md:mt-0">
                <img
                  src="/about/heritage-1.jpg"
                  alt="Heritage Artifacts"
                  className="w-full object-cover rounded-lg shadow-lg h-[300px]"
                />
              </div>
            </div>
          </section>

          {/* Heritage Section */}
          <section className="mb-16">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col-reverse md:flex-row items-center justify-between">
                <div className="w-full md:w-1/2 px-6">
                  <img
                    src="/about/heritage-2.png"
                    alt="Cultural Heritage"
                    className="w-full object-cover rounded-lg shadow-lg h-[300px]"
                  />
                </div>
                <div className="w-full md:w-1/2 mb-8 md:mb-0 px-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide mb-4 text-amber-900">
                    Our Heritage
                  </h2>
                  <p className="text-md text-amber-800 leading-relaxed">
                    Our journey began with a profound appreciation for the artistic
                    legacy of South Asia. We collaborate with master artisans,
                    historians, and cultural institutions to bring you authentic
                    pieces that represent the finest examples of traditional
                    craftsmanship, from intricate Mughal miniatures to masterful
                    Persian calligraphy.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="mb-16">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide mb-6 text-amber-900">
                Our Mission
              </h2>
              <p className="text-amber-800 leading-relaxed max-w-4xl mx-auto">
                We are committed to preserving and promoting the rich cultural
                heritage of South Asia through our carefully selected collection of
                artifacts and artworks. Each piece in our collection tells a story
                of artistic excellence, cultural significance, and historical
                importance. We strive to connect contemporary audiences with the
                masterful craftsmanship of our ancestors, ensuring these traditions
                continue to inspire future generations.
              </p>
            </div>
          </section>

          {/* Stats Section */}
          <section>
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-serif tracking-wide mb-6 text-amber-900">
                DastKari by the Numbers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-lg border border-amber-200">
                  <h3 className="text-xl md:text-2xl font-serif text-amber-900 mb-4">
                    100+ Years
                  </h3>
                  <p className="text-md text-amber-800">
                    Of combined expertise in cultural artifacts
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg border border-amber-200">
                  <h3 className="text-xl md:text-2xl font-serif text-amber-900 mb-4">
                    1000+
                  </h3>
                  <p className="text-md text-amber-800">
                    Authenticated artifacts in our collection
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg border border-amber-200">
                  <h3 className="text-xl md:text-2xl font-serif text-amber-900 mb-4">
                    30+
                  </h3>
                  <p className="text-md text-amber-800">
                    Master artisans and experts we work with
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* <Faqs /> */}
    </>
  );
};

export default AboutUs;