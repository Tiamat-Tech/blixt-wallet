import React, { useState, useEffect } from "react";
import { View, StyleSheet, InteractionManager } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { Icon } from "native-base";
import { StackNavigationProp } from "@react-navigation/stack";
import { getStatusBarHeight } from "react-native-status-bar-height";

import BarcodeMask from "../../components/BarCodeMask";
import { SendStackParamList } from "./index";
import { useStoreState } from "../../state/store";
import { blixtTheme } from "../../native-base-theme/variables/commonColor";
import Camera from "../../components/Camera";
import { Chain } from "../../utils/build";
import { RouteProp } from "@react-navigation/native";
import GoBackIcon from "../../components/GoBackIcon";
import { PLATFORM } from "../../utils/constants";
import usePromptLightningAddress from "../../hooks/usePromptLightningAddress";
import useEveluateLightningCode from "../../hooks/useEvaluateLightningCode";
import { toast } from "../../utils";
import { Alert } from "../../utils/alert";

interface ISendCameraProps {
  bolt11Invoice?: string;
  navigation: StackNavigationProp<SendStackParamList, "SendCamera">;
  route: RouteProp<SendStackParamList, "SendCamera">;
}
export default function SendCamera({ navigation, route }: ISendCameraProps) {
  const rpcReady = useStoreState((store) => store.lightning.rpcReady);
  const [cameraType, setCameraType] = useState<"front" | "back">("back");
  const [scanning, setScanning] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const promptLightningAddress = usePromptLightningAddress();
  const evaluateLightningCode = useEveluateLightningCode();

  const onCameraSwitchClick = () => {
    setCameraType(cameraType === "front" ? "back" : "front");
  };

  const onLightningAddressClick = async () => {
    setScanning(false);

    if ((await promptLightningAddress())[0]) {
      gotoNextScreen("LNURL", { screen: "PayRequest" }, false);
    } else {
      setScanning(true);
    }
  };

  const gotoNextScreen = (screen: string, options: any, goBackAfterInteraction = true) => {
    navigation.replace(screen, options);
  };

  const tryInvoice = async (paymentRequest: string, errorPrefix: string) => {
    if (!cameraActive || !scanning || !rpcReady) {
      return;
    }

    try {
      setCameraActive(false);
      setScanning(false);

      switch (await evaluateLightningCode(paymentRequest, errorPrefix)) {
        case "BOLT11":
          gotoNextScreen("Send", { screen: "SendConfirmation" });
          break;
        case "LNURLAuthRequest":
          gotoNextScreen("LNURL", { screen: "AuthRequest" }, false);
          break;
        case "LNURLChannelRequest":
          gotoNextScreen("LNURL", { screen: "ChannelRequest" });
          break;
        case "LNURLPayRequest":
          gotoNextScreen("LNURL", { screen: "PayRequest" }, false);
          break;
        case "LNURLWithdrawRequest":
          gotoNextScreen("LNURL", { screen: "WithdrawRequest" }, false);
          break;
        case null:
          setCameraActive(true);
          setScanning(true);
          break;
      }
    } catch (error: any) {
      toast(error.message, 13000, "danger");
    }
  };

  const onPasteClick = async () => {
    await tryInvoice(await Clipboard.getString(), "Clipboard paste error");
  };

  const onDebugPaste = async () => {
    const bolt11 =
      Chain === "mainnet"
        ? "lnbc1500n1pw5gmyxpp5tnx03hfr3tx2lx3aal045c5dycjsah6j6a80c27qmxla3nrk8xmsdp42fjkzep6ypxxjemgw3hxjmn8yptkset9dssx7e3qgehhyar4dejs6cqzpgxqr23s49gpc74nkm8em70rehny2fgkp94vwm6lh8ympp668x2asn8yf5vk76camftzte4nh3h8sf365vwx69mxp4x5p3s7jx8l57vaeqyr68gqx9eaf0"
        : "lntb12u1pww4ckdpp5xck8m9yerr9hqufyd6p0pp0pwjv5nqn6guwr9qf4l66wrqv3h2ssdp2xys9xct5da3kx6twv9kk7m3qg3hkccm9ypxxzar5v5cqp5ynhgvxfnkwxx75pcxcq2gye7m5dj26hjglqmhkz8rljhg3eg4hfyg38gnsynty3pdatjg9wpa7pe7g794y0hxk2gqd0hzg2hn5hlulqqen6cr5";
    await tryInvoice(bolt11, "Debug clipboard paste error");
  };

  const onBarCodeRead = async (data: string) => {
    await tryInvoice(data, "QR scan error");
  };

  return (
    <Camera
      active={cameraActive}
      cameraType={cameraType}
      onRead={onBarCodeRead}
      onNotAuthorized={() => {
        Alert.alert(
          "Not authorized.",
          "Camera access was not granted.\n" +
            "Blixt Wallet needs access to the camera in order to be able to scan QR-codes.",
        );
        setTimeout(() => navigation.goBack(), 1);
      }}
    >
      <View style={StyleSheet.absoluteFill}>
        <BarcodeMask
          showAnimatedLine={false}
          edgeColor={blixtTheme.primary}
          width={265}
          height={265}
        />
        <Icon
          type="Ionicons"
          name="at"
          style={sendStyle.lightningAddress}
          onPress={onLightningAddressClick}
        />
        <Icon
          type="Ionicons"
          name="camera-reverse"
          style={sendStyle.swapCamera}
          onPress={onCameraSwitchClick}
        />
        {(__DEV__ || PLATFORM === "web") && (
          <Icon
            type="MaterialCommunityIcons"
            name="debug-step-over"
            style={sendStyle.pasteDebug}
            onPress={onDebugPaste}
          />
        )}
        <Icon
          testID="paste-clipboard"
          type="FontAwesome"
          name="paste"
          style={sendStyle.paste}
          onPress={onPasteClick}
        />
        {PLATFORM !== "android" && <GoBackIcon style={sendStyle.goBack} />}
      </View>
    </Camera>
  );
}

const sendStyle = StyleSheet.create({
  goBack: {
    top: getStatusBarHeight(false) + 8,
    left: 8,
    position: "absolute",
    padding: 9,
  },
  lightningAddress: {
    position: "absolute",
    fontSize: 28,
    color: blixtTheme.light,
    padding: 9,
    top: getStatusBarHeight(false) + 8,
    right: 8 + 6,
  },
  swapCamera: {
    position: "absolute",
    fontSize: 26,
    color: blixtTheme.light,
    padding: 9,
    bottom: 10,
    left: 13,
  },
  paste: {
    position: "absolute",
    fontSize: 26,
    color: blixtTheme.light,
    padding: 9,
    bottom: 12,
    right: 8 + 8,
  },
  pasteDebug: {
    position: "absolute",
    fontSize: 26,
    color: blixtTheme.light,
    padding: 9,
    bottom: 12,
    right: 64 + 9,
  },
});
