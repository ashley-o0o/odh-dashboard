import * as React from 'react';
import { FilterDataType, initialFilterData } from '~/pages/connectionTypes/const';
import { connectionTypeColumns } from '~/pages/connectionTypes/columns';
import DashboardEmptyTableView from '~/concepts/dashboard/DashboardEmptyTableView';
import ConnectionTypesTableRow from '~/pages/connectionTypes/ConnectionTypesTableRow';
import ConnectionTypesTableToolbar from '~/pages/connectionTypes/ConnectionTypesTableToolbar';
import { ConnectionTypeConfigMapObj } from '~/concepts/connectionTypes/types';
import { Table } from '~/components/table';
import DeleteConnectionTypeModal from '~/pages/connectionTypes/DeleteConnectionTypeModal';
import { ConnectionTypeKind } from '~/k8sTypes';

type ConnectionTypesTableProps = {
  connectionTypes: ConnectionTypeConfigMapObj[];
  onUpdate: () => void;
  refreshConnectionTypes: () => void;
}


const ConnectionTypesTable: React.FC<ConnectionTypesTableProps> = ({
  connectionTypes,
  onUpdate,
  refreshConnectionTypes,
}) => {
  const [filterData, setFilterData] = React.useState<FilterDataType>(initialFilterData);
  const onClearFilters = React.useCallback(() => setFilterData(initialFilterData), [setFilterData]);

  const [deleteConnectionType, setDeleteConnectionType] = React.useState<
  ConnectionTypeKind | undefined
  >();

  const filteredConnectionTypes = connectionTypes.filter((connectionType) => {
    const keywordFilter = filterData.Keyword?.toLowerCase();
    const createFilter = filterData['Created by']?.toLowerCase();

    if (
      keywordFilter &&
      !(
        connectionType.metadata.annotations?.['openshift.io/display-name'] ||
        connectionType.metadata.name
      )
        .toLowerCase()
        .includes(keywordFilter) &&
      !connectionType.metadata.annotations?.['openshift.io/description']
        ?.toLowerCase()
        .includes(keywordFilter)
    ) {
      return false;
    }

    return (
      !createFilter ||
      (connectionType.metadata.annotations?.['opendatahub.io/username'] || 'unknown')
        .toLowerCase()
        .includes(createFilter)
    );
  });

  const resetFilters = () => {
    setFilterData(initialFilterData);
  };

  return (
    <>
    <Table
      variant="compact"
      data={filteredConnectionTypes}
      columns={connectionTypeColumns}
      defaultSortColumn={0}
      data-testid="connection-types-table"
      rowRenderer={(connectionType) => (
        <ConnectionTypesTableRow
          key={connectionType.metadata.name}
          obj={connectionType}
          onUpdate={onUpdate}
          connectionType={connectionType} 
          handleDelete={(connectionType) => setDeleteConnectionType(connectionType)}/>
      )}
      toolbarContent={
        <ConnectionTypesTableToolbar
          filterData={filterData}
          setFilterData={setFilterData}
          onClearFilters={onClearFilters}
        />
      }
      disableItemCount
      emptyTableView={<DashboardEmptyTableView onClearFilters={resetFilters} />}
      id="connectionTypes-list-table"
    />
    <DeleteConnectionTypeModal
        connectionType={deleteConnectionType}
        onClose={(deleted) => {
          if (deleted) {
            refreshConnectionTypes();
          }
          setDeleteConnectionType(undefined);
        }}
      />
    </>
    
  );
};

export default ConnectionTypesTable;
