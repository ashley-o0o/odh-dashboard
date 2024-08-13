import React from 'react';
import DeleteModal from '~/pages/projects/components/DeleteModal';
import { ConnectionTypeKind } from '~/k8sTypes';
import { deleteConnectionType } from '~/services/connectionTypesService';

type DeleteConnectionTypeModalProps = {
  connectionType?: ConnectionTypeKind;
  onClose: (deleted: boolean) => void;
};

const DeleteConnectionTypeModal: React.FC<DeleteConnectionTypeModalProps> = ({
  connectionType,
  onClose,
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>();

  const onBeforeClose = (deleted: boolean) => {
    onClose(deleted);
    setIsDeleting(false);
    setError(undefined);
  };

  const deleteName = connectionType?.spec.displayName || 'this accelerator profile';

  return (
    <DeleteModal
      title="Delete accelerator profile?"
      isOpen={!!connectionType}
      onClose={() => onBeforeClose(false)}
      submitButtonLabel="Delete"
      onDelete={() => {
        if (connectionType) {
          setIsDeleting(true);
          deleteConnectionType(connectionType.metadata.name)
            .then(() => {
              onBeforeClose(true);
            })
            .catch((e) => {
              setError(e);
              setIsDeleting(false);
            });
        }
      }}
      deleting={isDeleting}
      error={error}
      deleteName={deleteName}
    >
      The <b>{deleteName}</b> accelerator profile will be deleted and will no longer be available
      for use with new workbenches and runtimes. Existing resources using this profile will retain
      it unless a new profile is selected.
    </DeleteModal>
  );
};

export default DeleteConnectionTypeModal;
