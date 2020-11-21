// #사용법
// 1. import { userStore } from "../store/store";
// 2. onPress={() => userStore.addUser(1, 2, 3, 4, 5, 6, 7, 8,9,10)}
import { observable, action, reaction, autorun, runInAction } from 'mobx';
import axios from 'axios';
import React, { Component } from 'react';
export const AuthContext = React.createContext();

export default class UserStore {
  state = observable({ user: null });

  // REST API. 기본 CRUD 구성방식
  // 반환: JSON형식, 없으면 null 리턴.

  // User테이블
  // createUser
  // fetch(<EC2:url>/user/create/loginid/.../loginpassword/...) 모든값
  // readUser
  // fetch(<EC2:url>/user/read/userid/userid값)
  // updateUser
  // fetch(<EC2:url>/user/update/userid/userid값/loginid/수정할값)특정값 1개
  // updateUserAll
  // fetch(<EC2:url>/user/updateall/userid/userid값/loginid/수정할값/loginpassword/수정할값2/address/서울특별시/...) 모든 값 대입 수정
  // deleteUser
  // fetch(<EC2:url>/user/delete/userid/userid값)

  // Bbs테이블: createBbs/readBbs/updateBbs/updateBbsAll/deleteBbs
  // user와 마찬가지
  // *단 채팅 내용을 가져올 경우 userid값을 usernickname으로 바꾸어주어야함

  // 채팅: bbs.chats(JSON) appendChat/readChat/deleteChat
  // appendChat
  // fetch(<EC2:url>/bbs/chat/append/bbsid/bbsid값/userid/userid값/say/말한내용/time/시간/isSys/isSys값)
  // fetch(<EC2:url>/bbs/chat/read/bbsid/...)
  // fetch(<EC2:url>/bbs/chat/delete/bbsid/.../chatid/chatid배열인덱스값)

  // 그외: login / readBbsType / readBbs / isEnter / isCreate

  //#region USER
  imageUpload(file) {
    var RNFS = require("react-native-fs");
    const imagePath = `${RNFS.MainBundlePath}/${new Date().toISOString()}.jpg`.replace(/:/g, '-');
    if (Platform.OS === 'ios') {
      RNFS.copyAssetsFileIOS(file.origURL, imagePath, 0, 0)
        .then(res => { })
        .catch(err => {
          console.log('ERROR: image file write failed!!!');
          console.log(err.message, err.code);
        });
    } else if (Platform.OS === 'android') {
      RNFS.copyFile(file.uri, imagePath)
        .then(res => { })
        .catch(err => {
          console.log('ERROR: image file write failed!!!');
          console.log(err.message, err.code);
        });
    }

    // const uri = String(file.uri).replace("file:/", "");
    // const temp = new Parse.File("thumbnail-image.jpg", uri, "image/png");
    // temp.save();
  }
  createUser(loginid, loginpassword, email, nickname, phone, name, address, studentCard, univ, gender, policy) {
    const temp = new Parse.File(name + ".png", studentCard, "image/png");
    temp.save();
    console.log(temp);
    const User = Parse.Object.extend('User');
    const obj = new User();
    obj.set('username', loginid);
    obj.set('password', loginpassword);
    obj.set('email', email);
    obj.set('nickname', nickname);
    obj.set('phone', phone);
    obj.set('safePhone', '0100000000');
    obj.set('userPoint', 1);
    obj.set('name', name);
    obj.set('address', address);
    // obj.set('studentCard', file);
    obj.set('univ', univ);
    obj.set('gender', gender);
    obj.set('userStatus', 1);
    obj.set('policy', policy);
    obj.save().then(
      (result) => {
        if (typeof document !== 'undefined') document.write(`User created: ${JSON.stringify(result)}`);
        console.log('User created', result);
      }, (error) => {
        if (typeof document !== 'undefined') document.write(`Error while creating User: ${JSON.stringify(error)}`);
        console.error('Error while creating User: ', error);
      }
    );
  }
  async readUser_objid(objid) {
    const User = Parse.Object.extend('User');
    const query = new Parse.Query(User);
    return await query.get(objid);
  }
  async readUser_filter(rows, val) {
    const User = Parse.Object.extend('User');
    let query = new Parse.Query(User);
    query.equalTo(rows, val);
    return await query.find();
  }
  updateUser(objKey, row, value) {
    const User = Parse.Object.extend('User');
    const query = new Parse.Query(User);
    query.get(objKey).then((object) => {
      object.set(row, value);
      object.save().then((response) => {
        if (typeof document !== 'undefined') document.write(`Updated User: ${JSON.stringify(response)}`);
        console.log('Updated User', response);
      }, (error) => {
        if (typeof document !== 'undefined') document.write(`Error while updating User: ${JSON.stringify(error)}`);
        console.error('Error while updating User', error);
      });
    });
  }
  deleteUser(objKey) {
    const User = Parse.Object.extend('User');
    const query = new Parse.Query(User);
    query.get(objKey).then((object) => {
      object.destroy().then((response) => {
        if (typeof document !== 'undefined') document.write(`Deleted User: ${JSON.stringify(response)}`);
        console.log('Deleted User', response);
      }, (error) => {
        if (typeof document !== 'undefined') document.write(`Error while deleting User: ${JSON.stringify(error)}`);
        console.error('Error while deleting User', error);
      });
    });
  }
  async login(username, password) {//id=user.username
    await Parse.User.logIn(username, password).then((r) => { this.user = r }).catch(error => {
      this.user = null;
      alert('로그인에 실패했습니다. 아이디, 비밀번호를 확인해주세요.\n' + error);
    });
    return this.user;
  }
  logout() { Parse.User.logOut(this.user.sessionToken); this.user = null; }
  verifyingEmail(email) {
    axios({
      method: 'post',
      url: '/user/12345',
      data: {
        firstName: 'Fred',
        lastName: 'Flintstone'
      }
    });
    axios.post('https://parseapi.back4app.com', { email: email })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    // const https = require('axios');
    // const params = '{"email": ' + email + '}';
    // const options = {
    //   hostname: 'https://parseapi.back4app.com',
    //   path: '/verificationEmailRequest',
    //   method: 'POST',
    //   headers: {
    //     'X-Parse-Application-Id': 'QIxx0z05s7WTf8IDw3vejf6IBS2Zi6n29e8UOUtE',
    //     'X-Parse-REST-API-Key': 'x9B5zmNSw9n3rBlODMptjBK7sZ4Jna9VL9x9wIqv',
    //     'Content-Type': 'application/json'
    //   }
    // };

  }

