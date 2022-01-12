import * as github from '@actions/github';
import * as core from '@actions/core';
import {getArtifactsForBranchAndWorkflow} from './getArtifactsForBranchAndWorkflow';

async function run(): Promise<void> {
  const token = core.getInput('github-token');
  const octokit = token && github.getOctokit(token);

  if (!octokit) {
    const error = new Error('`inputs.github-token` missing');
    throw error;
  }

  //
  // Get inputs
  //

  const {owner, repo} = github.context.repo;
  const branch = core.getInput('branch');
  const workflow_id = core.getInput('workflow') || process.env.GITHUB_WORKFLOW || '';
  const artifactName = core.getInput('artifact');


  if (!artifactName) {
    throw new Error('No artifact name provided');
  }

  try {

    const resp = await getArtifactsForBranchAndWorkflow(octokit, {
      owner,
      repo,
      branch,
      workflow_id,
      artifactName,
    });


    core.debug(`Artifact url: ${resp?.artifact.url}`);
  } catch (error) {
    if (error instanceof Error) {core.setFailed(error.message)}
  }
}

run();
