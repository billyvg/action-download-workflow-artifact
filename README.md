# action-download-workflow-artifact [![test](https://github.com/billyvg/action-download-workflow-artifact/actions/workflows/test.yml/badge.svg?event=push)](https://github.com/billyvg/action-download-workflow-artifact/actions/workflows/test.yml)

A GitHub action to download an artifact from a different branch and/or workflow. If you have tried to use https://github.com/actions/download-artifact or [@actions/artifact](https://www.npmjs.com/package/@actions/artifact) you'll realize their limitations for downloading artifacts.


*NOTE* This currently relies on `wget` and `unzip` when downloading and extracting the artifact archive. This means it probably won't run on Windows runners.

## Usage

```yml
- uses: action-download-workflow-artifact@v1
  with:
    artifact: integration-test-artifact
    branch: main
    workflow: 'integration test setup'
    path: download
```

## Inputs

| name | description | default value |
| ---- | ----------- | ------------- |
| `artifact` | The name of the artifact to download | |
| `branch` | The branch to download artifact from | `main` |
| `github-token` | GitHub token | `${{ github.token }}` |
| `ignoreError` | Does not fail on errors if non-empty. This is to work-around `continue-on-error` not existing for composite actions. | `''` |
| `path` | The path to download the artifact to | |
| `workflow` | The *name* of the workflow to download the artifact from. Note this is the human readable name and not the filename. | The workflow that uses this action |


## Outputs

| name | description |
| ---- | ----------- |
| `result` | One of `success` or `failed` |
