/* eslint-env node */
import path from 'path';

import {exec} from '@actions/exec';
import * as github from '@actions/github';
import * as io from '@actions/io';

type DownloadArtifactParams = {
  owner: string;
  repo: string;
  artifactId: number;
  artifactName: string;
  downloadPath: string;
};

/**
 * Use GitHub API to fetch artifact download url, then
 * download and extract artifact to `downloadPath`
 */
export async function download(
  octokit: ReturnType<typeof github.getOctokit>,
  {owner, repo, artifactId, artifactName, downloadPath}: DownloadArtifactParams
): Promise<void> {
  // Need to generate an artifact download URL... see
  // https://docs.github.com/en/rest/reference/actions#download-an-artifact
  const artifact = await octokit.actions.downloadArtifact({
    owner,
    repo,
    artifact_id: artifactId,
    archive_format: 'zip',
  });

  // Make sure output path exists
  try {
    await io.mkdirP(downloadPath);
  } catch {
    // Don't care about errors making dir
  }

  const downloadFile = path.resolve(downloadPath, `${artifactName}.zip`);

  // Ideally we would use @actions/artifact package here but it is not flexible
  // enough and I can't dig into their code atm.
  //
  // This also means we can only support runners that have `wget` and `unzip`
  // (i.e. probably not Windows)
  await exec('wget', [
    '-nv',
    '--retry-connrefused',
    '--waitretry=1',
    '--read-timeout=20',
    '--timeout=15',
    '-t',
    '0',
    '-O',
    downloadFile,
    artifact.url,
  ]);

  await exec('unzip', ['-q', '-d', downloadPath, downloadFile], {
    silent: true,
  });
}