  //#endregion
  //#region Student File && Univ name Find
  async findUniv(univname) {
    let univs = []
    let query = new Parse.Query("univ");
    query.contains("univ_name", univname);
    query.limit(4);
    let r = await query.find().catch(function (error) { console.log("Error: " + error.code + " " + error.message); })
    if (r) {
      univs = r.map((user) => {
        return {
          id: user.id,
          univ_name: user.attributes.univ_name
        };
      });
      return univs;
    }
  }


  //#endregion
  //#region BBS
  async createBbs(bbstype, meetingdate, max, gender, startplace, endplace, cost) {
    const bbs = Parse.Object.extend('bbs');
    const User = (await this.readUser_filter("nickname", this.user.get('nickname')))[0];
    const newObj = new bbs();
    newObj.set('available', 1);
    newObj.set('bbstype', bbstype);
    newObj.set('leader', User);
    newObj.set('meetingdate', meetingdate);
    newObj.set('gender', gender);
    newObj.set('personmax', max);
    newObj.set('personpresent', 1);
    newObj.set('personmember', [User]);
    newObj.set('startplace', startplace);
    newObj.set('endplace', endplace);
    newObj.set('cost', cost);

    newObj.save().then((r) => {
      if (typeof document !== 'undefined') document.write(`bbs created: ${JSON.stringify(r)}`);
      console.log('bbs created', r);
    }, (e) => {
      if (typeof document !== 'undefined') document.write(`Error while creating bbs: ${JSON.stringify(e)}`);
      console.error('Error while creating bbs: ', e);
    }
    );
  }
  async readBbs_objid(objid) {
    const bbs = Parse.Object.extend('bbs');
    const query = new Parse.Query(bbs);
    return await query.get(objid);
  }
  async readBbs_filter(rows, val) {
    const bbs = Parse.Object.extend('bbs');
    let query = new Parse.Query(bbs);
    query.equalTo(rows, val);
    return await query.find();
  }
  updateBbs(objKey, row, value) {
    const bbs = Parse.Object.extend('bbs');
    const query = new Parse.Query(bbs);
    query.get(objKey).then((object) => {
      object.set(row, value);
      object.save().then((response) => {
        if (typeof document !== 'undefined') document.write(`Updated bbs: ${JSON.stringify(response)}`);
        console.log('Updated bbs', response);
      }, (error) => {
        if (typeof document !== 'undefined') document.write(`Error while updating bbs: ${JSON.stringify(error)}`);
        console.error('Error while updating bbs', error);
      });
    });
  }
  deleteBbs(objKey) {
    const bbs = Parse.Object.extend('bbs');
    const query = new Parse.Query(bbs);
    query.get(objKey).then((object) => {
      object.destroy().then((response) => {
        if (typeof document !== 'undefined') document.write(`Deleted bbs: ${JSON.stringify(response)}`);
        console.log('Deleted bbs', response);
      }, (error) => {
        if (typeof document !== 'undefined') document.write(`Error while deleting bbs: ${JSON.stringify(error)}`);
        console.error('Error while deleting bbs', error);
      });
    });
  }
  //#endregion


