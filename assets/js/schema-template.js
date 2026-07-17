window.AgriCalc = window.AgriCalc || {};
window.AgriCalc.schema = {
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AgriCalc Pakistan',
    url: 'https://agricalcpakistan.github.io/',
    description: 'Smart agriculture calculators and guides for Pakistani farmers.',
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://agricalcpakistan.github.io/search.html?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  },
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AgriCalc Pakistan',
    url: 'https://agricalcpakistan.github.io/',
    logo: 'https://agricalcpakistan.github.io/assets/images/logo/favicon.svg',
    description: 'AgriCalc Pakistan provides farming calculators, guides, and practical agriculture resources for Pakistan.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'mailto:jk6355686@gmail.com',
      telephone: '+923015057401'
    },
    sameAs: []
  }
};
