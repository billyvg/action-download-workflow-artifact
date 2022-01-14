<p>
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# action-download-workflow-artifact

A GitHub action to download an artifact from a different branch and/or workflow. If you have tried to use https://github.com/actions/download-artifact or [@actions/artifact](https://www.npmjs.com/package/@actions/artifact) you'll realize their limitations for downloading artifacts.



## Usage

```yml
- uses: action-download-workflow-artifact@v0
  with:
    artifact: integration-test-artifact
    branch: main
    workflow: 'integration test setup'
    path: download
```

## Inputs

| name | description | default value |
| ---- | ----------- | ------------- |
| artifact | The name of the artifact to download | |
| branch | The branch to download artifact from | main |
| github-token | GitHub token | `${{ github.token }}` |
| path | The path to download the artifact to | |
| workflow | The *name* of the workflow to download the artifact from. Note this is the human readable name and not the filename. | The workflow that uses this action |