  // return ([{ "cost": 1, "bbsid": 1, "gender": 1, "bbsDate": "2020-11-15 00:09:46.000000", "bbstype": 1, "endplace": "endplace 1", "available": 1, "personmax": 1, "leadername": "minsekim", "startplace": "startplace 1", "meetingdate": "2020-11-15 00:09:46.000000", "personmember": "personmember 1", "personpresent": 0 }
  //   , { "cost": 2, "bbsid": 2, "gender": 2, "bbsDate": "2020-11-15 00:09:46.000000", "bbstype": 1, "endplace": "endplace 2", "available": 1, "personmax": 2, "leadername": "ohju", "startplace": "startplace 2", "meetingdate": "2020-11-15 00:09:46.000000", "personmember": "personmember 2", "personpresent": 1 }])

  async getBbs(bbsid) {
    // REST API 5. bbsid를 통해 특정 bbs하나만 가져오는 것.(chats포함)
    // fetch(<EC2:url>/bbs/get/bbsid/bbsid값)
    return ({ "cost": 1, "bbsid": 1, "chats": [{ "say": "님이 입장하셨습니다.", "time": "2020-11-14 22:22:06", "isSys": 2, "nickname": "minsekim" }, { "say": "테스트 공지사항입니다.", "time": "2020-11-14 22:22:06", "isSys": 1, "nickname": "NULL" }, { "say": "안녕하세요?", "time": "2020-11-14 22:22:06", "isSys": 0, "nickname": "minsekim" }, { "say": "테스트 공지사항입니다.", "time": "2020-11-14 22:22:06", "isSys": 1, "nickname": "NULL" }, { "say": "안녕하세요?", "time": "2020-11-14 22:22:06", "isSys": 0, "nickname": "minsekim" }, { "say": "테스트 공지사항입니다.", "time": "2020-11-14 22:22:06", "isSys": 1, "nickname": "NULL" }, { "say": "안녕하세요?", "time": "2020-11-14 22:22:06", "isSys": 0, "nickname": "minsekim" }, { "say": "테스트 공지사항입니다.", "time": "2020-11-14 22:22:06", "isSys": 1, "nickname": "NULL" }, { "say": "안녕하세요?", "time": "2020-11-14 22:22:06", "isSys": 0, "nickname": "minsekim" }, { "say": "테스트 공지사항입니다.", "time": "2020-11-14 22:22:06", "isSys": 1, "nickname": "NULL" }, { "say": "안녕하세요?", "time": "2020-11-14 22:22:06", "isSys": 0, "nickname": "minsekim" }], "gender": 1, "bbsDate": "2020-11-15 00:09:46.000000", "bbstype": 1, "endplace": "endplace 1", "available": 1, "personmax": 4, "leadername": 1, "startplace": "startplace 1", "meetingdate": "2020-11-15 00:09:46.000000", "personmember": "personmember 1", "personpresent": 1 });
  }
  async isEnter(bbs) {
    const update = await this.getBbs(bbs.bbsid);
    if (update.gender != 2 && update.gender != this.user.gender) {
      alert("해당방은 성별 제한이 걸려있습니다.");
      return false;
    } else if (update.personpresent >= update.personmax) {
      alert("방이 가득찼습니다.");
      return false;
    } else if (false) {
      // REST API 3-1. chatScreen.js isEnter 유저가 방에 들어갈 수 있는지
      // 유저가 속한 bbstype(etc. 등교)의 수가 0인지 확인
      // true이면 bbs.bbsmember에 userid를 추가하고 bbs.persent를 1증가시킴.
      // fetch(<EC2:url>/bbs/isenter/userid/userid값/bbstype/bbstype값)
      // 반환: true/false
      alert(
        "채팅방은 카테고리별로 1개만 들어갈 수 있습니다. 내 채팅->채팅방->사람아이콘 클릭에서 채팅방 나가기를 해주세요."
      );
      return false;
    } else if (update.available != 1) {
      alert("삭제된 방입니다.");
      return false;
    }
    return true;
  }

