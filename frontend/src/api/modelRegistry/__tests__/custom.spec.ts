import { proxyCREATE, proxyGET, proxyPATCH } from '~/api/proxyUtils';
import { handleModelRegistryFailures } from '~/api/modelRegistry/errorUtils';
import {
  RegisteredModelState,
  ModelVersionState,
  ModelArtifactState,
} from '~/concepts/modelRegistry/types';
import {
  createModelArtifact,
  createModelVersion,
  createRegisteredModel,
  getRegisteredModel,
  getModelVersion,
  getModelArtifact,
  getListModelVersions,
  getListModelArtifacts,
  getModelVersionsByRegisteredModel,
  getListRegisteredModels,
  patchModelArtifact,
  patchModelVersion,
  patchRegisteredModel,
} from '~/api/modelRegistry/custom';
import { MODEL_REGISTRY_API_VERSION } from '~/concepts/modelRegistry/const';

const mockProxyPromise = Promise.resolve();

jest.mock('~/api/proxyUtils', () => ({
  proxyCREATE: jest.fn(() => mockProxyPromise),
  proxyGET: jest.fn(() => mockProxyPromise),
  proxyPATCH: jest.fn(() => mockProxyPromise),
}));

const mockResultPromise = Promise.resolve();

jest.mock('~/api/modelRegistry/errorUtils', () => ({
  handleModelRegistryFailures: jest.fn(() => mockResultPromise),
}));

const handleModelRegistryFailuresMock = jest.mocked(handleModelRegistryFailures);
const proxyCREATEMock = jest.mocked(proxyCREATE);
const proxyGETMock = jest.mocked(proxyGET);
const proxyPATCHMock = jest.mocked(proxyPATCH);

const K8sAPIOptionsMock = {};

