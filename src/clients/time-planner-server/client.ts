/**
 * Generated by orval v6.18.1 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import {
  useQuery,
  useMutation
} from '@tanstack/react-query'
import type {
  UseQueryOptions,
  UseMutationOptions,
  QueryFunction,
  MutationFunction,
  UseQueryResult,
  QueryKey
} from '@tanstack/react-query'
import type {
  TaskDTO,
  GetTasksParams,
  CreateTaskDTO,
  TaskUpdateDTO,
  Links200One,
  Links200Two,
  Links200Three,
  Health200One,
  Health200Two,
  Health200Three,
  HealthPath200One,
  HealthPath200Two,
  HealthPath200Three
} from './model'
import { customInstance } from '../../../config/axios-instance';



// eslint-disable-next-line
  type SecondParameter<T extends (...args: any) => any> = T extends (
  config: any,
  args: infer P,
) => any
  ? P
  : never;

/**
 * @summary Get tasks order
 */
export const getTasksDayOrder = (
    day: string,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<string[]>(
      {url: `/day/${day}/tasks/order`, method: 'get', signal
    },
      options);
    }
  

export const getGetTasksDayOrderQueryKey = (day: string,) => {
    
    return [`/day/${day}/tasks/order`] as const;
    }
  

    
export const getGetTasksDayOrderQueryOptions = <TData = Awaited<ReturnType<typeof getTasksDayOrder>>, TError = unknown>(day: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getTasksDayOrder>>, TError, TData>, request?: SecondParameter<typeof customInstance>}
) => {
    
const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetTasksDayOrderQueryKey(day);

  
  
    const queryFn: QueryFunction<Awaited<ReturnType<typeof getTasksDayOrder>>> = ({ signal }) => getTasksDayOrder(day, requestOptions, signal);

      
    
      
      
   return  { queryKey, queryFn, enabled: !!(day), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getTasksDayOrder>>, TError, TData> & { queryKey: QueryKey }
}

export type GetTasksDayOrderQueryResult = NonNullable<Awaited<ReturnType<typeof getTasksDayOrder>>>
export type GetTasksDayOrderQueryError = unknown

/**
 * @summary Get tasks order
 */
export const useGetTasksDayOrder = <TData = Awaited<ReturnType<typeof getTasksDayOrder>>, TError = unknown>(
 day: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getTasksDayOrder>>, TError, TData>, request?: SecondParameter<typeof customInstance>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getGetTasksDayOrderQueryOptions(day,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}


/**
 * @summary Update tasks order
 */
export const updateTasksDayOrder = (
    day: string,
    updateTasksDayOrderBody: string[],
 options?: SecondParameter<typeof customInstance>,) => {
      
      
      return customInstance<string[]>(
      {url: `/day/${day}/tasks/order`, method: 'put',
      headers: {'Content-Type': 'application/json', },
      data: updateTasksDayOrderBody
    },
      options);
    }
  


export const getUpdateTasksDayOrderMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateTasksDayOrder>>, TError,{day: string;data: string[]}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof updateTasksDayOrder>>, TError,{day: string;data: string[]}, TContext> => {
 const {mutation: mutationOptions, request: requestOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateTasksDayOrder>>, {day: string;data: string[]}> = (props) => {
          const {day,data} = props ?? {};

          return  updateTasksDayOrder(day,data,requestOptions)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type UpdateTasksDayOrderMutationResult = NonNullable<Awaited<ReturnType<typeof updateTasksDayOrder>>>
    export type UpdateTasksDayOrderMutationBody = string[]
    export type UpdateTasksDayOrderMutationError = unknown

    /**
 * @summary Update tasks order
 */
export const useUpdateTasksDayOrder = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateTasksDayOrder>>, TError,{day: string;data: string[]}, TContext>, request?: SecondParameter<typeof customInstance>}
) => {
    
      const mutationOptions = getUpdateTasksDayOrderMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
/**
 * @summary Get tasks
 */
export const getTasks = (
    params: GetTasksParams,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<TaskDTO[]>(
      {url: `/tasks`, method: 'get',
        params, signal
    },
      options);
    }
  

export const getGetTasksQueryKey = (params: GetTasksParams,) => {
    
    return [`/tasks`, ...(params ? [params]: [])] as const;
    }
  

    
export const getGetTasksQueryOptions = <TData = Awaited<ReturnType<typeof getTasks>>, TError = unknown>(params: GetTasksParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getTasks>>, TError, TData>, request?: SecondParameter<typeof customInstance>}
) => {
    
const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetTasksQueryKey(params);

  
  
    const queryFn: QueryFunction<Awaited<ReturnType<typeof getTasks>>> = ({ signal }) => getTasks(params, requestOptions, signal);

      
    
      
      
   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getTasks>>, TError, TData> & { queryKey: QueryKey }
}

export type GetTasksQueryResult = NonNullable<Awaited<ReturnType<typeof getTasks>>>
export type GetTasksQueryError = unknown

/**
 * @summary Get tasks
 */
export const useGetTasks = <TData = Awaited<ReturnType<typeof getTasks>>, TError = unknown>(
 params: GetTasksParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getTasks>>, TError, TData>, request?: SecondParameter<typeof customInstance>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getGetTasksQueryOptions(params,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}


export const createTask = (
    createTaskDTO: CreateTaskDTO,
 options?: SecondParameter<typeof customInstance>,) => {
      
      
      return customInstance<TaskDTO>(
      {url: `/tasks`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: createTaskDTO
    },
      options);
    }
  


export const getCreateTaskMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createTask>>, TError,{data: CreateTaskDTO}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof createTask>>, TError,{data: CreateTaskDTO}, TContext> => {
 const {mutation: mutationOptions, request: requestOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createTask>>, {data: CreateTaskDTO}> = (props) => {
          const {data} = props ?? {};

          return  createTask(data,requestOptions)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type CreateTaskMutationResult = NonNullable<Awaited<ReturnType<typeof createTask>>>
    export type CreateTaskMutationBody = CreateTaskDTO
    export type CreateTaskMutationError = unknown

    export const useCreateTask = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createTask>>, TError,{data: CreateTaskDTO}, TContext>, request?: SecondParameter<typeof customInstance>}
) => {
    
      const mutationOptions = getCreateTaskMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const getTask = (
    id: string,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<TaskDTO>(
      {url: `/tasks/${id}`, method: 'get', signal
    },
      options);
    }
  

export const getGetTaskQueryKey = (id: string,) => {
    
    return [`/tasks/${id}`] as const;
    }
  

    
export const getGetTaskQueryOptions = <TData = Awaited<ReturnType<typeof getTask>>, TError = unknown>(id: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getTask>>, TError, TData>, request?: SecondParameter<typeof customInstance>}
) => {
    
const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetTaskQueryKey(id);

  
  
    const queryFn: QueryFunction<Awaited<ReturnType<typeof getTask>>> = ({ signal }) => getTask(id, requestOptions, signal);

      
    
      
      
   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getTask>>, TError, TData> & { queryKey: QueryKey }
}

export type GetTaskQueryResult = NonNullable<Awaited<ReturnType<typeof getTask>>>
export type GetTaskQueryError = unknown

export const useGetTask = <TData = Awaited<ReturnType<typeof getTask>>, TError = unknown>(
 id: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getTask>>, TError, TData>, request?: SecondParameter<typeof customInstance>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getGetTaskQueryOptions(id,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}


export const deleteTask = (
    id: string,
 options?: SecondParameter<typeof customInstance>,) => {
      
      
      return customInstance<void>(
      {url: `/tasks/${id}`, method: 'delete'
    },
      options);
    }
  


export const getDeleteTaskMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteTask>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteTask>>, TError,{id: string}, TContext> => {
 const {mutation: mutationOptions, request: requestOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteTask>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteTask(id,requestOptions)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type DeleteTaskMutationResult = NonNullable<Awaited<ReturnType<typeof deleteTask>>>
    
    export type DeleteTaskMutationError = unknown

    export const useDeleteTask = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteTask>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customInstance>}
) => {
    
      const mutationOptions = getDeleteTaskMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const updateTask = (
    id: string,
    taskUpdateDTO: TaskUpdateDTO,
 options?: SecondParameter<typeof customInstance>,) => {
      
      
      return customInstance<TaskDTO>(
      {url: `/tasks/${id}`, method: 'patch',
      headers: {'Content-Type': 'application/json', },
      data: taskUpdateDTO
    },
      options);
    }
  


export const getUpdateTaskMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateTask>>, TError,{id: string;data: TaskUpdateDTO}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof updateTask>>, TError,{id: string;data: TaskUpdateDTO}, TContext> => {
 const {mutation: mutationOptions, request: requestOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateTask>>, {id: string;data: TaskUpdateDTO}> = (props) => {
          const {id,data} = props ?? {};

          return  updateTask(id,data,requestOptions)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type UpdateTaskMutationResult = NonNullable<Awaited<ReturnType<typeof updateTask>>>
    export type UpdateTaskMutationBody = TaskUpdateDTO
    export type UpdateTaskMutationError = unknown

    export const useUpdateTask = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateTask>>, TError,{id: string;data: TaskUpdateDTO}, TContext>, request?: SecondParameter<typeof customInstance>}
) => {
    
      const mutationOptions = getUpdateTaskMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const validate = (
    
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<boolean>(
      {url: `/validateAuth`, method: 'get', signal
    },
      options);
    }
  

export const getValidateQueryKey = () => {
    
    return [`/validateAuth`] as const;
    }
  

    
export const getValidateQueryOptions = <TData = Awaited<ReturnType<typeof validate>>, TError = unknown>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof validate>>, TError, TData>, request?: SecondParameter<typeof customInstance>}
) => {
    
const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getValidateQueryKey();

  
  
    const queryFn: QueryFunction<Awaited<ReturnType<typeof validate>>> = ({ signal }) => validate(requestOptions, signal);

      
    
      
      
   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof validate>>, TError, TData> & { queryKey: QueryKey }
}

export type ValidateQueryResult = NonNullable<Awaited<ReturnType<typeof validate>>>
export type ValidateQueryError = unknown

export const useValidate = <TData = Awaited<ReturnType<typeof validate>>, TError = unknown>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof validate>>, TError, TData>, request?: SecondParameter<typeof customInstance>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getValidateQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}


/**
 * @summary Get day's tasks
 */
export const getDayTasks = (
    day: string,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<TaskDTO[]>(
      {url: `/day/${day}/tasks`, method: 'get', signal
    },
      options);
    }
  

export const getGetDayTasksQueryKey = (day: string,) => {
    
    return [`/day/${day}/tasks`] as const;
    }
  

    
export const getGetDayTasksQueryOptions = <TData = Awaited<ReturnType<typeof getDayTasks>>, TError = unknown>(day: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getDayTasks>>, TError, TData>, request?: SecondParameter<typeof customInstance>}
) => {
    
const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetDayTasksQueryKey(day);

  
  
    const queryFn: QueryFunction<Awaited<ReturnType<typeof getDayTasks>>> = ({ signal }) => getDayTasks(day, requestOptions, signal);

      
    
      
      
   return  { queryKey, queryFn, enabled: !!(day), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getDayTasks>>, TError, TData> & { queryKey: QueryKey }
}

export type GetDayTasksQueryResult = NonNullable<Awaited<ReturnType<typeof getDayTasks>>>
export type GetDayTasksQueryError = unknown

/**
 * @summary Get day's tasks
 */
export const useGetDayTasks = <TData = Awaited<ReturnType<typeof getDayTasks>>, TError = unknown>(
 day: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getDayTasks>>, TError, TData>, request?: SecondParameter<typeof customInstance>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getGetDayTasksQueryOptions(day,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}


/**
 * @summary Actuator root web endpoint
 */
export const links = (
    
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<Links200One | Links200Two | Links200Three>(
      {url: `/actuator`, method: 'get', signal
    },
      options);
    }
  

export const getLinksQueryKey = () => {
    
    return [`/actuator`] as const;
    }
  

    
export const getLinksQueryOptions = <TData = Awaited<ReturnType<typeof links>>, TError = unknown>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof links>>, TError, TData>, request?: SecondParameter<typeof customInstance>}
) => {
    
const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getLinksQueryKey();

  
  
    const queryFn: QueryFunction<Awaited<ReturnType<typeof links>>> = ({ signal }) => links(requestOptions, signal);

      
    
      
      
   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof links>>, TError, TData> & { queryKey: QueryKey }
}

export type LinksQueryResult = NonNullable<Awaited<ReturnType<typeof links>>>
export type LinksQueryError = unknown

/**
 * @summary Actuator root web endpoint
 */
export const useLinks = <TData = Awaited<ReturnType<typeof links>>, TError = unknown>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof links>>, TError, TData>, request?: SecondParameter<typeof customInstance>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getLinksQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}


/**
 * @summary Actuator web endpoint 'health'
 */
export const health = (
    
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<Health200One | Health200Two | Health200Three>(
      {url: `/actuator/health`, method: 'get', signal
    },
      options);
    }
  

export const getHealthQueryKey = () => {
    
    return [`/actuator/health`] as const;
    }
  

    
export const getHealthQueryOptions = <TData = Awaited<ReturnType<typeof health>>, TError = unknown>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof health>>, TError, TData>, request?: SecondParameter<typeof customInstance>}
) => {
    
const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getHealthQueryKey();

  
  
    const queryFn: QueryFunction<Awaited<ReturnType<typeof health>>> = ({ signal }) => health(requestOptions, signal);

      
    
      
      
   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof health>>, TError, TData> & { queryKey: QueryKey }
}

export type HealthQueryResult = NonNullable<Awaited<ReturnType<typeof health>>>
export type HealthQueryError = unknown

/**
 * @summary Actuator web endpoint 'health'
 */
export const useHealth = <TData = Awaited<ReturnType<typeof health>>, TError = unknown>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof health>>, TError, TData>, request?: SecondParameter<typeof customInstance>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getHealthQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}


/**
 * @summary Actuator web endpoint 'health-path'
 */
export const healthPath = (
    
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<HealthPath200One | HealthPath200Two | HealthPath200Three>(
      {url: `/actuator/health/**`, method: 'get', signal
    },
      options);
    }
  

export const getHealthPathQueryKey = () => {
    
    return [`/actuator/health/**`] as const;
    }
  

    
export const getHealthPathQueryOptions = <TData = Awaited<ReturnType<typeof healthPath>>, TError = unknown>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof healthPath>>, TError, TData>, request?: SecondParameter<typeof customInstance>}
) => {
    
const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getHealthPathQueryKey();

  
  
    const queryFn: QueryFunction<Awaited<ReturnType<typeof healthPath>>> = ({ signal }) => healthPath(requestOptions, signal);

      
    
      
      
   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof healthPath>>, TError, TData> & { queryKey: QueryKey }
}

export type HealthPathQueryResult = NonNullable<Awaited<ReturnType<typeof healthPath>>>
export type HealthPathQueryError = unknown

/**
 * @summary Actuator web endpoint 'health-path'
 */
export const useHealthPath = <TData = Awaited<ReturnType<typeof healthPath>>, TError = unknown>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof healthPath>>, TError, TData>, request?: SecondParameter<typeof customInstance>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getHealthPathQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}


