export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const ServicesPartsFragmentDoc = gql`
    fragment ServicesParts on Services {
  __typename
  items {
    __typename
    slug
    title
    headline
    summary
    image
    sections {
      __typename
      title
      text
      items
    }
    question
    cta
    group
    imageAlt
    intro
    benefits
    brands
    related
    source
  }
}
    `;
export const EditorialPartsFragmentDoc = gql`
    fragment EditorialParts on Editorial {
  __typename
  items {
    __typename
    slug
    title
    headline
    summary
    image
    sections {
      __typename
      title
      text
      items
    }
    question
    cta
    kind
  }
}
    `;
export const HomepagePartsFragmentDoc = gql`
    fragment HomepageParts on Homepage {
  __typename
  hero {
    __typename
    regel1
    regel2
    nadruk
    tekst
    knop
    bewijs
  }
  delen {
    __typename
    naam
    titel
    tekst
    punten
    link
    knop
    film
    foto
    fotoTekst
  }
  ploeg {
    __typename
    titel
    tekst
    fotoNoot
    googleLink
    mensen {
      __typename
      naam
      vak
    }
  }
  meter {
    __typename
    titel
    tekst
    slotTitel
    slotTekst
    knop
  }
}
    `;
export const ReviewsPartsFragmentDoc = gql`
    fragment ReviewsParts on Reviews {
  __typename
  gemiddelde
  aantal
  items {
    __typename
    klant
    tekst
    sterren
    over
  }
}
    `;
export const PrivacyPartsFragmentDoc = gql`
    fragment PrivacyParts on Privacy {
  __typename
  titel
  intro
  bijgewerkt
  secties {
    __typename
    titel
    tekst
  }
}
    `;
export const CookiesPartsFragmentDoc = gql`
    fragment CookiesParts on Cookies {
  __typename
  titel
  intro
  bijgewerkt
  secties {
    __typename
    titel
    tekst
  }
}
    `;
export const VoorwaardenPartsFragmentDoc = gql`
    fragment VoorwaardenParts on Voorwaarden {
  __typename
  titel
  versie
  artikels {
    __typename
    nr
    titel
    leden {
      __typename
      nr
      tekst
    }
  }
}
    `;
export const ServicesDocument = gql`
    query services($relativePath: String!) {
  services(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ServicesParts
  }
}
    ${ServicesPartsFragmentDoc}`;
export const ServicesConnectionDocument = gql`
    query servicesConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ServicesFilter) {
  servicesConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ServicesParts
      }
    }
  }
}
    ${ServicesPartsFragmentDoc}`;
export const EditorialDocument = gql`
    query editorial($relativePath: String!) {
  editorial(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...EditorialParts
  }
}
    ${EditorialPartsFragmentDoc}`;
export const EditorialConnectionDocument = gql`
    query editorialConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: EditorialFilter) {
  editorialConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...EditorialParts
      }
    }
  }
}
    ${EditorialPartsFragmentDoc}`;
export const HomepageDocument = gql`
    query homepage($relativePath: String!) {
  homepage(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...HomepageParts
  }
}
    ${HomepagePartsFragmentDoc}`;
export const HomepageConnectionDocument = gql`
    query homepageConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: HomepageFilter) {
  homepageConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...HomepageParts
      }
    }
  }
}
    ${HomepagePartsFragmentDoc}`;
export const ReviewsDocument = gql`
    query reviews($relativePath: String!) {
  reviews(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ReviewsParts
  }
}
    ${ReviewsPartsFragmentDoc}`;
export const ReviewsConnectionDocument = gql`
    query reviewsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ReviewsFilter) {
  reviewsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ReviewsParts
      }
    }
  }
}
    ${ReviewsPartsFragmentDoc}`;
export const PrivacyDocument = gql`
    query privacy($relativePath: String!) {
  privacy(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PrivacyParts
  }
}
    ${PrivacyPartsFragmentDoc}`;
export const PrivacyConnectionDocument = gql`
    query privacyConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PrivacyFilter) {
  privacyConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PrivacyParts
      }
    }
  }
}
    ${PrivacyPartsFragmentDoc}`;
export const CookiesDocument = gql`
    query cookies($relativePath: String!) {
  cookies(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...CookiesParts
  }
}
    ${CookiesPartsFragmentDoc}`;
export const CookiesConnectionDocument = gql`
    query cookiesConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: CookiesFilter) {
  cookiesConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...CookiesParts
      }
    }
  }
}
    ${CookiesPartsFragmentDoc}`;
export const VoorwaardenDocument = gql`
    query voorwaarden($relativePath: String!) {
  voorwaarden(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...VoorwaardenParts
  }
}
    ${VoorwaardenPartsFragmentDoc}`;
export const VoorwaardenConnectionDocument = gql`
    query voorwaardenConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: VoorwaardenFilter) {
  voorwaardenConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...VoorwaardenParts
      }
    }
  }
}
    ${VoorwaardenPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    services(variables, options) {
      return requester(ServicesDocument, variables, options);
    },
    servicesConnection(variables, options) {
      return requester(ServicesConnectionDocument, variables, options);
    },
    editorial(variables, options) {
      return requester(EditorialDocument, variables, options);
    },
    editorialConnection(variables, options) {
      return requester(EditorialConnectionDocument, variables, options);
    },
    homepage(variables, options) {
      return requester(HomepageDocument, variables, options);
    },
    homepageConnection(variables, options) {
      return requester(HomepageConnectionDocument, variables, options);
    },
    reviews(variables, options) {
      return requester(ReviewsDocument, variables, options);
    },
    reviewsConnection(variables, options) {
      return requester(ReviewsConnectionDocument, variables, options);
    },
    privacy(variables, options) {
      return requester(PrivacyDocument, variables, options);
    },
    privacyConnection(variables, options) {
      return requester(PrivacyConnectionDocument, variables, options);
    },
    cookies(variables, options) {
      return requester(CookiesDocument, variables, options);
    },
    cookiesConnection(variables, options) {
      return requester(CookiesConnectionDocument, variables, options);
    },
    voorwaarden(variables, options) {
      return requester(VoorwaardenDocument, variables, options);
    },
    voorwaardenConnection(variables, options) {
      return requester(VoorwaardenConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