describe('createRegisteredModel', () => {
  it('should call proxyCREATE and handleModelRegistryFailures to create registered model', () => {
    expect(
      createRegisteredModel('hostPath')(K8sAPIOptionsMock, {
        description: 'test',
        externalID: '1',
        name: 'test new registered model',
        state: RegisteredModelState.LIVE,
        customProperties: {},
      }),
    ).toBe(mockResultPromise);
    expect(proxyCREATEMock).toHaveBeenCalledTimes(1);
    expect(proxyCREATEMock).toHaveBeenCalledWith(
      'hostPath',
      `/api/model_registry/${MODEL_REGISTRY_API_VERSION}/registered_models`,
      {
        description: 'test',
        externalID: '1',
        name: 'test new registered model',
        state: RegisteredModelState.LIVE,
        customProperties: {},
      },
      {},
      K8sAPIOptionsMock,
    );
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledTimes(1);
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('createModelVersion', () => {
  it('should call proxyCREATE and handleModelRegistryFailures to create model version', () => {
    expect(
      createModelVersion('hostPath')(K8sAPIOptionsMock, {
        description: 'test',
        externalID: '1',
        author: 'test author',
        registeredModelID: '1',
        name: 'test new model version',
        state: ModelVersionState.LIVE,
        customProperties: {},
      }),
    ).toBe(mockResultPromise);
    expect(proxyCREATEMock).toHaveBeenCalledTimes(1);
    expect(proxyCREATEMock).toHaveBeenCalledWith(
      'hostPath',
      `/api/model_registry/${MODEL_REGISTRY_API_VERSION}/model_versions`,
      {
        description: 'test',
        externalID: '1',
        author: 'test author',
        registeredModelID: '1',
        name: 'test new model version',
        state: ModelVersionState.LIVE,
        customProperties: {},
      },
      {},
      K8sAPIOptionsMock,
    );
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledTimes(1);
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('createModelArtifact', () => {
  it('should call proxyCREATE and handleModelRegistryFailures to create model artifact', () => {
    expect(
      createModelArtifact('hostPath')(K8sAPIOptionsMock, {
        description: 'test',
        externalID: 'test',
        uri: 'test-uri',
        state: ModelArtifactState.LIVE,
        name: 'test-name',
        modelFormatName: 'test-modelformatname',
        storageKey: 'teststoragekey',
        storagePath: 'teststoragePath',
        modelFormatVersion: 'testmodelFormatVersion',
        serviceAccountName: 'testserviceAccountname',
        customProperties: {},
      }),
    ).toBe(mockResultPromise);
    expect(proxyCREATEMock).toHaveBeenCalledTimes(1);
    expect(proxyCREATEMock).toHaveBeenCalledWith(
      'hostPath',
      `/api/model_registry/${MODEL_REGISTRY_API_VERSION}/model_artifacts`,
      {
        description: 'test',
        externalID: 'test',
        uri: 'test-uri',
        state: ModelArtifactState.LIVE,
        name: 'test-name',
        modelFormatName: 'test-modelformatname',
        storageKey: 'teststoragekey',
        storagePath: 'teststoragePath',
        modelFormatVersion: 'testmodelFormatVersion',
        serviceAccountName: 'testserviceAccountname',
        customProperties: {},
      },
      {},
      K8sAPIOptionsMock,
    );
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledTimes(1);
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('getRegisteredModel', () => {
  it('should call proxyGET and handleModelRegistryFailures to fetch registered model', () => {
    expect(getRegisteredModel('hostPath')(K8sAPIOptionsMock, '1')).toBe(mockResultPromise);
    expect(proxyGETMock).toHaveBeenCalledTimes(1);
    expect(proxyGETMock).toHaveBeenCalledWith(
      'hostPath',
      `/api/model_registry/${MODEL_REGISTRY_API_VERSION}/registered_models/1`,
      {},
      K8sAPIOptionsMock,
    );
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledTimes(1);
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('getModelVersion', () => {
  it('should call proxyGET and handleModelRegistryFailures to fetch model version', () => {
    expect(getModelVersion('hostPath')(K8sAPIOptionsMock, '1')).toBe(mockResultPromise);
    expect(proxyGETMock).toHaveBeenCalledTimes(1);
    expect(proxyGETMock).toHaveBeenCalledWith(
      'hostPath',
      `/api/model_registry/${MODEL_REGISTRY_API_VERSION}/model_versions/1`,
      {},
      K8sAPIOptionsMock,
    );
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledTimes(1);
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('getModelArtifact', () => {
  it('should call proxyGET and handleModelRegistryFailures to fetch model version', () => {
    expect(getModelArtifact('hostPath')(K8sAPIOptionsMock, '1')).toBe(mockResultPromise);
    expect(proxyGETMock).toHaveBeenCalledTimes(1);
    expect(proxyGETMock).toHaveBeenCalledWith(
      'hostPath',
      `/api/model_registry/${MODEL_REGISTRY_API_VERSION}/model_artifacts/1`,
      {},
      K8sAPIOptionsMock,
    );
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledTimes(1);
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('getListRegisteredModels', () => {
  it('should call proxyGET and handleModelRegistryFailures to list registered models', () => {
    expect(getListRegisteredModels('hostPath')({})).toBe(mockResultPromise);
    expect(proxyGETMock).toHaveBeenCalledTimes(1);
    expect(proxyGETMock).toHaveBeenCalledWith(
      'hostPath',
      `/api/model_registry/${MODEL_REGISTRY_API_VERSION}/registered_models`,
      {},
      K8sAPIOptionsMock,
    );
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledTimes(1);
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('getListModelArtifacts', () => {
  it('should call proxyGET and handleModelRegistryFailures to list models artifacts', () => {
    expect(getListModelArtifacts('hostPath')({})).toBe(mockResultPromise);
    expect(proxyGETMock).toHaveBeenCalledTimes(1);
    expect(proxyGETMock).toHaveBeenCalledWith(
      'hostPath',
      `/api/model_registry/${MODEL_REGISTRY_API_VERSION}/model_artifacts`,
      {},
      K8sAPIOptionsMock,
    );
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledTimes(1);
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('getListModelVersions', () => {
  it('should call proxyGET and handleModelRegistryFailures to list models versions', () => {
    expect(getListModelVersions('hostPath')({})).toBe(mockResultPromise);
    expect(proxyGETMock).toHaveBeenCalledTimes(1);
    expect(proxyGETMock).toHaveBeenCalledWith(
      'hostPath',
      `/api/model_registry/${MODEL_REGISTRY_API_VERSION}/model_versions`,
      {},
      K8sAPIOptionsMock,
    );
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledTimes(1);
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('getModelVersionsByRegisteredModel', () => {
  it('should call proxyGET and handleModelRegistryFailures to list models versions by registered model', () => {
    expect(getModelVersionsByRegisteredModel('hostPath')({}, '1')).toBe(mockResultPromise);
    expect(proxyGETMock).toHaveBeenCalledTimes(1);
    expect(proxyGETMock).toHaveBeenCalledWith(
      'hostPath',
      `/api/model_registry/${MODEL_REGISTRY_API_VERSION}/registered_models/1/versions`,
      {},
      K8sAPIOptionsMock,
    );
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledTimes(1);
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('patchRegisteredModel', () => {
  it('should call proxyPATCH and handleModelRegistryFailures to update registered model', () => {
    expect(
      patchRegisteredModel('hostPath')(K8sAPIOptionsMock, { description: 'new test' }, '1'),
    ).toBe(mockResultPromise);
    expect(proxyPATCHMock).toHaveBeenCalledTimes(1);
    expect(proxyPATCHMock).toHaveBeenCalledWith(
      'hostPath',
      `/api/model_registry/${MODEL_REGISTRY_API_VERSION}/registered_models/1`,
      { description: 'new test' },
      K8sAPIOptionsMock,
    );
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledTimes(1);
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('patchModelVersion', () => {
  it('should call proxyPATCH and handleModelRegistryFailures to update model version', () => {
    expect(patchModelVersion('hostPath')(K8sAPIOptionsMock, { description: 'new test' }, '1')).toBe(
      mockResultPromise,
    );
    expect(proxyPATCHMock).toHaveBeenCalledTimes(1);
    expect(proxyPATCHMock).toHaveBeenCalledWith(
      'hostPath',
      `/api/model_registry/${MODEL_REGISTRY_API_VERSION}/model_versions/1`,
      { description: 'new test' },
      K8sAPIOptionsMock,
    );
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledTimes(1);
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('patchModelArtifact', () => {
  it('should call proxyPATCH and handleModelRegistryFailures to update model artifact', () => {
    expect(
      patchModelArtifact('hostPath')(K8sAPIOptionsMock, { description: 'new test' }, '1'),
    ).toBe(mockResultPromise);
    expect(proxyPATCHMock).toHaveBeenCalledTimes(1);
    expect(proxyPATCHMock).toHaveBeenCalledWith(
      'hostPath',
      `/api/model_registry/${MODEL_REGISTRY_API_VERSION}/model_artifacts/1`,
      { description: 'new test' },
      K8sAPIOptionsMock,
    );
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledTimes(1);
    expect(handleModelRegistryFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});
