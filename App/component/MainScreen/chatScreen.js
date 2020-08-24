//#region imports
import React, { useState, useEffect } from "react";
import { View, FlatList, Image, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-community/picker";
import Modal from "react-native-modal";
import {
  Header,
  ListItem,
  Icon,
  Text,
  Card,
  Button,
  ButtonGroup,
  Input,
} from "react-native-elements";
import campusStyle from "style";
import DateTimePicker from "@react-native-community/datetimepicker"; //방생성시간picker
import crown from "image/crown.png";
const firebase = require("firebase");
import { bbsStore, userStore } from "store";
import { Observer } from "mobx-react";
//#endregion

//채팅목록 화면
export default function chatScreen({ route, navigation }) {
  //#region Hooks & functions
  const userkey = userStore.user.f;
  useEffect(() => {
    bbsStore.getAllBbs();
    updateUserdata(userkey);
    placeUpdate();
  }, [userkey]);
  const filter = route.params.filter;
  const [roomList, setRoomList] = useState(bbsStore.bbs);

  //#region 유저정보 업데이트
  const [myname, setname] = useState(userStore.user.h);
  const [mygender, setgender] = useState(userStore.user.d);
  function updateUserdata(userkey) {}
  //유저가 들어간 채팅방의 개수를 알려줍니다.
  const [myRoomCount, setMyRoomCount] = useState(0);
  async function checkUserEnterChatRoom() {
    await firebase
      .database()
      .ref("user/data/" + userkey + "/c")
      .once("value", (snapshot) => {
        setMyRoomCount(Object.keys(snapshot).length);
      });
    return myRoomCount;
  }
  //#endregion
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filterCategory, setFilterCategory] = useState(filter);
  const [filterStartplace, setFilterStartplace] = useState("무관");
  const [filterEndplace, setFilterEndplace] = useState("무관");
  const [filterMeetingTimeStart, setFilterMeetingTimeStart] = useState("전부");
  const [filterMeetingTimeEnd, setFilterMeetingTimeEnd] = useState("전부");
  const [filterPersonMin, setFilterPersonMin] = useState("1");
  const [filterPersonMax, setFilterPersonMax] = useState("4");
  
  // 승우 작업 - Filtering in All chat list
  function search(user){
    return Object.keys(this).every((key) => user[key] === this[key]);
  }

  function getFiltferBbs() {
    let result;
    /* if (!(filterMeetingTimeEnd == "전부")) {
      result = firebase.database().ref("bbs/data").
    } else if (!(filterMeetingTimeStart == "전부")) {
      result = firebase.database().ref("bbs/data").
    }
    if (!(filterMeetingTimeStart == "전부" && filterMeetingTimeEnd == "전부")) {
      let result = bbsStore.bbs;
    } */
    
    result = bbsStore.bbs;
    let query = {
      c: filterCategory,
    }
    query.h = Number(filterPersonMin);
    query.k = Number(filterPersonMax);
    if (!(filterStartplace=="무관")) {
      query.n = filterStartplace;
    }
    if (!(filterEndplace=="무관")) {
      query.g = filterEndplace;
    }


    /* let query = {
      c : filterCategory, // 카테고리
      n : filterStartplace, // 출발지
      g : filterEndplace, // 도착지
      k : filterPersonMax, // 탑승인원 최대
      h : filterPersonMin, // 탑승인원 최소
    };
    if (filterEndplace == "무관") {
      query = {
        c : filterCategory, // 카테고리
        n : filterStartplace, // 출발지
        k : filterPersonMax, // 탑승인원 최대
        h : filterPersonMin, // 탑승인원 최소
      };
    } else if (filterStartplace == "무관") {
      query = {
        c : filterCategory, // 카테고리
        g : filterEndplace, // 도착지
        k : filterPersonMax, // 탑승인원 최대
        h : filterPersonMin, // 탑승인원 최소
      };
    } else if (filterEndplace == "무관" && filterStartplace == "무관") {
      query = {
        c : filterCategory
      };
    } */


    result = result.filter(search, query);
    alert(JSON.stringify(result));
    setRoomList(result);
    //console.log(bbsStore.bbs);
  }

  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isCreateRoomVisible, setCreateRoomVisible] = useState(false);
  const [createRoomCategory, setCreateRoomCategory] = useState(filter);
  const [createRoompersonmax, setCreateRoompersonmax] = useState(4);
  const [createRoomstartplace, setCreateRoomstartplace] = useState();
  const [createRoomendplace, setCreateRoomendplace] = useState();
  const [createRoomGender, setCreateRoomGender] = useState(1);
  const [createSelectGender, setCreateSelectGender] = useState(2);

  const [startplace, setStartplace] = useState([]);
  const [endplace, setEndplace] = useState([]);
  //endplace와 startplace를 서버데이터로 업데이트합니다.
  function placeUpdate() {
    firebase
      .database()
      .ref("place/data/startplace")
      .once("value", (snapshot) => {
        let arr = [];
        snapshot.forEach((snap) => {
          arr.push(snap.key);
        });
        setStartplace(arr);
      });
    firebase
      .database()
      .ref("place/data/endplace")
      .once("value", (snapshot) => {
        let arr = [];
        snapshot.forEach((snap) => {
          arr.push(snap.key);
        });
        setEndplace(arr);
      });
  }

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
      <Header
        containerStyle={{
          height: 64,
        }}
        backgroundColor="#0D3664"
        leftComponent={
          <Button
            type="clear"
            title=""
            icon={<Icon name="arrow-back" size={24} color="white" />}
            onPress={() => navigation.goBack()}
          ></Button>
        }
        centerComponent={{
          text: "모든 채팅방 목록",
          style: campusStyle.Text.middleBold,
        }}
        rightComponent={
          <View style={campusStyle.View.row}>
            <Button
              type="clear"
              title=""
              icon={<Icon name="filter-list" size={24} color="white" />}
              onPress={() => {
                setFilterVisible(true);
              }}
            />
            <Button
              type="clear"
              title=""
              icon={<Icon name="search" size={24} color="white" />}
              onPress={() => {
                setSearchVisible(true);
              }}
            />
          </View>
        }
      />
      {/* 채팅목록 출력부분 */} 
      <FlatList
        keyExtractor={(item) => item.b}
        data={roomList}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                if (true) {
                  //checkUserEnterChatRoom() < 2
                  firebase
                    .database()
                    .ref("bbs/data/" + item.b + "/l/" + userStore.userkey)
                    .set(1);
                  firebase
                    .database()
                    .ref("user/data/" + userStore.userkey + "/c/" + item.b)
                    .set(1);
                  navigation.navigate("채팅방", {
                    bbskey: item.b,
                    gender: item.h,
                    leadername: item.i,
                    startplace: item.n,
                    endplace: item.g,
                    mygender: mygender,
                    myname: myname,
                    meetingdate: item.j,
                    personmember: item.i,
                    personmax: item.k,
                  });
                } else {
                  alert(
                    "채팅방은 최대 1개만 들어갈 수 있습니다. 내 채팅->채팅방->사람아이콘 클릭 에서 채팅방 나가기를 해주세요."
                  );
                }
              }}
              style={{ backgroundColor: "white", padding: 10 }}
            >
              <View style={campusStyle.View.row}>
                <View
                  style={{
                    borderRadius: 100,
                    width: 62,
                    height: 62,
                    backgroundColor:
                      item.h == 0
                        ? "#579FEE"
                        : item.h == 1
                        ? "#C278DE"
                        : "#3A3A3A",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={campusStyle.Text.middleBold}>{index}</Text>
                  <Text style={campusStyle.Text.middleBold}>
                    {item.h == 0 ? "남자" : item.h == 1 ? "여자" : "모두"}
                  </Text>
                </View>
                <View style={{ flex: 6 }}>
                  <View style={campusStyle.View.row}>
                    <Image
                      style={{ width: 23, height: 15, marginLeft: 10 }}
                      source={crown}
                    />
                    <Text>{item.i}</Text>
                  </View>
                  <Text style={{ marginLeft: 10 }}>출발지:{item.n}</Text>
                  <Text style={{ marginLeft: 10 }}>도착지:{item.g}</Text>
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
                <View style={{ flex: 3, alignItems: "center" }}>
                  <Text style={campusStyle.Text.grayDDark}>탑승시간▼</Text>
                  <Text style={campusStyle.Text.grayDDark}>
                    {userStore.globalTimeTolocalTime(item.f)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
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
      {/* 모달창 */}
      {/* 방만들기모달창 */}
      {isCreateRoomVisible ? (
        <Modal
          backdropColor="rgba(0,0,0,0)"
          isVisible={isCreateRoomVisible}
          style={campusStyle.Modal.modalStyle}
        >
          <View style={campusStyle.Modal.view}>
            <Header
              containerStyle={campusStyle.Modal.container}
              centerComponent={{
                text: "방만들기",
                style: campusStyle.Modal.component,
              }}
            />
            <View style={{ padding: 10 }}>
              <Text>카테고리</Text>
              <Picker
                selectedValue={createRoomCategory}
                onValueChange={(itemValue) => {
                  setCreateRoomCategory(itemValue);
                }}
              >
                <Picker.Item color="gray" label={filter} />
                {menuList.map((item) =>
                  item != filter ? (
                    <Picker.Item label={item} value={item} />
                  ) : null
                )}
              </Picker>
              <Text>출발장소</Text>
              <Picker
                selectedValue={createRoomstartplace}
                onValueChange={(itemValue) => {
                  setCreateRoomstartplace(itemValue);
                }}
              >
                <Picker.Item value="" label="출발장소를 선택해주세요." />
                {startplace.map((item) => (
                  <Picker.Item label={item} value={item} />
                ))}
              </Picker>
              <Text>도착장소</Text>
              <Picker
                selectedValue={createRoomendplace}
                onValueChange={(itemValue) => {
                  setCreateRoomendplace(itemValue);
                }}
              >
                <Picker.Item value="" label="도착장소를 선택해주세요." />
                {endplace.map((item) => (
                  <Picker.Item label={item} value={item} />
                ))}
              </Picker>
              <Text>탑승 시간</Text>
              <Text style={campusStyle.Text.center}>
                {_getLocaleStrting(date)}
              </Text>
              <View style={campusStyle.View.row}>
                <View style={campusStyle.View.flex}>
                  <Button
                    buttonStyle={campusStyle.Button.marginTopAndBottom5}
                    onPress={showDatepicker}
                    title="날짜 선택"
                  />
                </View>
                <View style={campusStyle.View.flex}>
                  <Button
                    buttonStyle={campusStyle.Button.marginTopAndBottom5}
                    onPress={showTimepicker}
                    title="시간 선택"
                  />
                </View>
              </View>
              {/* 날짜선택 Picker창 */}
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}
              <Text>탑승 인원</Text>
              <ButtonGroup
                selectedButtonStyle={{ backgroundColor: "#F8BD3C" }}
                textStyle={{ fontSize: 20 }}
                selectedIndex={createRoompersonmax - 2}
                onPress={(index) => setCreateRoompersonmax(index + 2)}
                buttons={["2", "3", "4"]}
              ></ButtonGroup>
              <Text>입장 제한 성별</Text>
              <ButtonGroup
                selectedButtonStyle={{ backgroundColor: "#F8BD3C" }}
                textStyle={{ fontSize: 16 }}
                selectedIndex={createRoomGender}
                onPress={(index) => {
                  if (index == 0) {
                    setCreateRoomGender(0);
                    setCreateSelectGender(Number(userStore.user.d));
                  } else {
                    setCreateRoomGender(1);
                    setCreateSelectGender(2);
                  }
                }}
                buttons={["동성만", "남녀모두"]}
              ></ButtonGroup>
            </View>
            <View style={campusStyle.View.rowflexBtnGroup}>
              <Button
                name="myButtonName"
                buttonStyle={campusStyle.Button.groupActive}
                title="방 생성"
                onPress={() => {
                  if (
                    createRoomendplace == null ||
                    createRoomstartplace == null
                  ) {
                    alert("출발지 또는 도착지를 선택해주세요.");
                  } else {
                    bbsStore.addBbs(
                      createRoomCategory,
                      createRoomendplace,
                      createSelectGender,
                      myname,
                      date,
                      createRoompersonmax,
                      createRoomstartplace,
                      userStore.userkey
                    );
                    setCreateRoomVisible(!isCreateRoomVisible);
                  }
                }}
              />
              <Button
                name="myButtonName"
                buttonStyle={campusStyle.Button.groupCancel}
                title="취소"
                onPress={() => setCreateRoomVisible(!isCreateRoomVisible)}
              />
            </View>
          </View>
        </Modal>
      ) : null}

      {/* 검색모달창 */}
      {isSearchVisible ? (
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
            <Input type="text" name="Search" autoFocus />
            <Button
              title="Hide modal"
              onPress={() => {
                setSearchVisible(!setSearchVisible);
              }}
            />
          </View>
        </Modal>
      ) : null}
      {/* 필터모달창 */}
      {isFilterVisible ? (
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
            <Button title="Check" onPress={getFiltferBbs} />
          </View>
        </Modal>
      ) : null}
    </>
  );
}
