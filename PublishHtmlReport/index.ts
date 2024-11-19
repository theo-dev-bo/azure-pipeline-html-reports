import tl from 'azure-pipelines-task-lib/task';
import globby from 'globby';
import { readFileSync, writeFileSync, statSync } from 'fs';
import { resolve, basename, dirname } from 'path';
import cheerio from 'cheerio';
import dashify from 'dashify';

type Props = {
    name: string;
    type: string;
    path: string;
}

function addTaskAttachment(attachmentProps: Props) {
    tl.addAttachment(attachmentProps.type, attachmentProps.name, attachmentProps.path);
}

function run() {
    try {
        const reportInputPath = tl.getPathInput('reportDir', true, false)!;
        const isDir = statSync(reportInputPath).isDirectory();
        let files: string[] = [];
        let summaryPath: string;

        if (isDir) {
            files = globby.sync([`${reportInputPath}/**/*.{html,htm}`]); // Find all HTML files within the directory
            summaryPath = resolve(reportInputPath, 'summary.json'); // Place summary in the directory
        } else {
            files = [reportInputPath]; // Single file case
            summaryPath = resolve(dirname(reportInputPath), 'summary.json'); // Place summary in the directory containing the file
        }

        const fileProperties: Props[] = [];
        const summaryProperties = {
            name: generateSummaryName(),
            type: 'report-html-summary',
            path: summaryPath
        };

        files.forEach(file => {
            tl.debug(`Reading report ${file}`);
            const fileContent = readFileSync(file, 'utf8');
            const document = cheerio.load(fileContent);
            writeFileSync(file, document.html());

            const attachmentProperties = {
                name: generateAttachmentName(basename(file), isDir),
                type: 'report-html',
                path: file
            };

            fileProperties.push(attachmentProperties);
            addTaskAttachment(attachmentProperties);
        });

        // Save the summary file
        writeFileSync(summaryPath, JSON.stringify(fileProperties));
        addTaskAttachment(summaryProperties);
    } catch (error) {
        tl.setResult(tl.TaskResult.Failed, error.message);
    }
}

function generateAttachmentName(fileName: string, isDirectory: boolean) {
    const jobName = dashify(tl.getVariable('Agent.JobName')!);
    const stageName = dashify(tl.getVariable('System.StageDisplayName')!);
    const stageAttempt = tl.getVariable('System.StageAttempt');
    const useFilenamesAsTabHeaders = tl.getBoolInput('useFilenameTabs', true);
    let tabName: string;
    if (isDirectory && useFilenamesAsTabHeaders) {
        tabName = basename(fileName)
    } else {
        tabName = tl.getInput('tabName', false) || 'Html-Report';
    }

    return `${tabName}~${jobName}~${stageName}~${stageAttempt}~${fileName}`;
}

function generateSummaryName() {
    const jobName = dashify(tl.getVariable('Agent.JobName')!);
    const stageName = dashify(tl.getVariable('System.StageDisplayName')!);
    const stageAttempt = tl.getVariable('System.StageAttempt');
    const tabName = tl.getInput('tabName', false) || 'Html-Report';
    return `${tabName}~${jobName}~${stageName}~${stageAttempt}`;
}

run();
