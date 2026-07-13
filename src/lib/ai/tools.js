export const TOOL_DEFINITIONS = [
  {
    type: "function",
    function: {
      name: "navigate_section",
      description: "Navigate the portfolio to a specific section",
      parameters: {
        type: "object",
        properties: {
          section_id: {
            type: "string",
            enum: ["about", "projects", "experience", "skills", "contact"],
            description: "The section to navigate to",
          },
        },
        required: ["section_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "set_theme",
      description: "Change the color theme of the portfolio",
      parameters: {
        type: "object",
        properties: {
          theme_id: {
            type: "string",
            enum: [
              "tokyo-night", "catppuccin", "rose-pine", "gruvbox", "nord",
              "dracula", "one-dark", "solarized", "everforest", "monokai",
              "tomorrow-night-burns",
            ],
            description: "The theme ID to apply",
          },
        },
        required: ["theme_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "open_link",
      description: "Open an external link in a new tab",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "The URL to open",
          },
          label: {
            type: "string",
            description: "Human-readable name shown in the status flash",
          },
        },
        required: ["url"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_github_activity",
      description: "Fetch Ayaan's recent public GitHub activity (commits, PRs, issues, new repos). Use when asked what Ayaan has been working on / up to recently, or about his recent commits/GitHub activity.",
      parameters: {
        type: "object",
        properties: {
          days: {
            type: "integer",
            description: "Lookback window in days, default 7, max 30",
          },
        },
        required: [],
      },
    },
  },
];
