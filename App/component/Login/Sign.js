import * as React from "react";
import { Component, useState, createRef } from "react";
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";
import { bbsStore, userStore } from "store";
import { CheckBox } from "react-native";

export default class Sign1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      check: [true, true, true, true, true, true, true, true],
    };
  }
  render() {
    const { navigation } = this.props;
    function next(state) {
      if (state[1] && state[2] && state[3]) {
        navigation.navigate("회원 가입", { policy: state });
      } else {
        alert("필수 동의 부분이 빠져있습니다.");
      }
    }
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>이용동의</Text>
        <CheckBox
          disabled={false}
          value={this.state.check[0]}
          onValueChange={() => {
            let checkReturn = this.state.check;
            checkReturn[0] = !checkReturn[0];
            checkReturn = [
              checkReturn[0],
              checkReturn[0],
              checkReturn[0],
              checkReturn[0],
              checkReturn[0],
              checkReturn[0],
              checkReturn[0],
              checkReturn[0],
            ];
            this.setState({
              check: checkReturn,
            });
          }}
        />
        <Text>캠퍼스 택시의 모든 운영원칙에 동의</Text>
        <CheckBox
          disabled={false}
          value={this.state.check[1]}
          onValueChange={() => {
            let checkReturn = this.state.check;
            checkReturn[1] = !checkReturn[1];
            this.setState({
              check: checkReturn,
            });
          }}
        />
        <Text>서비스 이용약관 (필수)</Text>
        <Button
          title="자세히보기"
          onPress={() => navigation.navigate("서비스 이용약관")}
        />
        <CheckBox
          disabled={false}
          value={this.state.check[2]}
          onValueChange={() => {
            let checkReturn = this.state.check;
            checkReturn[2] = !checkReturn[2];
            this.setState({
              check: checkReturn,
            });
          }}
        />
        <Text>개인정보 처리방침 (필수)</Text>
        <Button
          title="자세히보기"
          onPress={() => navigation.navigate("개인정보처리방침")}
        />

        <CheckBox
          disabled={false}
          value={this.state.check[3]}
          onValueChange={() => {
            let checkReturn = this.state.check;
            checkReturn[3] = !checkReturn[3];
            this.setState({
              check: checkReturn,
            });
          }}
        />
        <Text>위치정보 이용약관(필수)</Text>
        <Button
          title="자세히보기"
          onPress={() => navigation.navigate("위치정보 이용약관")}
        />
        <CheckBox
          disabled={false}
          value={this.state.check[4]}
          onValueChange={() => {
            let checkReturn = this.state.check;
            checkReturn[4] = !checkReturn[4];
            checkReturn = [
              this.state.check[0],
              this.state.check[1],
              this.state.check[2],
              this.state.check[3],
              checkReturn[4],
              checkReturn[4],
              checkReturn[4],
              checkReturn[4],
            ];
            this.setState({
              check: checkReturn,
            });
          }}
        />
        <Text>마케팅 정보 수신 (선택)</Text>
        <Button
          title="자세히보기"
          onPress={() => navigation.navigate("마케팅 정보 수신")}
        />
        <CheckBox
          disabled={false}
          value={this.state.check[5]}
          onValueChange={() => {
            let checkReturn = this.state.check;
            checkReturn[5] = !checkReturn[5];
            this.setState({
              check: checkReturn,
            });
          }}
        />
        <Text>앱 Push</Text>
        <CheckBox
          disabled={false}
          value={this.state.check[6]}
          onValueChange={() => {
            let checkReturn = this.state.check;
            checkReturn[6] = !checkReturn[6];
            this.setState({
              check: checkReturn,
            });
          }}
        />
        <Text>SMS</Text>
        <CheckBox
          disabled={false}
          value={this.state.check[7]}
          onValueChange={() => {
            let checkReturn = this.state.check;
            checkReturn[7] = !checkReturn[7];
            this.setState({
              check: checkReturn,
            });
          }}
        />
        <Text>이메일</Text>
        <Button title="다음" onPress={() => next(this.state.check)} />
      </View>
    );
  }
}

