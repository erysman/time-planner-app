// import { useEffect } from "react";
// import { useErrorBoundary } from "react-error-boundary";
// import { Spinner } from "tamagui";
// import {
//   useGetDayTasks,
//   useGetProjects,
//   useGetTasksDayOrder,
// } from "../../../clients/time-planner-server/client";
// import { getRefreshInterval } from "../../../core/logic/config/utils";
// import { DraggableCalendarList } from "../components/draggableCalendarList/DraggableCalendarList";
// import { CalendarListDataProvider } from "../logic/UseCalendarListContext";
// import { IProject, ITask } from "../model/model";

// export interface DailyPlannerLoadProps {
//   day: string;
// }

// export const DailyPlannerLoad = ({ day }: DailyPlannerLoadProps) => {
//   const {
//     data: tasks,
//     isError,
//     error,
//     isLoading,
//   } = useGetDayTasks(day, { query: { refetchInterval: getRefreshInterval() } });
//   const {
//     data: tasksOrder,
//     isError: isErrorOrder,
//     error: errorOrder,
//     isLoading: isLoadingOrder,
//   } = useGetTasksDayOrder(day, {
//     query: { refetchInterval: getRefreshInterval()},
//   });

//   const {
//     data: projects,
//     isError: isErrorProjects,
//     error: errorProjects,
//     isLoading: isLoadingProjects,
//   } = useGetProjects({ query: { refetchInterval: getRefreshInterval()} });

//   const { showBoundary } = useErrorBoundary();
//   useEffect(() => {
//     if (isError) {
//       showBoundary(error);
//     }
//     if (isErrorOrder) {
//       showBoundary(errorOrder);
//     }
//     if (isErrorProjects) {
//       showBoundary(errorProjects);
//     }
//   }, [isError, isErrorOrder, isErrorProjects]);

//   if (isLoading || isLoadingOrder || isLoadingProjects) {
//     return <Spinner />; //TODO: print skeleton, not Spinner
//   }
  
//   return (
//     <CalendarListDataProvider>
//       <DraggableCalendarList
//         day={day}
//         tasks={tasks as ITask[]}
//         projects={projects as IProject[]}
//         tasksOrder={tasksOrder as string[]}
//       />
//     </CalendarListDataProvider>
//   );
// };
