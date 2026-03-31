interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Universities MCP — Hipolabs Universities API (free, no auth)
 *
 * Tools:
 * - search_universities: search universities by name and/or country
 */


const BASE_URL = 'http://universities.hipolabs.com';

const tools: McpToolExport['tools'] = [
  {
    name: 'search_universities',
    description:
      'Search for universities by name and/or country. Returns university names, countries, web pages, and domains. Both parameters are optional but at least one should be provided.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'University name or partial name (e.g., "Harvard", "MIT")' },
        country: { type: 'string', description: 'Country name to filter by (e.g., "United States", "United Kingdom")' },
      },
    },
  },
];

interface RawUniversity {
  name: string;
  country: string;
  'alpha_two_code': string;
  'state-province': string | null;
  domains: string[];
  web_pages: string[];
}

function formatUniversity(raw: RawUniversity) {
  return {
    name: raw.name,
    country: raw.country,
    country_code: raw['alpha_two_code'],
    state_province: raw['state-province'] ?? null,
    domains: raw.domains,
    web_pages: raw.web_pages,
  };
}

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_universities': {
      const nameQuery = args.name as string | undefined;
      const countryQuery = args.country as string | undefined;

      if (!nameQuery && !countryQuery) {
        throw new Error('At least one of "name" or "country" must be provided');
      }

      const params = new URLSearchParams();
      if (nameQuery) params.set('name', nameQuery);
      if (countryQuery) params.set('country', countryQuery);

      const res = await fetch(`${BASE_URL}/search?${params}`);
      if (!res.ok) throw new Error(`Hipolabs Universities API error: ${res.status}`);
      const data = (await res.json()) as RawUniversity[];
      return {
        count: data.length,
        universities: data.map(formatUniversity),
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies McpToolExport;
