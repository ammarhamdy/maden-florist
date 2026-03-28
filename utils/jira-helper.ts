import axios from 'axios';


const JIRA_BASE_URL = process.env.JIRA_BASE_URL!;       // e.g. https://yourcompany.atlassian.net
const JIRA_EMAIL = process.env.JIRA_EMAIL!;              // your Atlassian account email
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN!;      // API token from id.atlassian.com
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY!;  // e.g. QA, BUG, TEST



const getAuthHeader = () =>
  `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`;

// Call this once to see what issue types your project supports
export async function listIssueTypes(): Promise<void> {
  const response = await axios.get(
    `${JIRA_BASE_URL}/rest/api/3/project/${JIRA_PROJECT_KEY}`,
    {
      headers: {
        Authorization: getAuthHeader(),
        'Content-Type': 'application/json',
      },
    }
  );
  console.log('Available issue types:', JSON.stringify(response.data.issueTypes, null, 2));
}


/*
Available issue types: [
  {
    "self": "https://ammarhamdy010-1770708878228.atlassian.net/rest/api/3/issuetype/10001",
    "id": "10001",
    "description": "Tasks track small, distinct pieces of work.",
    "iconUrl": "https://ammarhamdy010-1770708878228.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium",
    "name": "Task",
    "subtask": false,
    "avatarId": 10318,
    "hierarchyLevel": 0
  },
  {
    "self": "https://ammarhamdy010-1770708878228.atlassian.net/rest/api/3/issuetype/10002",
    "id": "10002",
    "description": "Epics track collections of related bugs, stories, and tasks.",
    "iconUrl": "https://ammarhamdy010-1770708878228.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10307?size=medium",
    "name": "Epic",
    "subtask": false,
    "avatarId": 10307,
    "hierarchyLevel": 1
  },
  {
    "self": "https://ammarhamdy010-1770708878228.atlassian.net/rest/api/3/issuetype/10003",
    "id": "10003",
    "description": "Subtasks track small pieces of work that are part of a larger task.",
    "iconUrl": "https://ammarhamdy010-1770708878228.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10316?size=medium",
    "name": "Subtask",
    "subtask": true,
    "avatarId": 10316,
    "hierarchyLevel": -1
  },
  {
    "self": "https://ammarhamdy010-1770708878228.atlassian.net/rest/api/3/issuetype/10069",
    "id": "10069",
    "description": "Bugs track problems or errors.",
    "iconUrl": "https://ammarhamdy010-1770708878228.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10303?size=medium",
    "name": "Bug",
    "subtask": false,
    "avatarId": 10303,
    "hierarchyLevel": 0
  }
]
*/


export async function createJiraBug(
  testTitle: string,
  errorMessage: string
): Promise<void> {
  const issuePayload = {
    fields: {
      project: {
        key: JIRA_PROJECT_KEY,
      },
      summary: `[Playwright Failure] ${testTitle}`,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `Test "${testTitle}" failed with the following error:`,
              },
            ],
          },
          {
            type: 'codeBlock',
            content: [
              {
                type: 'text',
                text: errorMessage,
              },
            ],
          },
        ],
      },
      issuetype: {
        name: 'Bug',  
        id: "10069",
      },
      priority: {
        name: 'High',
      },
      labels: ['playwright', 'automated-test-failure'],
    },
  };

  try {
    const response = await axios.post(
      `${JIRA_BASE_URL}/rest/api/3/issue`,
      issuePayload,
      {
        headers: {
          Authorization: getAuthHeader(),
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`Jira bug created: ${JIRA_BASE_URL}/browse/${response.data.key}`);
  } catch (error: any) {
    console.error('❌ Failed to create Jira bug:', error.response?.data || error.message);
  }
}