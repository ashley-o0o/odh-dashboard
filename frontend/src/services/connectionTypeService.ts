import axios from '~/utilities/axios';
import { ConnectionTypeKind } from '~/k8sTypes';
import { ResponseStatus } from '~/types';

export const createConnectionType = (
  connectionType: ConnectionTypeKind['spec'],
): Promise<ResponseStatus> => {
  const url = '/api/connection-type';
  return axios
    .post(url, connectionType)
    .then((response) => response.data)
    .catch((e) => {
      throw new Error(e.response.data.message);
    });
};

export const deleteConnectionType = (name: string): Promise<ResponseStatus> => {
  const url = `/api/connection-types/${name}`;
  return axios
    .delete(url)
    .then((response) => response.data)
    .catch((e) => {
      throw new Error(e.response.data.message);
    });
};

export const updateConnectionType = (
  name: string,
  spec: Partial<ConnectionTypeKind['spec']>,
): Promise<ResponseStatus> => {
  const url = `/api/connection-types/${name}`;
  return axios
    .put(url, spec)
    .then((response) => response.data)
    .catch((e) => {
      throw new Error(e.response.data.message);
    });
};
