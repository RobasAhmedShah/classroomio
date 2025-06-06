import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  head: (
    <>
      <title>Learnova | The Open Source Learning Management System for Companies</title>
      <meta
        name="description"
        content="A flexible, user-friendly platform for creating, managing, and delivering courses for companies and training organisations"
      />

      <meta property="og:url" content="https://peopletalk.io/docs" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="Learnova | The Open Source Learning Management System for Companies"
      />
      <meta
        property="og:description"
        content="A flexible, user-friendly platform for creating, managing, and delivering courses for companies and training organisations"
      />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1920" />
      <meta property="og:image:height" content="1080" />
      <meta
        property="og:image:secure_url"
        itemProp="image"
        content="https://brand.cdn.clsrio.com/og/Learnova-og.png"
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="Learnova.com" />
      <meta property="twitter:url" content="https://peopletalk.io/docs" />
      <meta
        name="twitter:title"
        content="Learnova | The Open Source Learning Management System for Companies"
      />
      <meta
        name="twitter:description"
        content="A flexible, user-friendly platform for creating, managing, and delivering courses for companies and training organisations"
      />
      <meta name="twitter:creator" content="@Learnova" />
      <meta name="twitter:image" content="https://brand.cdn.clsrio.com/og/Learnova-og.png" />
    </>
  ),
  logo: (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={`${process.env.imagePath}/img/logo-512.png`}
        alt={'Learnova logo'}
        width={32}
        height={32}
      />
      <span style={{ marginLeft: '5px', lineHeight: '15px' }}>Learnova Docs</span>
    </div>
  ),
  navbar: {
    extraContent: (
      <a
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid gray',
          borderRadius: 5,
          padding: '2px 7px'
        }}
        href="https://peopletalk.io"
      >
        Dashboard ↗
      </a>
    )
  },
  project: {
    link: 'https://github.com/rotimi-best/Learnova'
  },
  chat: {
    link: 'https://dub.sh/ciodiscord'
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    autoCollapse: false
  },
  docsRepositoryBase: 'https://github.com/rotimi-best/Learnova/tree/main/apps/docs',
  footer: {
    text: 'Learnova Docs'
  }
};

export default config;
