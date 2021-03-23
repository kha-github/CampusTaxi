import React, { Dispatch, SetStateAction } from 'react';
import styled from '@emotion/native';
import { Platform, Text, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MapView } from '../../components/map/MapView';
import { MapController } from '../../components/map/MapController';
import { SwipeableView } from '../../components/map/SwipeableView';
import { MapRoomCard } from '../../components/map/MapRoomCard';
import { SelectedBottomView } from '../../components/map/SelectedBottomView';
import { GuideCenterSVG } from '../../components/map/GuideCenterSVG';
import { SelectBottomPosView } from '../../components/map/SelectBottomPosView';
import { ChatRoom, ChatRoomDummy } from '../../components/chat-room/ChatRoomList';
import { MapBottomButton } from '../../components/map/MapBottomButton';
import NaverMapView, { Coord } from 'react-native-nmap';
import axios from 'axios';
import { GOOGLE_MAPAPI_URL } from '../../constant';

//distance 계산 필요
const list = [{// TEST CODE 
	id: 1,
	unreadMessage: 'string',
	distance: 1.1,
	start_address_code: 'string',
	start_address: '태릉입구역 2번출구',
	start_address_detail: '태릉입구역 2번출구',
	start_lat: 0,
	start_lon: 0,
	end_address: '삼육대학교',
	end_address_detail: '삼육대학교 분수대 앞',
	end_lat: 37.64353854399491,
	end_lon: 127.10579154192136,
	boarding_dtm: 'string',
	personnel_limit: 4,
	gender: 0,
	owner: 1,
	category: 'string',
	current: 'string',
}, {
	id: 2,
	unreadMessage: 'string',
	distance: 1.1,
	start_address_code: 'string',
	start_address: '태릉입구역 7번출구',
	start_address_detail: '태릉입구역 7번출구',
	start_lat: 37.61770651126973,
	start_lon: 127.07611602070332,
	end_address: '삼육대학교',
	end_address_detail: '삼육대학교 분수대 앞',
	end_lat: 37.64353854399491,
	end_lon: 127.10579154192136,
	boarding_dtm: 'string',
	personnel_limit: 4,
	gender: 1,
	owner: 2,
	category: 'string',
	current: 'string',
}, {
	id: 3,
	unreadMessage: 'string',
	distance: 2.1,
	start_address_code: 'string',
	start_address: '태릉입구역 7번출구',
	start_address_detail: '태릉입구역 7번출구',
	start_lat: 37.61770651126973,
	start_lon: 127.07611602070332,
	end_address: '삼육대학교',
	end_address_detail: '삼육대학교 분수대 앞',
	end_lat: 37.64353854399491,
	end_lon: 127.10579154192136,
	boarding_dtm: 'string',
	personnel_limit: 4,
	gender: 2,
	owner: 1,
	category: 'string',
	current: 'string',
}, {
	id: 4,
	unreadMessage: 'string',
	distance: 2.4,
	start_address_code: 'string',
	start_address: '태릉입구역 7번출구',
	start_address_detail: '태릉입구역 7번출구',
	start_lat: 37.617753979295095,
	start_lon: 127.07629280500707,
	end_address: '삼육대학교',
	end_address_detail: '삼육대학교 분수대 앞',
	end_lat: 37.64353854399491,
	end_lon: 127.10579154192136,
	boarding_dtm: 'string',
	personnel_limit: 4,
	gender: 0,
	owner: 0,
	category: 'string',
	current: 'string',
}, {
	id: 5,
	unreadMessage: 'string',
	distance: 5.1,
	start_address_code: 'string',
	start_address: '공릉역 2번출구',
	start_address_detail: '공릉역 2번출구',
	start_lat: 37.625317280381715,
	start_lon: 127.07327644534814,
	end_address: '삼육대학교',
	end_address_detail: '삼육대학교 분수대 앞',
	end_lat: 37.64353854399491,
	end_lon: 127.10579154192136,
	boarding_dtm: 'string',
	personnel_limit: 3,
	gender: 1,
	owner: 5,
	category: 'string',
	current: '3',
}, {
	id: 6,
	unreadMessage: 'string',
	distance: 1.1,
	start_address_code: 'string',
	start_address: '태릉입구역 2번출구',
	start_address_detail: '태릉입구역 2번출구',
	start_lat: 37.618404661690704,
	start_lon: 127.07521073018373,
	end_address: '삼육대학교',
	end_address_detail: '삼육대학교 분수대 앞',
	end_lat: 37.64353854399491,
	end_lon: 127.10579154192136,
	boarding_dtm: 'string',
	personnel_limit: 4,
	gender: 0,
	owner: 1,
	category: 'string',
	current: 'string',
}]

