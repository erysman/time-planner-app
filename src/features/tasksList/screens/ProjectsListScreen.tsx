import { ErrorBoundary } from "react-error-boundary";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GenericFallback
} from "../../../core/components/fallbacks/GenericFallback";
import { ProjectsListLoad } from "../components/ProjectsListLoad";

export const ProjectsListScreen = () => {
  return (
    <SafeAreaView>
      <ErrorBoundary FallbackComponent={GenericFallback}>
        <ProjectsListLoad />
      </ErrorBoundary>
    </SafeAreaView>
  );
};
