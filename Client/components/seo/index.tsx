import React from "react";
import Head from "next/head";

interface Props {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  image?: string;
}

const SEO: React.FC<Props> = ({
  title = "DastKari",
  description = "Immerse yourself in the timeless elegance of traditional South Asian artistry, where each masterpiece is crafted with unparalleled attention to detail and cultural significance. Our collection celebrates centuries of artistic heritage, featuring authenticated pieces that blend historical grandeur with contemporary sophistication, transforming your space into a sanctuary of cultural refinement.",
  keywords = "South Asian art, heritage artifacts, Islamic calligraphy, Mughal artistry, traditional crafts, antique collectibles, Persian art, cultural artifacts, royal court pieces, historical masterpieces, authenticated antiquities, decorative arts, miniature paintings, handcrafted pieces, cultural heritage, museum-quality pieces, artistic legacy, traditional artworks, historical artifacts, palatial arts, heritage collection, Islamic art, traditional manuscripts, court paintings, antique decor, cultural treasures, artistic heirlooms, traditional patterns, historical craftsmanship, collector's pieces, architectural elements, sacred art, vintage artifacts, cultural relics, artistic heritage, traditional design, historical collectibles, heritage decor, artisanal crafts, cultural masterpieces, traditional artistry",
  author = "DastKari",
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
    </Head>
  );
};

export default SEO;
