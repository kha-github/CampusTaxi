import styled from "@emotion/native";
import {
  Alert,
  BackHandler,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
} from "react-native";
import * as RNIap from "react-native-iap";
import React, { Component, useEffect, useState } from "react";

import NativeButton from "apsl-react-native-button";
import { useNavigation } from "@react-navigation/native";
import { showToast } from "../../../components/layout/Toast";
import { StackNavigationProp } from "@react-navigation/stack";
import { PremiumStackParamList } from "./PremiumStackNavigation";

// App Bundle > com.dooboolab.test

const itemSkus = Platform.select({
  ios: ["com.campustaxi.campustaxi", "testinapp"],
  android: ["android.campustaxi.campustaxi", "testinapp"],
});

const itemSubs = Platform.select({
  ios: [
    "com.cooni.point1000",
    "com.cooni.point5000", // dooboolab
  ],
  android: ["android.campustaxi.campustaxi", "regularpayment"],
});

let purchaseUpdateSubscription: any;
let purchaseErrorSubscription: any;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.select({
      ios: 0,
      android: 24,
    }),
    paddingTop: Platform.select({
      ios: 0,
      android: 24,
    }),
    backgroundColor: "white",
  },
  header: {
    flex: 20,
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTxt: {
    fontSize: 26,
    color: "green",
  },
  content: {
    flex: 80,
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "stretch",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  btn: {
    height: 48,
    width: 240,
    alignSelf: "center",
    backgroundColor: "#00c40f",
    borderRadius: 0,
    borderWidth: 0,
  },
  txt: {
    fontSize: 16,
    color: "white",
  },
});

type MessageNavigation = StackNavigationProp<
  PremiumStackParamList,
  "PremiumScreen"
>;
export const PremiumScreen: React.FC = () => {
  const [productList, setProductList] = useState<Array<any>>([]);
  const [receipt, setReceipt] = useState<string>("");
  const [availableItemsMessage, setAvailableItemsMessage] = useState<string>(
    ""
  );

  //#region FUNCTIONS
  useEffect(() => {
    async () => {
      try {
        const result = await RNIap.initConnection();
        console.log("result", result);
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      } catch (e) {
        console.warn(e.code, e.message);
      }
    };
    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase: RNIap.InAppPurchase | RNIap.SubscriptionPurchase) => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          try {
            // if (Platform.OS === 'ios') {
            //   finishTransactionIOS(purchase.transactionId);
            // } else if (Platform.OS === 'android') {
            //   // If consumable (can be purchased again)
            //   consumePurchaseAndroid(purchase.purchaseToken);
            //   // If not consumable
            //   acknowledgePurchaseAndroid(purchase.purchaseToken);
            // }
            const ackResult = await RNIap.finishTransaction(purchase);
          } catch (ackErr) {
            console.warn("ackErr", ackErr);
          }
          setReceipt(receipt);
          Alert.alert("결제 완료", "결제가 정상적으로 처리되었습니다.");
          //Alert.alert("Receipt", receipt);
        }
      }
    );
    purchaseErrorSubscription = RNIap.purchaseErrorListener(
      (error: RNIap.PurchaseError) => {
        console.log("purchaseErrorListener", error);
        Alert.alert("결제 취소", "결제가 취소되었습니다.");
        //Alert.alert("purchase error", JSON.stringify(error));
      }
    );
    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }
      RNIap.endConnection();
    };
  }, []);

  const getItems = async (): Promise<void> => {
    try {
      if (!itemSkus) return;
      const products = await RNIap.getProducts(itemSkus);
      // const products = await RNIap.getSubscriptions(itemSkus);
      console.log("Products", products);
      setProductList(products);
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  const getSubscriptions = async (): Promise<void> => {
    try {
      if (!itemSubs) return;
      const products = await RNIap.getSubscriptions(itemSubs);
      console.log("Products", products);
      setProductList(products);
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };
  
  const getAvailablePurchases = async (): Promise<void> => {
    try {
      console.info(
        "Get available purchases (non-consumable or unconsumed consumable)"
      );
      const purchases = await RNIap.getAvailablePurchases();
      console.info("Available purchases :: ", purchases);
      if (purchases && purchases.length > 0) {
        setAvailableItemsMessage(`Got ${purchases.length} items.`);
        for (let i = 0; i<purchases.length; i+=1){
          setReceipt(purchases[i].transactionReceipt);
          console.log(JSON.parse(purchases[i].transactionReceipt).productId);
        }
      }
    } catch (err) {
      console.warn(err.code, err.message);
      Alert.alert(err.message);
    }
  };
  const requestPurchase = async (sku: string): Promise<void> => {
    try {
      RNIap.requestPurchase(sku);
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };
  const requestSubscription = async (sku: string): Promise<void> => {
    try {
      RNIap.requestSubscription(sku);
    } catch (err) {
      Alert.alert(err.message);
    }
  };
  //#endregion

  console.log(productList.length);
  //초기에 구독 정보를 가져옴
  if (productList.length === 0){
    getSubscriptions();
    setTimeout(()=>{
      getSubscriptions();
    }, 100);
  }

  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTxt}>react-native-iap V3</Text>
      </View>
      <View style={styles.content}>
        <ScrollView style={{ alignSelf: "stretch" }}>
          <View style={{ height: 50 }} />
          <NativeButton
            onPress={getAvailablePurchases}
            activeOpacity={0.5}
            style={styles.btn}
            textStyle={styles.txt}
          >
            현재 구매한 목록 확인
          </NativeButton>

          <Text style={{ margin: 5, fontSize: 15, alignSelf: "center" }}>
            {availableItemsMessage}
          </Text>

          <Text style={{ margin: 5, fontSize: 9, alignSelf: "center" }}>
            {receipt}
          </Text>

          
          {/* <NativeButton 
            onPress={() => getSubscriptions()}
            title="1개월 구독권"
            disabled={true}
            //onPress={getSubscriptions}
          /> */}
          
          {/* <NativeButton
            onPress={() => requestSubscription("regularpayment")}
            activeOpacity={0.5}
            style={styles.btn}
            textStyle={styles.txt}
          >
            상품을 가져오지 않고 결제합니다
          </NativeButton> */}

          {/* <NativeButton
            onPress={getItems}
            activeOpacity={0.5}
            style={styles.btn}
            textStyle={styles.txt}
          >
            Get Products ({productList.length})
          </NativeButton> */}

          

          {productList.map((product, i) => {
            return (
              <View
                key={i}
                style={{
                  flexDirection: "column",
                }}
              >
                {/* <Text
                  style={{
                    marginTop: 20,
                    fontSize: 12,
                    color: "black",
                    minHeight: 100,
                    alignSelf: "center",
                    paddingHorizontal: 20,
                  }}
                >
                  {JSON.stringify(product)}
                </Text> */}
                <NativeButton
                  onPress={() => requestSubscription(product.productId)}
                  activeOpacity={0.5}
                  style={styles.btn}
                  textStyle={styles.txt}
                >
                  구독하기
                </NativeButton>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const PurcahseButton = styled.TouchableOpacity`
  width: 0px;
  height: 0px;
`;