import { Picker } from "@react-native-community/picker";
import * as ImagePicker from "expo-image-picker";
import { storage } from "firebase";
const firebase = require("firebase");
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
export class Sign2 extends React.Component {
  recaptchaVerifier = createRef();
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      nickname: "",
      countryNum: "+82",
      phoneNumber: "",
      verificationId: "",
      authBtn: "인증번호 전송하기",
      authCheck: false,
      authNum: "",
      signCheck: false,
      nickname: "",
      id: "",
      pw: "",
      pwCheck: "",
      gender: 1,
      email: "",
      address: "",
      studentcardCheck: false,
      studentcardBtn: "학생증 사진 선택",
      name: "",
      univ: "",
      error: "아무런 값이 입력되지 않았습니다.",
      policy: this.props.route.params.policy, //마케팅 정보 등 동의 사실 전달[true, true...]
    };
  }
  //#region Firebase Phone Auth Functions
  sendVerification = () => {
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    phoneProvider
      .verifyPhoneNumber(
        this.state.countryNum + this.state.phoneNumber,
        this.recaptchaVerifier.current
      )
      .then((result) =>
        this.setState({
          verificationId: result,
        })
      );
  };
  confirmCode = () => {
    const credential = firebase.auth.PhoneAuthProvider.credential(
      this.state.verificationId,
      this.state.authNum
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(() => {
        // 인증완료 작업
        userStore
          .findUserByAttributes(
            "j",
            this.state.countryNum + this.state.phoneNumber
          )
          .then((result2) => {
            if (result2 == null) {
              this.setState({
                authCheck: true,
              });
            } else {
              this.setState({
                authCheck: false,
                error: "이미 등록된 번호입니다.",
              });
            }
          });
      });
  };
  onimageurlChange = (url) => {
    this.setState({
      image: url,
    });
  };
  onChooseImagePress = async () => {
    var result = await ImagePicker.launchImageLibraryAsync(); // 라이브러리 선택

    if (!result.cancelled) {
      // 이미지 선택했다면 Check true + Error: undefined is not an object 가 발생하지만 무시하고 진행하면 이상하게 잘 됨
      //-> 사진 선택 시 발생하는 에러로 추측됨
      this.onimageurlChange(result.uri);
      try {
        this.checkStudentCard();
      } catch (error) {
        console.log("onChooseImagePress error:" + error); // error
      }
    }
  };
  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child(this.state.id + "/" + imageName); // child() 경로 지정.
    return ref.put(blob);
  };
  //#endregion
  //#region Input Function
  onChangedPhoneNumber(text) {
    let newText = "";
    let numbers = "0123456789";

    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      } else {
        alert("숫자만 입력해주세요.");
      }
    }
    this.setState({ phoneNumber: newText });
  }
  onChangedauthNum(text) {
    let newText = "";
    let numbers = "0123456789";

    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      } else {
        alert("숫자만 입력해주세요.");
      }
    }
    this.setState({ authNum: newText });
  }
  async onChangednickname(text) {
    await this.setState({ nickname: text });
    this.checkSign();
  }
  async onChangedid(text) {
    let newText = "";
    let numbers =
      "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";

    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      } else {
        alert("영어와 숫자만 입력해주세요.");
      }
    }
    await this.setState({ id: newText });
    this.checkSign();
  }
  async onChangedpw(text) {
    let newText = "";
    let numbers =
      "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM!@#$%^&*()";

    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      } else {
        alert("영어, 숫자, 특수문자 !@#$%^&*()만 입력해주세요.");
      }
    }
    await this.setState({ pw: newText });
    this.checkSign();
  }
  async onChangedpwCheck(text) {
    let newText = "";
    let numbers =
      "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM!@#$%^&*()";

    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      } else {
        alert("영어, 숫자, 특수문자 !@#$%^&*()만 입력해주세요.");
      }
    }
    await this.setState({ pwCheck: newText });
    this.checkSign();
  }
  onChangedgender(gender) {
    this.setState({ gender: gender });
  }
  onChangedemail(email) {
    this.setState({ email: email });
  }
  onChangedaddress(address) {
    this.setState({ address: address });
  }
  checkStudentCard() {
    if (
      this.state.name != "" &&
      this.state.univ != "" &&
      this.state.image != ""
    ) {
      this.setState({
        studentcardCheck: true,
      });
    } else {
      this.setState({
        studentcardCheck: false,
      });
    }
  }
  async onChangedname(name) {
    await this.setState({ name: name });
    this.checkStudentCard();
  }
  async onChangeduniv(univ) {
    await this.setState({ univ: univ });
    this.checkStudentCard();
  }
  checkSign() {
    if (
      (this.state.nickname.length > 3) & (this.state.id.length > 4) &&
      this.state.pw.length > 4 &&
      this.state.pwCheck.length > 4
    ) {
      if (this.state.pw == this.state.pwCheck) {
        userStore
          .findUserByAttributes("i", this.state.nickname)
          .then((result) => {
            if (result == null) {
              userStore
                .findUserByAttributes("f", this.state.id)
                .then((result2) => {
                  if (result2 == null) {
                    this.setState({
                      signCheck: true,
                      error: "휴대폰 및 학생증 인증을 완료해주세요.",
                    });
                  } else {
                    this.setState({
                      signCheck: false,
                      error: "중복된 아이디가 있습니다.",
                    });
                  }
                });
            } else {
              this.setState({
                signCheck: false,
                error: "중복된 닉네임이 있습니다.",
              });
            }
          });
      } else {
        this.setState({
          signCheck: false,
          error: "비밀번호과 비밀번호 확인이 다릅니다.",
        });
      }
    } else {
      this.setState({
        signCheck: false,
        error: "아이디/비밀번호는 5자 이상, 닉네임은 4자 이상이어야합니다.",
      });
    }
  }
  //#endregion
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{this.state.result}</Text>
        <CheckBox disabled={true} value={this.state.authCheck} />
        <Text>{this.state.authCheck ? "휴대폰 인증 완료" : "휴대폰 인증"}</Text>
        <Picker
          selectedValue={this.state.countryNum}
          style={{ height: 30, width: 130 }}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ countryNum: itemValue })
          }
          // https://ko.wikipedia.org/wiki/국제전화_나라_번호
        >
          <Picker.Item label="대한민국(+82)" value="+82" />
          <Picker.Item label="북한(+850)" value="+850" />
          <Picker.Item label="인도네시아(+62)" value="+850" />
        </Picker>
        <TextInput
          value={this.state.phoneNumber}
          onChangeText={(val) => this.onChangedPhoneNumber(val)}
          keyboardType="number-pad"
          maxLength={14}
          placeholder="01012341234"
          autoCompleteType="tel"
        />
        <TouchableOpacity onPress={this.sendVerification}>
          <Text>인증번호 전송</Text>
        </TouchableOpacity>
        <TextInput
          value={this.state.authNum}
          onChangeText={(val) => this.onChangedauthNum(val)}
          keyboardType="number-pad"
          maxLength={8}
          placeholder="12345678"
        />
        <TouchableOpacity onPress={this.confirmCode}>
          <Text>인증번호 확인</Text>
        </TouchableOpacity>
        <FirebaseRecaptchaVerifierModal
          ref={this.recaptchaVerifier}
          firebaseConfig={firebase.app().options}
        />
        <CheckBox disabled={true} value={this.state.signCheck} />
        <Text>
          {this.state.signCheck ? "회원 정보 입력 완료" : "회원 정보 입력"}
        </Text>
        <TextInput
          value={this.state.nickname}
          onChangeText={(val) => this.onChangednickname(val)}
          maxLength={20}
          placeholder="파리의택시드라이버"
        />
        <TextInput
          value={this.state.id}
          onChangeText={(val) => this.onChangedid(val)}
          maxLength={20}
          placeholder="slsl7862"
        />
        <TextInput
          value={this.state.pw}
          onChangeText={(val) => this.onChangedpw(val)}
          maxLength={20}
          placeholder="비밀번호"
        />
        <TextInput
          value={this.state.pwCheck}
          onChangeText={(val) => this.onChangedpwCheck(val)}
          maxLength={20}
          placeholder="비밀번호확인"
        />
        <Text>성별</Text>
        <Button
          title="남자"
          onPress={() => this.onChangedgender(0)}
          color={this.state.gender == 0 ? "#E5AF0B" : "#CBCED7"}
        />
        <Button
          title="여자"
          onPress={() => this.onChangedgender(1)}
          color={this.state.gender == 1 ? "#E5AF0B" : "#CBCED7"}
        />
        <TextInput
          value={this.state.email}
          onChangeText={(val) => this.onChangedemail(val)}
          maxLength={40}
          placeholder="이메일(선택) campustaxi@naver.com"
        />
        <TextInput
          value={this.state.address}
          onChangeText={(val) => this.onChangedaddress(val)}
          maxLength={40}
          placeholder="주소(선택) 서울 강북구 덕릉로52"
        />
        <CheckBox disabled={true} value={this.state.studentcardCheck} />
        <Text>
          {this.state.studentcardCheck ? "학생증 제출 완료" : "학생증 인증"}
        </Text>
        <Button title="학생증 사진 선택" onPress={this.onChooseImagePress} />

        <Image
          style={styles.logo}
          source={this.state.image ? { uri: this.state.image } : null}
        />
        <TextInput
          value={this.state.name}
          onChangeText={(val) => this.onChangedname(val)}
          maxLength={40}
          placeholder="이름(본명) 윤수정"
        />
        <TextInput
          value={this.state.univ}
          onChangeText={(val) => this.onChangeduniv(val)}
          maxLength={40}
          placeholder="학교 택시 대학교"
        />
        <Button
          title="가입 하기"
          onPress={async () => {
            this.confirmCode;
            if (
              this.state.authCheck &&
              this.state.signCheck &&
              this.state.studentcardCheck
            ) {
              this.uploadImage(this.state.image, "studentcard");
              await userStore.addUser(
                this.state.address,
                this.state.email,
                this.state.gender,
                this.state.id,
                this.state.pw,
                this.state.name,
                this.state.nickname,
                this.state.countryNum + this.state.phoneNumber,
                this.state.image,
                this.state.univ,
                this.state.policy
              );
              navigation.navigate("회원 가입 완료", {
                id: this.state.id,
                pw: this.state.pw,
              });
            } else {
              alert(
                "완료되지 않는 절차가 있습니다." + "\n사유:" + this.state.error
              );
            }
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // 학생증 인증 사진 출력하는 css.infile
  logo: {
    width: 300,
    height: 100,
  },
});

export class Sign3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.route.params.id,
      pw: this.props.route.params.pw,
    };
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>환영합니다!</Text>
        <Text>
          해당 어플은 삼육대학교 창업동아리 '캠퍼스택시'가 제작하고 운영하는
          어플입니다.
        </Text>
        <Text>현재에는 채팅과 방만들기 기능만을 제공하고 있습니다.</Text>
        <Text>
          N분의 1 계산은 TOSS앱, 택시 호출은 카카오 택시를 이용해 주세요!
        </Text>
        <Button
          title="처음으로 돌아가기"
          onPress={() => navigation.navigate("로그인")}
        />
        <Button
          title="로 그 인"
          onPress={() => {
            userStore.login(this.state.id, this.state.pw).then((result) => {
              if (result) {
                navigation.navigate("home");
              }
            });
          }}
        />
      </View>
    );
  }
}
