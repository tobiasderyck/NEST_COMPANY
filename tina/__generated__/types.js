export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const SitePartsFragmentDoc = gql`
    fragment SiteParts on Site {
  __typename
  merk {
    __typename
    naam
    naamVervolg
    telefoon
    telefoonLink
    email
    paginaTitel
    paginaOmschrijving
    deelTitel
    deelOmschrijving
    deelBeeld
  }
  menu {
    __typename
    label
    anker
  }
  knopBoven
  laadscherm {
    __typename
    naam
    stap1
    stap2
    stap3
    klaar
  }
  film {
    __typename
    rail {
      __typename
      label
    }
    hero {
      __typename
      kicker
      titelRegel1
      titelRegel2
      ondertitel
      ondertitelAccent
      voetLinks
      voetMidden
      voetRechts
    }
    aktes {
      __typename
      kicker
      titel
      titelAccent
      tekst
      start
      einde
    }
    slot {
      __typename
      kicker
      titel
      titelAccent
      knop
      start
      einde
    }
  }
  statement {
    __typename
    regel1
    regel2
    regel2Accent
    onderschrift
  }
  diensten {
    __typename
    kicker
    titel
    titelAccent
    items {
      __typename
      nummer
      titel
      subtitel
      beeld
    }
  }
  voorna {
    __typename
    kicker
    titel
    titelAccent
    beeldVoor
    beeldVoorAlt
    beeldNa
    beeldNaAlt
    labelVoor
    labelNa
    hint
  }
  realisaties {
    __typename
    kicker
    titel
    titelAccent
    items {
      __typename
      beeld
      tag
      titel
      alt
    }
    hint
    hintLinkTekst
    hintLink
  }
  aanpak {
    __typename
    kicker
    titel
    titelAccent
    stappen {
      __typename
      nummer
      titel
      tekst
    }
    cijfers {
      __typename
      waarde
      label
      telOp
    }
  }
  calculator {
    __typename
    kicker
    titel
    titelAccent
    knop
    link
  }
  contact {
    __typename
    kicker
    titel
    titelAccent
    tekst
    adres
  }
  voet {
    __typename
    links
    midden
    rechts
  }
}
    `;
export const SiteDocument = gql`
    query site($relativePath: String!) {
  site(relativePath: $relativePath) {
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
    ...SiteParts
  }
}
    ${SitePartsFragmentDoc}`;
export const SiteConnectionDocument = gql`
    query siteConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: SiteFilter) {
  siteConnection(
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
        ...SiteParts
      }
    }
  }
}
    ${SitePartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    site(variables, options) {
      return requester(SiteDocument, variables, options);
    },
    siteConnection(variables, options) {
      return requester(SiteConnectionDocument, variables, options);
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
