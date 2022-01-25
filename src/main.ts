import * as github from '@actions/github';
import * as core from '@actions/core';

import download from 'github-fetch-workflow-artifact';

async function run(): Promise<void> {
  const token = core.getInput('github-token');
  const octokit = token && github.getOctokit(token);

  if (!octokit) {
    throw new Error('`inputs.github-token` missing');
  }

  //
  // Get inputs
  //
  const {owner, repo} = github.context.repo;
  const branch = core.getInput('branch');
  const workflowName =
    core.getInput('workflow') || process.env.GITHUB_WORKFLOW || '';
  const workflowEvent = core.getInput('workflowEvent');
  const artifactName = core.getInput('artifact');
  const downloadPath = core.getInput('path');
  const ignoreError = !!core.getInput('ignoreError');

  if (!artifactName) {
    throw new Error('No artifact name provided');
  }

  try {
    await download(octokit, {
      owner,
      repo,
      branch,
      workflowName,
      workflowEvent,
      artifactName,
      downloadPath,
    });
  } catch (error) {
    if (!(error instanceof Error)) {
      return;
    }

    if (ignoreError) {
      return;
    }

    core.setFailed(error.message);
  }
}

run();
