import React, { Component, useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  Text,
} from "react-native";
import { Input, Badge } from "react-native-elements";
import campusStyle from "style";
import crown from "image/crown.png";
const firebase = require("firebase");

import userStore from "store/userStore";

export default function MychatScreen({ route, navigation }) {
  const [roomList, setRoomList] = useState();
  const [inital, setInital] = useState(true);
  const [userkey, setUserkey] = useState("");

  useEffect(() => {
    //userkey 넣기
    route.params ? setUserkey(route.params.userkey) : null;
    //해당 유저의 keyy를 이용하여 내 채팅 목록을 채워넣음

    let resultarr = [];
    Object.values(userStore.user.c).forEach((i) => resultarr.push(i));
    setRoomList(resultarr);
    setInital(false);
    updateUserdata(userkey);
  }, [userkey]);

  //새로고침
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  //#region 유저정보 업데이트
  const [myname, setMyname] = useState();
  const [mygender, setMygender] = useState();

  function updateUserdata(userkey) {
    getMyname(userkey);
    getMygender(userkey);
  }
  function getMyname(userkey) {
    firebase
      .database()
      .ref("user/data/" + userkey + "/h")
      .once("value", (snapshot) => setMyname(snapshot.val()));
  }
  function getMygender(userkey) {
    firebase
      .database()
      .ref("user/data/" + userkey + "/d")
      .once("value", (snapshot) => setMygender(snapshot.val()));
  }
  //#region Hooks & functions

  return (
    <>
      {inital && (
        <View style={campusStyle.View.default}>
          <Text>데이터를 받아오는 중입니다. 새로고침을 해주세요.</Text>
        </View>
      )}
      <FlatList
        keyExtractor={(item) => item.id}
        data={roomList}
        extraData={roomList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item, index }) => {
          if (item != null) {
            return (
              <TouchableOpacity
                onPress={() => {
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
                    <Text style={campusStyle.Text.grayDDark}>출발시간▼</Text>
                    <Text style={campusStyle.Text.grayDDark}>
                      {String(item.j)
                        .replace("년", "/")
                        .replace("월", "/")
                        .replace("일", "(")
                        .replace("요일", ")")
                        .replace("시", ":")
                        .replace("분", "")}
                    </Text>
                    <Text style={campusStyle.Text.grayDDark}>{item.a}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }
        }}
      />
    </>
  );
}
