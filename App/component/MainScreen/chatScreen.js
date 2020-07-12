//#region imports
import React, { useState, useEffect } from "react";
import { View, FlatList, Image, TouchableOpacity, Picker } from "react-native";
import Modal from "react-native-modal";
import {
  Header,
  ListItem,
  Badge,
  Icon,
  Card,
  ButtonGroup,
} from "react-native-elements";
import campusStyle from "../../themes/campusStyle";
import DateTimePicker from "@react-native-community/datetimepicker"; //방생성시간picker
import crown from "../../image/crown.png";
import { Text, Button, Paragraph, Dialog, Portal } from "react-native-paper";
//#endregion

//채팅목록 화면
export default function chatScreen({
  route,
  navigation,
  navigation: { goBack },
}) {
  //#region Hooks & functions
  var firebase = require("firebase");
  var ref = firebase.database().ref("bbs/data");
  const filter = route.params.filter;
  //사용자 정보
  const mygender = route.params.mygender;
  const myname = route.params.myname;
  const nextRoomNumber = 1;
  const [roomList, setRoomList] = useState();
  //채팅방만들기firebase로 전송함수
  useEffect(() => {
    //bbs에서 데이터를 가져와서 firebase json 형식에서 flatlist하기 좋은 형식으로 키값을 JSON 안으로 넣는다.
    ref.once("value", function (snapshot) {
      let resultRoom = [];
      snapshot.forEach(function (snap) {
        let item = snap.val();
        item.key = snap.key;
        resultRoom.push(item);
      });
      setRoomList(resultRoom);
    });
  }, []);
  const getServerTime = () => {
    fetch("http://worldtimeapi.org/api/timezone/Asia/Seoul")
      .then((res) => res.json())
      .then((result) => setDate(new Date(result.datetime)));
  };
  //채팅방만들기시간선택
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };
  //한글로 형식 변환하기
  function _getLocaleStrting(date) {
    const localDate = new Date(date.toString());
    const week = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = week[localDate.getDay()];
    const result =
      localDate.getFullYear() +
      "년" +
      (localDate.getMonth() + 1) +
      "월" +
      localDate.getDate() +
      "일" +
      dayOfWeek +
      "요일" +
      localDate.getHours() +
      "시" +
      localDate.getMinutes() +
      "분";
    return result;
  }
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filterCategory, setFilterCategory] = useState(filter);
  const [filterStartplace, setFilterStartplace] = useState("무관");
  const [filterEndplace, setFilterEndplace] = useState("무관");
  const [filterMeetingTimeStart, setFilterMeetingTimeStart] = useState("전부");
  const [filterMeetingTimeEnd, setFilterMeetingTimeEnd] = useState("전부");
  const [filterPersonMin, setFilterPersonMin] = useState("1");
  const [filterPersonMax, setFilterPersonMax] = useState("4");

  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isCreateRoomVisible, setCreateRoomVisible] = useState(false);
  const [createRoomCategory, setCreateRoomCategory] = useState(filter);
  const [createRoompersonmax, setCreateRoompersonmax] = useState(4);
  const [createRoomstartplace, setCreateRoomstartplace] = useState();
  const [createRoomendplace, setCreateRoomendplace] = useState();
  const [createRoomGender, setCreateRoomGender] = useState(1);
  const menuList = [
    "등교",
    "하교",
    "야작",
    "독서실",
    "PC방",
    "놀이동산",
    "클럽",
    "스키장",
    "오션월드",
  ];
  const startplace = ["삼육대", "태릉입구"];
  const endplace = ["삼육대", "태릉입구", "별내역", "구리역"];
  const timeLineStart = [
    "00:00부터",
    "00:30부터",
    "01:00부터",
    "01:30부터",
    "02:00부터",
    "02:30부터",
    "03:00부터",
    "03:30부터",
    "04:00부터",
    "04:30부터",
    "05:00부터",
    "05:30부터",
    "06:00부터",
    "06:30부터",
    "07:00부터",
    "07:30부터",
    "08:00부터",
    "08:30부터",
    "09:00부터",
    "09:30부터",
    "10:00부터",
    "10:30부터",
    "11:00부터",
    "11:30부터",
    "12:00부터",
    "12:30부터",
    "13:00부터",
    "13:30부터",
    "14:00부터",
    "14:30부터",
    "15:00부터",
    "15:30부터",
    "16:00부터",
    "16:30부터",
    "17:00부터",
    "17:30부터",
    "18:00부터",
    "18:30부터",
    "19:00부터",
    "19:30부터",
    "20:00부터",
    "20:30부터",
    "21:00부터",
    "21:30부터",
    "22:00부터",
    "22:30부터",
    "23:00부터",
    "23:30부터",
  ];
  const timeLineEnd = [
    "00:00까지",
    "00:30까지",
    "01:00까지",
    "01:30까지",
    "02:00까지",
    "02:30까지",
    "03:00까지",
    "03:30까지",
    "04:00까지",
    "04:30까지",
    "05:00까지",
    "05:30까지",
    "06:00까지",
    "06:30까지",
    "07:00까지",
    "07:30까지",
    "08:00까지",
    "08:30까지",
    "09:00까지",
    "09:30까지",
    "10:00까지",
    "10:30까지",
    "11:00까지",
    "11:30까지",
    "12:00까지",
    "12:30까지",
    "13:00까지",
    "13:30까지",
    "14:00까지",
    "14:30까지",
    "15:00까지",
    "15:30까지",
    "16:00까지",
    "16:30까지",
    "17:00까지",
    "17:30까지",
    "18:00까지",
    "18:30까지",
    "19:00까지",
    "19:30까지",
    "20:00까지",
    "20:30까지",
    "21:00까지",
    "21:30까지",
    "22:00까지",
    "22:30까지",
    "23:00까지",
    "23:30까지",
  ];

  //#endregion Hooks & functions
  return (
    <>
      {/* 모달창 */}
      <>
        {/* 검색모달창 */}
        <Modal
          backdropColor="rgba(0,0,0,0)"
          isVisible={isSearchVisible}
          style={campusStyle.Modal.modalStyle}
        >
          <View style={campusStyle.Modal.view}>
            <Header
              containerStyle={campusStyle.Modal.container}
              centerComponent={{
                text: "검색",
                style: campusStyle.Modal.component,
              }}
            />
            <Button
              title="Hide modal"
              onPress={() => {
                setSearchVisible(!setSearchVisible);
              }}
            />
          </View>
        </Modal>

        {/* 필터모달창 */}
        <Modal
          backdropColor="rgba(0,0,0,0)"
          isVisible={isFilterVisible}
          style={campusStyle.Modal.modalStyle}
        >
          <View style={campusStyle.Modal.view}>
            <Header
              containerStyle={campusStyle.Modal.container}
              centerComponent={{
                text: "필터",
                style: campusStyle.Modal.component,
              }}
            />
            <View style={{ padding: 10 }}>
              <Text>카테고리</Text>
              <Picker
                selectedValue={filterCategory}
                style={{ height: 50 }}
                onValueChange={(itemValue) => {
                  setFilterCategory(itemValue);
                }}
              >
                <Picker.Item label="등교" value="등교" />
                <Picker.Item label="하교" value="하교" />
                <Picker.Item label="야작" value="야작" />
                <Picker.Item label="독서실" value="독서실" />
                <Picker.Item label="PC방" value="PC방" />
                <Picker.Item label="놀이동산" value="놀이동산" />
                <Picker.Item label="클럽" value="클럽" />
                <Picker.Item label="스키장" value="스키장" />
                <Picker.Item label="오션월드" value="오션월드" />
              </Picker>
              <Text>출발장소</Text>
              <Picker
                selectedValue={filterStartplace}
                style={{ height: 50 }}
                onValueChange={(itemValue) => {
                  setFilterStartplace(itemValue);
                }}
              >
                <Picker.Item label="무관" value="무관" />
                {startplace.map((item) => (
                  <Picker.Item label={item} value={item} />
                ))}
              </Picker>
              <Text>도착장소</Text>
              <Picker
                selectedValue={filterEndplace}
                style={{ height: 50 }}
                onValueChange={(itemValue) => {
                  setFilterEndplace(itemValue);
                }}
              >
                <Picker.Item label="무관" value="무관" />
                {endplace.map((item) => (
                  <Picker.Item label={item} value={item} />
                ))}
              </Picker>
              <Text>탑승시간</Text>
              <View style={campusStyle.View.row}>
                <View style={campusStyle.View.flex}>
                  <Picker
                    selectedValue={filterMeetingTimeStart}
                    onValueChange={(itemValue) => {
                      setFilterMeetingTimeStart(itemValue);
                    }}
                  >
                    <Picker.Item label="전부" value="전부" />
                    {timeLineStart.map((item) => (
                      <Picker.Item label={item} value={item} />
                    ))}
                  </Picker>
                </View>
                <View style={campusStyle.View.flex}>
                  <Picker
                    selectedValue={filterMeetingTimeEnd}
                    onValueChange={(itemValue) => {
                      setFilterMeetingTimeEnd(itemValue);
                    }}
                  >
                    <Picker.Item label="전부" value="전부" />
                    {timeLineEnd.map((item) => (
                      <Picker.Item label={item} value={item} />
                    ))}
                  </Picker>
                </View>
              </View>
              <Text>탑승인원</Text>
              <View style={campusStyle.View.row}>
                <View style={campusStyle.View.flex}>
                  <Picker
                    selectedValue={filterPersonMin}
                    onValueChange={(itemValue) => {
                      setFilterPersonMin(itemValue);
                    }}
                  >
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                  </Picker>
                </View>
                <View style={campusStyle.View.flex}>
                  <Picker
                    selectedValue={filterPersonMax}
                    onValueChange={(itemValue) => {
                      setFilterPersonMax(itemValue);
                    }}
                  >
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                  </Picker>
                </View>
              </View>
            </View>
            <Button
              title="Hide modal"
              onPress={() => {
                setFilterVisible(!isFilterVisible);
              }}
            />
          </View>
        </Modal>
      </>
      {/* 채팅목록 출력부분 */}
      <FlatList
        keyExtractor={(item, index) => index}
        data={roomList}
        renderItem={({ item, index }) => {
          if (item != null && filterCategory == item.c) {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("채팅방", {
                    bbskey: item.b,
                    gender: item.h,
                    leadername: item.i,
                    startplace: item.n,
                    endplace: item.g,
                    mygender: mygender,
                    myname: myname,
                  })
                }
              >
                <Card containerStyle={campusStyle.Card.container}>
                  <ListItem
                    leftAvatar={
                      <View
                        style={{
                          borderRadius: 100,
                          width: 62,
                          height: 62,
                          backgroundColor:
                            item.h == "woman"
                              ? "#DE22A3"
                              : item.h == "man"
                              ? "#55A1EE"
                              : "#3A3A3A",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={campusStyle.Text.middleBold}>{index}</Text>
                        <Text style={campusStyle.Text.middleBold}>
                          {item.h == "woman"
                            ? "여자"
                            : item.h == "man"
                            ? "남자"
                            : "남 여"}
                        </Text>
                      </View>
                    }
                    title={
                      <View style={campusStyle.View.row}>
                        <View style={{ flex: 6 }}>
                          <View style={campusStyle.View.row}>
                            <Image source={crown} />
                            <Text>{item.i}</Text>
                          </View>
                          <Text>출발지:{item.n}</Text>
                          <Text>도착지:{item.g}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          {(() => {
                            if (item.k === item.m)
                              return (
                                <Text style={campusStyle.Text.red}>
                                  {item.m}/{item.k}
                                </Text>
                              );
                            else
                              return (
                                <Text>
                                  {item.m}/{item.k}
                                </Text>
                              );
                          })()}
                        </View>
                        <View style={{ flex: 2, alignItems: "flex-end" }}>
                          <Text style={campusStyle.Text.grayDDark}>
                            {item.j}
                          </Text>
                          <Text style={campusStyle.Text.grayDDark}>
                            {item.a}
                          </Text>
                          <Badge
                            textStyle={campusStyle.Badge.textStyle}
                            value={0}
                            status="warning"
                          />
                        </View>
                      </View>
                    }
                  />
                </Card>
              </TouchableOpacity>
            );
          }
        }}
      />
      {/* 방만들기 버튼부분 */}
      <View style={campusStyle.View.createRoomView}>
        <TouchableOpacity
          style={campusStyle.Button.createRoomBtn}
          onPress={() => {
            setCreateRoomVisible(!isCreateRoomVisible);
          }}
        >
          <Icon name="add" size={32} color="white" />
          <Text style={campusStyle.Text.smallSize}>방만들기</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
