import * as React from 'react';
import {
  Icon,
  Level,
  LevelItem,
  Spinner,
  Stack,
  StackItem,
  Switch,
  Timestamp,
  TimestampTooltipVariant,
  Tooltip,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { printSeconds, relativeDuration, relativeTime } from '~/utilities/time';
import {
  PipelineRunKFv2,
  runtimeStateLabels,
  PipelineRecurringRunKFv2,
  RecurringRunMode,
} from '~/concepts/pipelines/kfTypes';
import {
  getRunDuration,
  getPipelineRecurringRunScheduledState,
  ScheduledState,
} from '~/concepts/pipelines/content/tables/utils';
import { computeRunStatus } from '~/concepts/pipelines/content/utils';
import PipelinesTableRowTime from '~/concepts/pipelines/content/tables/PipelinesTableRowTime';
import { useContextExperimentArchived } from '~/pages/pipelines/global/experiments/ExperimentContext';

export const NoRunContent = (): React.JSX.Element => <>-</>;

type ExtraProps = Record<string, unknown>;
type RunUtil<P = ExtraProps> = React.FC<{ run: PipelineRunKFv2 } & P>;
type RecurringRunUtil<P = ExtraProps> = React.FC<{ recurringRun: PipelineRecurringRunKFv2 } & P>;

export const RunStatus: RunUtil<{ justIcon?: boolean }> = ({ justIcon, run }) => {
  const { icon, status, label, details, createdAt } = computeRunStatus(run);
  let tooltipContent: React.ReactNode = details;

  const content = (
    <div style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
      <Icon isInline status={status}>
        {icon}
      </Icon>{' '}
      {!justIcon && label}
    </div>
  );

  if (justIcon && !tooltipContent) {
    // If we are just an icon with no tooltip -- make it the status for ease of understanding
    tooltipContent = (
      <Stack>
        <StackItem>{`Status: ${runtimeStateLabels[run.state]}`}</StackItem>
        <StackItem>{`Started: ${createdAt}`}</StackItem>
      </Stack>
    );
  }

  if (tooltipContent) {
    return <Tooltip content={tooltipContent}>{content}</Tooltip>;
  }
  return content;
};

export const RunDuration: RunUtil = ({ run }) => {
  const duration = getRunDuration(run);
  if (!duration) {
    // Kubeflow initial timestamp -- epoch, not an actual value
    return <NoRunContent />;
  }

  return <>{relativeDuration(duration)}</>;
};

export const RunCreated: RunUtil = ({ run }) => {
  const createdDate = new Date(run.created_at);
  return <PipelinesTableRowTime date={createdDate} />;
};

export const RecurringRunCreated: RecurringRunUtil = ({ recurringRun }) => {
  const createdDate = new Date(recurringRun.created_at);
  return <PipelinesTableRowTime date={createdDate} />;
};

export const RecurringRunTrigger: RecurringRunUtil = ({ recurringRun }) => {
  if (recurringRun.trigger.periodic_schedule) {
    return (
      <>Every {printSeconds(parseInt(recurringRun.trigger.periodic_schedule.interval_second))}</>
    );
  }
  if (recurringRun.trigger.cron_schedule) {
    // TODO: convert Cron into readable text
    return <>Cron {recurringRun.trigger.cron_schedule.cron}</>;
  }

  return <NoRunContent />;
};

export const RecurringRunScheduled: RecurringRunUtil = ({ recurringRun }) => {
  const [state, startDate, endDate] = getPipelineRecurringRunScheduledState(recurringRun);

  switch (state) {
    case ScheduledState.ENDED:
      return <>Completed</>;
    case ScheduledState.NOT_STARTED:
      if (startDate) {
        return (
          <Timestamp date={startDate} tooltip={{ variant: TimestampTooltipVariant.default }}>
            Starts {relativeTime(Date.now(), startDate.getTime())}
          </Timestamp>
        );
      }
      break;
    case ScheduledState.STARTED_NOT_ENDED:
      if (endDate) {
        return (
          <Timestamp date={endDate} tooltip={{ variant: TimestampTooltipVariant.default }}>
            Ends {relativeTime(Date.now(), endDate.getTime())}
          </Timestamp>
        );
      }
      break;
    case ScheduledState.UNBOUNDED_END:
      return <>No end</>;
    default:
  }

  return <NoRunContent />;
};

export const RecurringRunStatus: RecurringRunUtil<{
  onToggle: (value: boolean) => Promise<void>;
}> = ({ recurringRun, onToggle }) => {
  const [error, setError] = React.useState<Error | null>(null);
  const [isChangingFlag, setIsChangingFlag] = React.useState(false);
  const isExperimentArchived = useContextExperimentArchived();

  const isEnabled = recurringRun.mode === RecurringRunMode.ENABLE;
  React.useEffect(() => {
    // When the network updates, if we are currently locked fetching, disable it so we can accept the change
    setIsChangingFlag((v) => (v ? false : v));
  }, [isEnabled]);

  return (
    <Level hasGutter>
      <LevelItem data-testid="recurring-run-status-switch">
        <Switch
          id={`${recurringRun.recurring_run_id}-toggle`}
          aria-label={`Toggle switch; ${isEnabled ? 'Enabled' : 'Disabled'}`}
          isDisabled={isChangingFlag || isExperimentArchived}
          onChange={(e, checked) => {
            setIsChangingFlag(true);
            setError(null);
            onToggle(checked).catch((err) => {
              setError(err);
              setIsChangingFlag(false);
            });
          }}
          isChecked={isEnabled}
        />
      </LevelItem>
      <LevelItem>
        {isChangingFlag && <Spinner size="md" />}
        {error && (
          <Tooltip content={error.message}>
            <Icon status="danger">
              <ExclamationCircleIcon />
            </Icon>
          </Tooltip>
        )}
      </LevelItem>
    </Level>
  );
};
