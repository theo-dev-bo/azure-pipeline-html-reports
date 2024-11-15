# Html Reports (blakyaks.azure-pipeline-html-reports)

An Azure DevOps extension that provides a task for publishing HTML formatted reports onto build and release pages.

## Using the extension

In order to see a report tab you must use the  `Publish HTML Report` task. This is a supporting task which adds HTML output from the build pipeline(s) for viewing.

- The task takes one mandatory parameter `reportDir` which should reference the HTML filename or directory to be published. The optional `tabName` parameter may also be supplied to configure the name of the tab displayed under `Reports` in the Azure DevOps UI.

- Report tab names will use the filename rather than the `tabName` when a directory path has been provided for the `reportDir` parameter. This is the default behaviour and must be overridden by setting `useFilenameTabs` parameter is set to `false`.

### Example YAML use

```YAML
steps:
  - task: PublishHtmlReport@1
    displayName: 'Publish HTML Report'
    inputs:
      reportDir: '$(ResultsPath)/reportName.html'
      useFilenameTabs: true
      tabName: MyReport
```

## Changelog

### v1.2.1

- Added support for setting tab names automatically based on filename when scanning directories for reports as per this [feature request](https://github.com/blakyaks/azure-pipeline-html-reports/issues/4)
- Removed the stage attempt badge for initial job runs

### v1.2.0

- Addresses this [issue](https://github.com/blakyaks/azure-pipeline-html-reports/issues/2) which was carried over from the original source project. The `reportDir` property now supports both directory and file paths; if a directory is specified, all `*.html` and `*.htm` files in that directory will be displayed. An example is shown below:

```yaml
- task: PublishHtmlReport@1
  displayName: Publish Directory Reports
  condition: succeededOrFailed()
  inputs:
    reportDir: 'cypress/reports'
    tabName: 'E2E ${{ parameters.region }}-${{ parameters.slotName }}'
```

### v1.1.1

This version patches the [AwardedSolutions](https://github.com/FreakinWard/azure-pipeline-html-report) release and is now maintained for future support purposes. The BlakYaks release supports Node 16 and Node 20 runners, removing the deprecation notice displayed during pipeline runs.

Task names and inputs were maintained to simplify update from previous releases.

```yaml
- task: PublishHtmlReport@1
  displayName: Publish E2E Test Report
  condition: succeededOrFailed()
  inputs:
    reportDir: 'cypress/reports/index.html'
    tabName: 'E2E ${{ parameters.region }}-${{ parameters.slotName }}'
```
