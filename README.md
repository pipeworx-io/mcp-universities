# @pipeworx/mcp-universities

MCP server for university data — search institutions worldwide via the Hipolabs Universities API.

## Tools

| Tool | Description |
|------|-------------|
| `search_universities` | Search for universities by name and/or country |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "universities": {
      "url": "https://gateway.pipeworx.io/universities/mcp"
    }
  }
}
```

Or run via CLI:

```bash
npx pipeworx use universities
```

## License

MIT
