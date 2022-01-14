import * as github from '@actions/github';
import * as core from '@actions/core';
import {getArtifactsForBranchAndWorkflow} from './getArtifactsForBranchAndWorkflow';
import {download} from './download';

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
  const artifactName = core.getInput('artifact');
  const downloadPath = core.getInput('path');

  if (!artifactName) {
    throw new Error('No artifact name provided');
  }

  try {
    // Need to do a bunch of API calls to actually find artifacts for this
    // workflow that have previously been run (e.g. on a different branch)
    const resp = await getArtifactsForBranchAndWorkflow(octokit, {
      owner,
      repo,
      branch,
      workflowName,
      artifactName,
    });

    if (!resp?.artifact) {
      core.setFailed('Unable to find artifact');
      return;
    }

    core.debug(`Artifact url: ${resp?.artifact.url}`);

    await download(octokit, {
      owner,
      repo,
      artifactId: resp.artifact.id,
      artifactName,
      downloadPath,
    });
  } catch (error) {
    if (!(error instanceof Error)) {
      return;
    }

    core.setFailed(error.message);
  }
}

run();
