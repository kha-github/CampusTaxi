import React from "react";
import { UserDummy } from "../../contexts/User";
import { MapRoomCard } from "../map/MapRoomCard";

export type ChatRoom = {
  // DB 스웨거 데이터폼
  id: number;
  start_address_code?: string;
  start_address?: string;
  start_address_detail?: string;
  start_lat: number;
  start_lon: number;
  end_address_code?: string;
  end_address?: string;
  end_address_detail?: string;
  end_lat: number;
  end_lon: number;
  boarding_dtm?: string;
  personnel_limit?: number;
  gender: number;
  owner?: number;
  category?: string; //"등교 데이터 가져올때는 =1"
  current?: string; // 현재 페이지인듯
  
  // 커스텀
  cost?: number;
  distance?: number;
  unreadMessage?: string;
  costTime?: number;
};

export const UserDummyList = [
  { ...UserDummy },
  { ...UserDummy, uuid: "2", gender: "MALE" },
  { ...UserDummy, uuid: "3", gender: "FEMALE" },
  { ...UserDummy, uuid: "4", gender: "MALE" },
];
export const ChatRoomDummy = {
  id: -1, //id가 -1인 경우는 Start CreateRoom만 유일하다.
  unreadMessage: undefined,
  distance: 0,
  start_address_code: undefined,
  start_address: undefined,
  start_address_detail: undefined,
  start_lat: 0,
  start_lon: 0,
  end_address: undefined,
  end_address_detail: undefined,
  end_lat: 0,
  end_lon: 0,
  boarding_dtm: undefined,
  personnel_limit: 0,
  gender: 0,
  owner: 0,
  category: undefined,
  current: undefined,
};
export const ChatRoomDummyList = [
  ChatRoomDummy,
  ChatRoomDummy,
  ChatRoomDummy,
  ChatRoomDummy,
  ChatRoomDummy,
  ChatRoomDummy,
  ChatRoomDummy,
];

export type Props = {
  onPress: (data: ChatRoom) => () => void;
  datas: ChatRoom[];
};
export const ChatRoomList: React.FC<Props> = ({ datas, onPress }) => {
  return (
    <>
      {datas.map((data) => (
        <MapRoomCard key={data.id} data={data} onPress={onPress(data)} />
      ))}
    </>
  );
};
