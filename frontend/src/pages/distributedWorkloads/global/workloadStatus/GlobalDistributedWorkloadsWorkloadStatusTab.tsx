import * as React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import { DWStatusOverviewDonutChart } from './DWStatusOverviewDonutChart';
import { DWStatusTrendsChart } from './DWStatusTrendsChart';
import { DWWorkloadsTable } from './DWWorkloadsTable';

const GlobalDistributedWorkloadsWorkloadStatusTab: React.FC = () => (
  <Grid hasGutter>
    <GridItem span={6}>
      <DWStatusOverviewDonutChart />
    </GridItem>
    <GridItem span={6}>
      <DWStatusTrendsChart />
    </GridItem>
    <GridItem span={12}>
      <DWWorkloadsTable />
    </GridItem>
  </Grid>
);

export default GlobalDistributedWorkloadsWorkloadStatusTab;