type Props = {
	route: any;
};

export type myCoordProps = {
  latitude: number;
  longitude: number;
	zoom?: number;
	name?: string;
}

export const CreateScreen: React.FC<Props> = ({
	route
}) => {
	//roomType : 0 1 2 순서대로 등교 하교 기타
	//value 정해진 출발이나 도착지
	const start_init: myCoordProps = {
		latitude: route.params.type == 1 ? 37.64353854399491 : 0, // TEST CODE 삼육대학교 분수대앞 위치 추후 사용자학교로 변경필요
		longitude: route.params.type == 1 ? 127.10579154192136 : 0,
		name: route.params.type != 1 ? '' : route.params.value,
		zoom: 0
	}
	const end_init: myCoordProps = {
		latitude: route.params.type == 0 ? 37.64353854399491 : 0, // TEST CODE 삼육대학교 분수대앞 위치 추후 사용자학교로 변경필요
		longitude: route.params.type == 0 ? 127.10579154192136 : 0,
		name: route.params.type != 0 ? '' : route.params.value,
		zoom: 0
	}
	const [start, setStart] = React.useState<myCoordProps>(start_init);
	const [end, setEnd] = React.useState<myCoordProps>(end_init);
	const [selectRoom, setSelectRoom] = React.useState<ChatRoom>();
	const [datas, setDatas] = React.useState <ChatRoom[]>(list);
	const [myCoord, setMyCoord] = React.useState<myCoordProps>({ latitude: 0, longitude: 0, zoom: 16 })
	const MapRef = React.useRef<NaverMapView>(null);
	const onCancelPress = () => {
		setSelectRoom(undefined)
		setDatas(datas.filter(d => d.id != -1));
		setStart(route.params.value != 1 ? start_init : start);
		setEnd(route.params.value != 0 ? end_init : end);
	}
	const onPressPosSetButton = (
		type: 'start' | 'end' | 'searchStart' | 'searchEnd',
		value: myCoordProps,
		checkvalue: myCoordProps,
		onPress: Dispatch<SetStateAction<myCoordProps>>,
		searchData?: myCoordProps
	) => {
		onPress({ ...value, name: '데이터 가져오는중' }) //로딩
		if (myCoord.latitude < 38.64 && myCoord.latitude > 33
			&& myCoord.longitude < 130 && myCoord.longitude > 125) {
				if (type == 'start' || type == 'end')
				{
					axios.post(
						`https://maps.googleapis.com/maps/api/geocode/json?latlng=` +
						myCoord.latitude + `,` +
						myCoord.longitude +
						`&key=${GOOGLE_MAPAPI_URL}` + `&language=ko`,
					).then((r: any) => {
						const addressName = (!!r) ? r.data.results[0].formatted_address
							: "(" + myCoord.latitude + "," + myCoord.longitude + ")";
						let CreateRoom = (datas[0].id == -1) ? datas[0] : ChatRoomDummy;
						//id가 -1인 경우는 CreateRoom만 유일하다.
						//value가 undefined값은 방만들때 다시 정해줘야한다.boarding_dtm gender personnel_limit
						CreateRoom = (type == 'start') ? {
							...CreateRoom,
							start_address: addressName,
							start_address_detail: addressName,
							start_lat: myCoord.latitude,
							start_lon: myCoord.longitude,
						} : {
								...CreateRoom,
								end_address: addressName,
								end_address_detail: addressName,
								end_lat: myCoord.latitude,
								end_lon: myCoord.longitude,
							};
						onPress({ ...myCoord, name: addressName })
						//기존 -1 방삭제하고 넣기
						setDatas([CreateRoom, ...datas.filter(d => d.id != -1)]);
						if (checkvalue)
							setSelectRoom(CreateRoom);
					}).catch((e) => Alert.alert(e.toString()))
				} else if (searchData){
					let CreateRoom = (datas[0].id == -1) ? datas[0] : ChatRoomDummy;
					//id가 -1인 경우는 CreateRoom만 유일하다.
					//value가 undefined값은 방만들때 다시 정해줘야한다.boarding_dtm gender personnel_limit
					CreateRoom = (type == 'searchStart') ? {
						...CreateRoom,
						start_address: searchData.name,
						start_address_detail: searchData.name,
						start_lat: searchData.latitude,
						start_lon: searchData.longitude,
						end_address: end.name,
						end_address_detail: end.name,
						end_lat: end.latitude,
						end_lon: end.longitude,
					} : {
							...CreateRoom,
							start_address: start.name,
							start_address_detail: start.name,
							start_lat: start.latitude,
							start_lon: start.longitude,
							end_address: searchData.name,
							end_address_detail: searchData.name,
							end_lat: searchData.latitude,
							end_lon: searchData.longitude,
						};
					onPress({ ...searchData, name: searchData.name })
					//기존 -1 방삭제하고 넣기
					console.log(CreateRoom)
					setDatas([CreateRoom, ...datas.filter(d => d.id != -1)]);
					if (CreateRoom.start_lat && CreateRoom.end_lat)
						MapMove([{ latitude: CreateRoom.start_lat, longitude: CreateRoom.start_lon },
							{ latitude: CreateRoom.end_lat, longitude: CreateRoom.end_lon }])
					if (checkvalue)
						setSelectRoom(CreateRoom);
				}
		} else
			Alert.alert("잘못된 위치: 대한민국 밖의 위도 경도입니다.");
	}
	const SwipeableViewOnPress = (data: ChatRoom) => {
		setSelectRoom(data);
		setStart({
			latitude: data.start_lat,
			longitude: data.start_lon,
			name: data.start_address_detail,
			zoom: 0,
		})
		setEnd({
			latitude: data.end_lat,
			longitude: data.end_lon,
			name: data.end_address_detail,
			zoom: 0,
		})
		MapMove([{
			latitude: data.start_lat,
			longitude: data.start_lon
		}, {
			latitude: data.end_lat,
			longitude: data.end_lon
		}])
	}
	const MapMove = (datas: [Coord, Coord]) => {
		if (MapRef)
			MapRef.current.animateToTwoCoordinates({
				latitude: datas[0].latitude,
				longitude: datas[0].longitude
			}, {
				latitude: datas[1].latitude,
				longitude: datas[1].longitude
			})
	}
	return <>
		<MapController
			onPressPosSetButton={onPressPosSetButton}
			roomType={route.params.type}
			start={start}
			end={end}
			setEndState={setEnd}
			setStartState={setStart} />
		<MapView
			MapRef={MapRef}
			onTouch={() => { }}
			onMapClick={() => { }}
			onMakerClick={SwipeableViewOnPress}
			onCameraChange={(pos: myCoordProps) =>setMyCoord(pos)}
			datas={datas}
			selectedMaker={selectRoom} />
		<SwipeableView datas={datas} onPress={SwipeableViewOnPress} />
			<SelectedRoomView>
				<MapRoomCard
					activeCancelBtn={true}
					data={selectRoom}
					backgroundColor={"rgba(233,235,255,0.8)"}
					onCancelPress={onCancelPress} />
			</SelectedRoomView>
		{selectRoom?.start_lon && selectRoom?.end_lon ?
			<SelectedBottomView data={selectRoom} /> :
			<SelectBottomPosView type={route.params.type}
				onPressStart={() => onPressPosSetButton('start', start, end, setStart)}
				onPressEnd={() => onPressPosSetButton('end', end, start, setEnd)} />}
		<GuideCenterSVG />
		<MapBottomButton onPress={() => console.log("start.longitude", selectRoom)} selectRoom={selectRoom} start={start} end={end}/>
	</>
}

const SelectedRoomView = styled.View`
	position:absolute;
	top:0;
	marginTop:100px;
	width:100%;
`;
