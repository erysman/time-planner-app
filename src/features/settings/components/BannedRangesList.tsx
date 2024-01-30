import { Button, SizableText, Spinner, XStack, YStack } from "tamagui";
import {
  getGetBannedRangesQueryKey,
  useCreateBannedRange,
  useDeleteBannedRange,
  useGetBannedRanges,
} from "../../../clients/time-planner-server/client";
import { getRefreshInterval } from "../../../core/logic/config/utils";
import { BannedRangeDTO } from "../../../clients/time-planner-server/model";
import { useState } from "react";
import { z } from "zod";
import { SelectTime } from "./SelectTime";
import { Dayjs } from "dayjs";
import { ExpoIcon, PlusIcon } from "../../../core/components/ExpoIcon";
import { useQueryClient } from "@tanstack/react-query";
import { TIME_FORMAT } from "../../../../config/constants";
import i18n from "../../../../config/i18n";
import { useConfirmDeleteModal } from "../../../core/components/modal/UseConfirmActionModal";
import { useValidateTime } from "../logic/UseValidateTime";

export const BannedRangesList = (props: { data?: BannedRangeDTO[] }) => {
  const { data } = props;
  return (
    <YStack>
      {data?.map((range) => (
        <BannedRangeItem
          key={range.id}
          id={range.id}
          startTime={range.startTime}
          endTime={range.endTime}
        />
      ))}
    </YStack>
  );
};

interface BannedRangeItemProps {
  id: string;
  startTime: string;
  endTime: string;
}

export const BannedRangeItem = ({
  endTime,
  id,
  startTime,
}: BannedRangeItemProps) => {

  const queryClient = useQueryClient();
  const deleteRange = useDeleteBannedRange({
    mutation: {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getGetBannedRangesQueryKey(),
        });
      },
    },
  });
  const onDelete = () => {
    deleteRange.mutate({id})
  }
  const { confirmDeleteModal, openConfirmDeleteModal } = useConfirmDeleteModal(
    onDelete,
    `Do you want to delete range ${startTime} - ${endTime}?`
  );
  return (
    <XStack paddingHorizontal={8} paddingVertical={8} alignItems="center">
      <XStack space={4} flexGrow={1}>
        <SizableText>{startTime}</SizableText>
        <SizableText>{"-"}</SizableText>
        <SizableText>{endTime}</SizableText>
      </XStack>
      <Button variant="outlined" onPress={openConfirmDeleteModal}>
        <ExpoIcon
          iconSet="MaterialCommunityIcons"
          name="delete-outline"
          size={24}
        />
      </Button>
      {confirmDeleteModal}
    </XStack>
  );
};

export const AddBannedRangeItem = () => {
  const [isEdit, setIsEdit] = useState(false);
  const queryClient = useQueryClient();
  const createBannedRange = useCreateBannedRange({
    mutation: {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getGetBannedRangesQueryKey(),
        });
      },
    },
  });
  const resetState = () => {
    setStartTime(undefined);
    setEndTime(undefined);
  };
  const onSave = () => {
    if (!validateTime(startTime, endTime, true)) return;
    createBannedRange.mutate(
      {
        data: {
          startTime: startTime?.format(TIME_FORMAT),
          endTime: endTime?.format(TIME_FORMAT),
        },
      },
      {
        onSettled: (data, error) => {
          if (!error) {
            resetState();
            setIsEdit(false);
          } else {
            //show error
          }
        },
      }
    );
  };
  const [startTime, setStartTime] = useState<Dayjs>();
  const [endTime, setEndTime] = useState<Dayjs>();
  const { isValid, errorMessage, validateTime } = useValidateTime();
  if (!isEdit)
    return (
      <Button justifyContent="flex-start" onPress={() => setIsEdit(true)}>
        <PlusIcon size={24} color={"color"} marginRight={8} />
        <SizableText ellipsizeMode="tail" numberOfLines={1}>
          {i18n.t("settings.add_banned_range")}
        </SizableText>
      </Button>
    );
  return (
    <YStack onPress={() => setIsEdit(false)} backgroundColor={"$background"}>
      <XStack alignItems="center" width="100%">
        <XStack alignItems="center" flexGrow={1}>
        {/* <ExpoIcon
          iconSet="MaterialIcons"
          name="access-time"
          size={24}
          marginHorizontal={8}
        /> */}
        <SelectTime
          validateTime={validateTime}
          startTime={startTime}
          endTime={endTime}
          timeType="start"
          updateTime={(time) => setStartTime(time)}
        />
        <SizableText marginHorizontal={8}>-</SizableText>
        <SelectTime
          validateTime={validateTime}
          startTime={startTime}
          endTime={endTime}
          timeType="end"
          updateTime={(time) => setEndTime(time)}
        />
        </XStack>
        <Button onPress={onSave}>{i18n.t("common.save")}</Button>
      </XStack>
      {errorMessage ? (
        <SizableText color={"$red9"}>{errorMessage}</SizableText>
      ) : null}
    </YStack>
  );
};


export const BannedRangesListLoad = () => {
  const { data, isError, isLoading } = useGetBannedRanges({
    query: { refetchInterval: getRefreshInterval() },
  });
  if (isLoading) return <Spinner />;
  return <BannedRangesList data={data} />;
};
