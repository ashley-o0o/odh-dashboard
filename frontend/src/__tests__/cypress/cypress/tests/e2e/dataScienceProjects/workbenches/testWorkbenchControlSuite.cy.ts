import type { WBControlSuiteTestData } from '~/__tests__/cypress/cypress/types';
import { projectDetails, projectListPage } from '~/__tests__/cypress/cypress/pages/projects';
import {
  workbenchPage,
  createSpawnerPage,
  notebookConfirmModal,
  notebookDeleteModal,
} from '~/__tests__/cypress/cypress/pages/workbench';
import { HTPASSWD_CLUSTER_ADMIN_USER } from '~/__tests__/cypress/cypress/utils/e2eUsers';
import { loadWBControlSuiteFixture } from '~/__tests__/cypress/cypress/utils/dataLoader';
import { createCleanProject } from '~/__tests__/cypress/cypress/utils/projectChecker';
import { deleteOpenShiftProject } from '~/__tests__/cypress/cypress/utils/oc_commands/project';

describe('Start, Stop, Launch and Delete a Workbench in RHOAI', () => {
  let controlSuiteTestNamespace: string;
  let controlSuiteTestDescription: string;

  // Setup: Load test data and ensure clean state
  before(() => {
    return loadWBControlSuiteFixture('e2e/dataScienceProjects/testWorkbenchControlSuite.yaml')
      .then((fixtureData: WBControlSuiteTestData) => {
        controlSuiteTestNamespace = fixtureData.controlSuiteTestNamespace;
        controlSuiteTestDescription = fixtureData.controlSuiteTestDescription;

        if (!controlSuiteTestNamespace) {
          throw new Error('Project name is undefined or empty in the loaded fixture');
        }
        cy.log(`Loaded project name: ${controlSuiteTestNamespace}`);
        return createCleanProject(controlSuiteTestNamespace);
      })
      .then(() => {
        cy.log(
          `Project ${controlSuiteTestNamespace} confirmed to be created and verified successfully`,
        );
      });
  });
  after(() => {
    // Delete provisioned Project
    if (controlSuiteTestNamespace) {
      cy.log(`Deleting Project ${controlSuiteTestNamespace} after the test has finished.`);
      deleteOpenShiftProject(controlSuiteTestNamespace);
    }
  });

  it(
    'Starting, Stopping, Launching and Deleting a Workbench',
    { tags: ['@Sanity', '@SanitySet1', '@ODS-1818', '@ODS-1823', '@Dashboard'] },
    () => {
      const workbenchName = controlSuiteTestNamespace.replace('dsp-', '');

      // Authentication and navigation
      cy.step('Log into the application');
      cy.visitWithLogin('/', HTPASSWD_CLUSTER_ADMIN_USER);

      // Project navigation and select workbences
      cy.step(`Navigate to workbenches tab of Project ${controlSuiteTestNamespace}`);
      projectListPage.navigate();
      projectListPage.filterProjectByName(controlSuiteTestNamespace);
      projectListPage.findProjectLink(controlSuiteTestNamespace).click();
      projectDetails.findSectionTab('workbenches').click();

      // Create workbench
      cy.step(`Create workbench ${controlSuiteTestNamespace}`);
      workbenchPage.findCreateButton().click();
      createSpawnerPage.getNameInput().fill(workbenchName);
      createSpawnerPage.getDescriptionInput().type(controlSuiteTestDescription);
      createSpawnerPage.findNotebookImage('code-server-notebook').click();
      createSpawnerPage.findSubmitButton().click();

      // Wait for workbench to run
      cy.step(`Wait for workbench ${workbenchName} to display a "Running" status`);
      const notebookRow = workbenchPage.getNotebookRow(workbenchName);
      notebookRow.findNotebookDescription(controlSuiteTestDescription);
      notebookRow.expectStatusLabelToBe('Running', 120000);
      notebookRow.shouldHaveNotebookImageName('code-server');
      notebookRow.shouldHaveContainerSize('Small');

      // Stop workbench
      cy.step('Stop workbench and validate it has been stopped');
      notebookRow.findNotebookStop().click();
      notebookConfirmModal.findStopWorkbenchButton().click();
      notebookRow.expectStatusLabelToBe('Stopped', 120000);

      // Restart workbench and confirm initiation
      cy.step('Restart workbench and validate it starts successfully');
      notebookRow.findNotebookStart().click();
      notebookRow.expectStatusLabelToBe('Running', 120000);

      // Delete workbench
      cy.step('Delete workbench and confirm deleteion');
      notebookRow.findKebab().click();
      notebookRow.findKebabAction('Delete workbench').click();
      notebookDeleteModal.findDeleteModal().click();
      notebookDeleteModal.findDeleteModal().type(workbenchName);
      notebookDeleteModal.findDeleteWorkbenchButton().click();
      workbenchPage.findEmptyState().should('exist');
    },
  );
});