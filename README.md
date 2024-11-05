# Html Reports (BlakYaks.azure-pipeline-html-reports)

An Azure DevOps extension that provides a task for publishing report in a HTML format and embeds it into a Build and Release pages.

## Using the extension

In order to see a report tab you must use the  `Publish HTML Report` task. This is a supporting task which adds HTML output from the build pipeline(s) for viewing.

The task takes one mandatory parameter `reportDir` which should reference the HTML filename to be published. The optional `tabName` parameter may also be supplied to configure the name of the tab displayed under `Reports` in the Azure DevOps UI.

### Example YAML setup

```YAML
steps:
  - task: PublishHtmlReport@1
    displayName: 'Publish HTML Report'
    inputs:
      reportDir: '$(ResultsPath)/reportName.html'
      tabName: MyReport
```

## Changelog

### v1.1.1 - BlakYaks Release

This version patches the [AwardedSolutions](https://github.com/FreakinWard/azure-pipeline-html-report) release and is now maintained for future support purposes. The BlakYaks release supports Node 16 and Node 20 runners, removing the deprecation notice displayed during pipeline runs.

Task names and inputs were maintained to simplify update from previous releases.

### v1.0.8

This extension patches the original [HTML Viewer by Jakub Rumpca](https://marketplace.visualstudio.com/items?itemName=JakubRumpca.azure-pipelines-html-report) and resolves [#8 TabName incorrectly renders when using multi-stage pipelines](https://github.com/JakubRumpca/azure-pipeline-html-report/issues/8)

Before fix:

![githubIssue8.png](https://github.com/FreakinWard/azure-pipeline-html-report/blob/main/docs/githubIssue8.png?raw=true)

After fix:

![githubIssue8-fixed.png](https://github.com/FreakinWard/azure-pipeline-html-report/blob/main/docs/githubIssue8-fixed.png?raw=true)

```yaml

# tabName has a known bug w/multi-stages: https://github.com/JakubRumpca/azure-pipeline-html-report/issues/8
- task: PublishHtmlReport@1
  displayName: Publish E2E Test Report
  condition: succeededOrFailed()
  inputs:
    reportDir: 'cypress/reports/index.html'
    tabName: 'E2E ${{ parameters.region }}-${{ parameters.slotName }}'
```

