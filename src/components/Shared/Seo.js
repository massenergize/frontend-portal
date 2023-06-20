import { Helmet } from "react-helmet";
import React from "react";

const Seo = ({
  title,
  description,
  site_name,
  url,
  image,
  keywords,
  updated_at,
  created_at,
  tags,
}) => {
  return (
    <Helmet>
      <title>{`${site_name} | ${title}`}</title>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
      />
      <meta property="og:title" content={`${site_name} | ${title}`} />
      <meta property="og:image" content={image} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={site_name || title} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={`${site_name} | ${title}`} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      <meta name="twitter:title" content={`${site_name} | ${title}`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image:src" content={image} />

      <meta name="description" content={description} />
      <meta itemprop="name" content={`${site_name} | ${title}`} />
      <meta itemprop="description" content={description} />
      <meta itemprop="image" content={image} />

      <meta property="article:published_time" content={created_at} />
      <meta property="article:modified_time" content={updated_at} />
      <meta property="article:section" content={`${site_name} | ${title}`} />
      <meta name="keywords" content={keywords?.join()} />
      {(tags || []).map((name, i) => (
        <meta key={i} property="article:tag" content={name} />
      ))}
    </Helmet>
  );
};

export default Seo;
