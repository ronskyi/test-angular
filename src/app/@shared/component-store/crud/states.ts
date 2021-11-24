import {
  CreateStateEnum,
  DeleteComponentStateEnum,
  ListLoadingStateEnum,
  UpdateStateEnum
} from '@shared/component-store/crud/enums';

export interface DeleteButtonState {
  state: DeleteComponentStateEnum
}

export const createInitialDeleteState = (): DeleteButtonState => ({
  state: DeleteComponentStateEnum.INITIAL
} as DeleteButtonState);


export interface CreateState {
  createdId?: string;
  state: CreateStateEnum;
}

export const createInitialCreateState = () => ({
  state: CreateStateEnum.INITIAL
} as CreateState);

export interface UpdateState<T> {
  item?: T;
  state: UpdateStateEnum;
}

export const createInitialUpdateState = <T>() => ({
  state: UpdateStateEnum.INITIAL
} as UpdateState<T>);

export interface ListState<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  state: ListLoadingStateEnum
}

export const createInitialListState = <T>() => ({
  list: [],
  total: 0,
  page: 1,
  pageSize: 10,
  state: ListLoadingStateEnum.INITIAL
} as ListState<T>)
