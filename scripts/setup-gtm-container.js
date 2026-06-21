/**
 * Programmatic sGTM Web Container Setup Script
 * Uses Application Default Credentials (ADC) from gcloud to configure GTM-TSG26723.
 */

const { google } = require('googleapis');

const GTM_ID_TO_FIND = 'GTM-TSG26723';
const SGTM_URL = 'https://sgtm.tovy.eu';
const GA4_MEASUREMENT_ID = 'G-ESH71F3XK7';

const auth = new google.auth.GoogleAuth({
  scopes: [
    'https://www.googleapis.com/auth/tagmanager.readonly',
    'https://www.googleapis.com/auth/tagmanager.edit.containers'
  ],
});

const tagmanager = google.tagmanager({
  version: 'v2',
  auth,
});

async function run() {
  try {
    console.log("🔄 Authenticating via Google Application Default Credentials...");
    
    // 1. List GTM Accounts
    console.log("📂 Fetching GTM Accounts...");
    const accountsRes = await tagmanager.accounts.list();
    const accounts = accountsRes.data.account || [];
    
    if (accounts.length === 0) {
      console.error("❌ No Google Tag Manager accounts found for this authenticated user.");
      process.exit(1);
    }

    let targetContainer = null;
    let targetAccount = null;

    // 2. Find target container GTM-TSG26723 across all accounts
    for (const acct of accounts) {
      console.log(`🔍 Checking account: ${acct.name} (${acct.accountId})...`);
      const containersRes = await tagmanager.accounts.containers.list({
        parent: `accounts/${acct.accountId}`
      });
      const containers = containersRes.data.container || [];
      
      const found = containers.find(c => c.publicId === GTM_ID_TO_FIND);
      if (found) {
        targetContainer = found;
        targetAccount = acct;
        break;
      }
    }

    if (!targetContainer) {
      console.error(`❌ Container with ID ${GTM_ID_TO_FIND} was not found in any GTM account.`);
      process.exit(1);
    }

    console.log(`\n🎉 Found Container: ${targetContainer.name} (${targetContainer.publicId})`);
    console.log(`   Path: ${targetContainer.path}\n`);

    // 3. Find or Create a Workspace
    console.log("📂 Checking existing workspaces...");
    const workspacesRes = await tagmanager.accounts.containers.workspaces.list({
      parent: targetContainer.path
    });
    const workspaces = workspacesRes.data.workspace || [];
    
    let workspace = workspaces.find(w => w.name === "sGTM Migration Workspace" || w.name === "Default Workspace");
    
    if (!workspace) {
      console.log("➕ Creating new Workspace: 'sGTM Migration Workspace'...");
      const createWS = await tagmanager.accounts.containers.workspaces.create({
        parent: targetContainer.path,
        requestBody: {
          name: "sGTM Migration Workspace",
          description: "Automated workspace for sGTM and GA4 event tracking migration."
        }
      });
      workspace = createWS.data;
    } else {
      console.log(`✅ Using Workspace: ${workspace.name}`);
    }

    const parentPath = workspace.path;

    // 4. Create Custom Data Layer Variables
    const variablesToCreate = [
      { name: 'dlv - visitor_id', dlvName: 'visitor_id' },
      { name: 'dlv - page_category', dlvName: 'page_category' },
      { name: 'dlv - session_id', dlvName: 'session_id' }
    ];

    // Fetch existing variables first
    const existingVarsRes = await tagmanager.accounts.containers.workspaces.variables.list({
      parent: parentPath
    });
    const existingVars = existingVarsRes.data.variable || [];

    for (const v of variablesToCreate) {
      const alreadyExists = existingVars.some(ev => ev.name === v.name);
      if (alreadyExists) {
        console.log(`ℹ️ Variable '${v.name}' already exists.`);
        continue;
      }

      console.log(`➕ Creating Variable: ${v.name}...`);
      await tagmanager.accounts.containers.workspaces.variables.create({
        parent: parentPath,
        requestBody: {
          name: v.name,
          type: 'dlw',
          parameter: [
            { type: 'template', key: 'name', value: v.dlvName },
            { type: 'template', key: 'version', value: '2' }
          ]
        }
      });
    }

    // 5. Create Custom Consent Trigger
    const existingTriggersRes = await tagmanager.accounts.containers.workspaces.triggers.list({
      parent: parentPath
    });
    const existingTriggers = existingTriggersRes.data.trigger || [];
    let consentTrigger = existingTriggers.find(t => t.name === "Event - Consent Given");

    if (!consentTrigger) {
      console.log("➕ Creating Trigger: Event - Consent Given...");
      const createdTrigger = await tagmanager.accounts.containers.workspaces.triggers.create({
        parent: parentPath,
        requestBody: {
          name: "Event - Consent Given",
          type: 'customEvent',
          customEventFilter: [
            {
              type: 'equals',
              parameter: [
                { type: 'template', key: 'arg0', value: 'consent_given' }
              ]
            }
          ]
        }
      });
      consentTrigger = createdTrigger.data;
    } else {
      console.log("ℹ️ Trigger 'Event - Consent Given' already exists.");
    }

    // 6. Create Google Tag (GA4 Configuration)
    const existingTagsRes = await tagmanager.accounts.containers.workspaces.tags.list({
      parent: parentPath
    });
    const existingTags = existingTagsRes.data.tag || [];
    
    // Look for a tag matching our GA4 Measurement ID or name
    let googleTag = existingTags.find(t => t.name === "GA4 - Google Tag (static-website)" || t.name === "static-website" || t.parameter?.some(p => p.key === 'tagId' && p.value === GA4_MEASUREMENT_ID));

    const googleTagConfig = {
      name: googleTag ? googleTag.name : "GA4 - Google Tag (static-website)",
      type: 'googtag',
      parameter: [
        { type: 'template', key: 'tagId', value: GA4_MEASUREMENT_ID },
        { 
          type: 'list', 
          key: 'configSettings', 
          list: [
            {
              type: 'map',
              map: [
                { type: 'template', key: 'parameterName', value: 'server_container_url' },
                { type: 'template', key: 'parameterValue', value: SGTM_URL }
              ]
            }
          ]
        },
        {
          type: 'list',
          key: 'eventSettings',
          list: [
            {
              type: 'map',
              map: [
                { type: 'template', key: 'parameterName', value: 'visitor_id' },
                { type: 'template', key: 'parameterValue', value: '{{dlv - visitor_id}}' }
              ]
            },
            {
              type: 'map',
              map: [
                { type: 'template', key: 'parameterName', value: 'page_category' },
                { type: 'template', key: 'parameterValue', value: '{{dlv - page_category}}' }
              ]
            },
            {
              type: 'map',
              map: [
                { type: 'template', key: 'parameterName', value: 'session_id' },
                { type: 'template', key: 'parameterValue', value: '{{dlv - session_id}}' }
              ]
            }
          ]
        }
      ],
      firingTriggerId: [consentTrigger.triggerId]
    };

    if (googleTag) {
      console.log(`➕ Updating existing Google Tag: ${googleTag.name}...`);
      await tagmanager.accounts.containers.workspaces.tags.update({
        path: googleTag.path,
        requestBody: googleTagConfig
      });
    } else {
      console.log("➕ Creating new GA4 Google Tag with sGTM Routing...");
      await tagmanager.accounts.containers.workspaces.tags.create({
        parent: parentPath,
        requestBody: googleTagConfig
      });
    }

    console.log("\n🎉 GTM Web Container automated configuration completed successfully! ✅");
    
  } catch (error) {
    if (error.message && error.message.includes("Could not load the default credentials")) {
      console.error("\n❌ Authentication Error: Please run the following command in your terminal to authenticate first:");
      console.error("\n   gcloud auth application-default login --scopes=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/tagmanager.edit.containers\n");
    } else {
      console.error("❌ Error running GTM Automation setup:", error);
    }
  }
}

run();