  async isCreate(bbstype) {
    //REST API 3 - 2. createRoom.js isCreate
    //fetch(<EC2:url>/bbs/iscreate/userid/2/bbstype/1
    //반환 true / false
    // * if조건: isEnter과 비슷하게 카테고리(bbsytype)별로 1개씩만 만들 수 있음
    //isEnter과는 다르게 bbs의 값을 올리지 않음.
    return true;
  }
  async appendChat(bbsid, say) {
    // REST API 7. bbsid, say, user 이용해 채팅 추가후 bbs 1개 json반환
    // 올바르게 들어갔으면 bbs를 리턴합니다.
    // return getBbs(bbsid);
    const time = new Date();
    const user = this.user;
    let result = await this.getBbs(bbsid);
    return result;
    // 문제있으면 return false;
  }
  // 안건드려도돼는 부분
  // async getServerTime() {
  //   fetch("http://worldtimeapi.org/api/timezone/Asia/Seoul")
  //     .then((res) => res.json())
  //     .then((result) => {
  //       return (result.datetime.slice(0, 21) + result.datetime.slice(26, 32));
  //     });
  // }
  tokoreanTime(date) {
    const arr = ["Mon", "월", "Tue", "화", "Wed", "수", "Thu", "목", "Fri", "금", "Sat", "토", "Sun", "일", "Jan", "1월", "Feb", "2월", "Mar", "3월", "Apr", "4월", "May", "5월", "Jun", "6월", "Jul", "7월", "Aug", "8월", "Sep", "9월", "Oct", "10월", "Nov", "11월", "Dec", "12월",
    ]
    // date = String(date);
    date = String(date).split(" ");
    for (let j = 0; date[j] != null; j++) {
      for (let i = 0; arr[i] != null; i += 2) {
        if (date[j] == arr[i]) {
          date[j] = date[j].replace(arr[i], arr[i + 1]);
          j++;
          i = 0;
        }
      }
    }
    date = date[3] + "년 " + date[1] + " " + date[2] + "일 " + date[4] + "(" + date[0] + ")";
    return date;
  }
  isLogin() {
    if (this.user == null) {
      return false;
    } else {
      return true;
    }
  }
}
// const testFunc = () => {
//   var request = new XMLHttpRequest();

//   request.open("POST", "https://toss.im/transfer-web/linkgen-api/link");

//   request.setRequestHeader("Content-Type", "application/json");

//   request.onreadystatechange = function () {
//     if (this.readyState === 4) {
//       // console.log("Status:", this.status);
//       //console.log("Headers:", this.getAllResponseHeaders());
//       //console.log("Body:", this.responseText);
//       setTest(JSON.parse(this.responseText).success.link);
//     }
//   };

//   var body = {
//     apiKey: "dcf102a946024eafb1c3d61cbdba3c47",
//     bankName: "신한",
//     bankAccountNo: "1100452752310",
//     amount: 15000,
//     message: "토스입금버튼",
//   };

//   request.send(JSON.stringify(body));
// };        {/* sssssssssssssssssss */}
{/* <Button title="테스트버튼" onPress={testFunc} />
        <Button title="토스연동버튼" onPress={() => console.log(test)} /> */}
{/* sssssssssssssssssss */ }

const { AsyncStorage } = require('react-native');
const Parse = require('parse/react-native');
Parse.setAsyncStorage(AsyncStorage);
Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
Parse.initialize(
  'QIxx0z05s7WTf8IDw3vejf6IBS2Zi6n29e8UOUtE', // This is your Application ID
  'tlWTYuPFV70yWFnSGPni91d1zL1etwwCIwYqDh3m' // This is your Javascript key
);